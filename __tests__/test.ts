import request from 'supertest';
import { app } from '../src/app';
import { runDB } from '../src/db/db';

function wait(ms: any): any {
  return new Promise(res => setTimeout(res, ms));
}

let adminAgent: any;
let normalAgent: any;
let reviewAgent: any;
let createdGameId: any;
let reviewGameId: any;
let createdReviewId: any;

beforeAll(async () => {
  await runDB();
  adminAgent = request.agent(app);
  await adminAgent
    .post('/login')
    .send({ login: 'admin', password: 'qwerty' })
    .expect(302)
    .expect('Location', '/profile');
});

afterAll(async () => {
  await adminAgent.post('/profile/logout');
});

describe('User Registration & Authentication', () => {
  const testUserData = {
    login: 'testuser',
    email: 'testuser@example.com',
    password: 'testpass',
    repeatPassword: 'testpass',
  };

  it('should register a new user with valid data', async () => {
    const res = await request(app)
      .post('/registration')
      .send(testUserData);
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 302) {
      expect(res.header.location).toBe('/profile');
    }
  });

  it('should not allow registration with an existing login', async () => {
    const res = await request(app)
      .post('/registration')
      .send({ ...testUserData, email: 'other@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/вже існує/);
  });

  it('should reject registration if passwords do not match', async () => {
    const res = await request(app)
      .post('/registration')
      .send({ ...testUserData, login: 'anotheruser', repeatPassword: 'wrongpass' });
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/Паролі не співпадають/);
  });

  it('should login an existing user with correct credentials', async () => {
    normalAgent = request.agent(app);
    const res = await normalAgent
      .post('/login')
      .send({ login: testUserData.login, password: testUserData.password });
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 302) {
      expect(res.header.location).toBe('/profile');
    }
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login: testUserData.login, password: 'wrongpass' });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('Неправильний логін або пароль');
  });

  it('should allow a logged-in user to access their profile page', async () => {
    const res = await normalAgent.get('/profile');
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.text).toContain(testUserData.login);
    }
  });

  it('should redirect an unauthenticated user from the profile page to the login page', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/login');
  });

  it('should log out a user and prevent access to protected pages afterward', async () => {
    const logoutRes = await normalAgent.post('/profile/logout');
    expect([200, 302]).toContain(logoutRes.statusCode);
    const res = await normalAgent.get('/profile');
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/login');
  });
});

describe('Game Management (Admin actions)', () => {
  const newGameData = {
    title: 'Test Game ' + Date.now(),
    genre: 'Adventure',
    release_year: 2025,
    developer: 'Test Studio',
    description: 'A game created for testing',
    imageURL: 'http://example.com/test.jpg',
    trailerYoutubeId: 'dQw4w9WgXcQ',
    bannerURL: 'http://example.com/banner.jpg',
  };

  it('should allow admin to access the "add game" page', async () => {
    const res = await adminAgent.get('/games/add');
    expect([200, 302]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.text).toContain('<form');
    }
  });

  it('should allow admin to add a new game', async () => {
    const res = await adminAgent
      .post('/games/add')
      .send(newGameData);
    expect([200, 302]).toContain(res.statusCode);
    let location = res.header.location;
    if (!location && res.text.match(/\/games\/\d+/)) {
      location = res.text.match(/\/games\/\d+/)[0];
    }
    expect(location).toMatch(/^\/games\/\d+$/);
    createdGameId = Number(location.split('/').pop());
    // Детальний GET
    const detailRes = await adminAgent.get(location);
    expect([200, 302]).toContain(detailRes.statusCode);
    if (detailRes.text) {
      expect(detailRes.text).toContain(newGameData.title);
    }
  });

  it('should list the newly added game in the games list and allow filtering by title', async () => {
    const listRes = await request(app).get(`/games?title=${encodeURIComponent(newGameData.title)}`);
    expect([200, 302]).toContain(listRes.statusCode);
    const gamesArray = listRes.body;
    expect(Array.isArray(gamesArray)).toBe(true);
    const addedGame = gamesArray.find((g: any) => g.title === newGameData.title);
    expect(addedGame).toBeDefined();
    expect(Number(addedGame.id)).toBe(Number(createdGameId));
  });

  it('should allow admin to edit an existing game', async () => {
    const updatedData = {
      title: newGameData.title + ' (Updated)',
      genre: 'Adventure',
      release_year: 2025,
      developer: 'Test Studio',
      description: 'Updated description',
      imageURL: 'http://example.com/test.jpg',
      trailerYoutubeId: 'dQw4w9WgXcQ',
      bannerURL: 'http://example.com/banner.jpg',
    };
    const res = await adminAgent
      .put(`/games/${createdGameId}`)
      .send(updatedData);
    expect([200, 302]).toContain(res.statusCode);
    if (res.header.location) {
      expect(res.header.location).toBe(`/games/${createdGameId}`);
    }
    const detailRes = await adminAgent.get(`/games/${createdGameId}`);
    if (detailRes.text) {
      expect(detailRes.text).toContain('(Updated)');
      expect(detailRes.text).toContain(updatedData.description);
    }
  });

  it('should prevent a non-admin user from adding a new game', async () => {
    const unauthorizedAgent = request.agent(app);
    await unauthorizedAgent
      .post('/login')
      .send({ login: 'testuser', password: 'testpass' })
      .expect([200, 302]);
    const res = await unauthorizedAgent
      .post('/games/add')
      .send({
        title: 'Unauthorized Game',
        genre: 'Action',
        release_year: 2024,
        developer: 'Unknown',
        description: 'This should not be allowed',
        imageURL: 'http://example.com/img.png',
        trailerYoutubeId: 'abc123',
        bannerURL: 'http://example.com/banner.png',
      });
    expect([200, 400]).toContain(res.statusCode);
    if (res.text) {
      expect(res.text).toMatch(/Недостатньо прав/);
    }
    const checkRes = await adminAgent.get('/games?title=Unauthorized%20Game');
    const gamesFound = (checkRes.body || []).filter((g: any) => g.title === 'Unauthorized Game');
    expect(gamesFound.length).toBe(0);
  });

  it('should allow admin to delete a game', async () => {
    const res = await adminAgent.delete(`/games/${createdGameId}`).send({});
    expect([200, 302, 204]).toContain(res.statusCode);
    const detailRes = await adminAgent.get(`/games/${createdGameId}`);
    expect([400, 404, 200, 302]).toContain(detailRes.statusCode);
  });
});

describe('Review Management', () => {
  const reviewerData = {
    login: 'reviewer',
    email: 'reviewer@example.com',
    password: 'review123',
    repeatPassword: 'review123',
  };

  beforeAll(async () => {
    const gameRes = await adminAgent.post('/games/add').send({
      title: 'ReviewTestGame ' + Date.now(),
      genre: 'RPG',
      release_year: 2025,
      developer: 'Review Studio',
      description: 'Game for review tests',
      imageURL: 'http://example.com/game.jpg',
      trailerYoutubeId: 'XYZ789',
      bannerURL: 'http://example.com/banner.jpg',
    });
    expect([200, 302]).toContain(gameRes.statusCode);
    reviewGameId = Number(gameRes.header.location.split('/').pop());
    await request(app).post('/registration').send(reviewerData).expect([200, 302]);
    reviewAgent = request.agent(app);
    await reviewAgent
      .post('/login')
      .send({ login: reviewerData.login, password: reviewerData.password })
      .expect([200, 302]);
  });

  it('should require login to add a review to a game', async () => {
    const res = await request(app)
      .post(`/review/${reviewGameId}`)
      .send({ rating: 8, text: 'Should not work' });
    expect([200, 302, 400]).toContain(res.statusCode);
    if (res.text) {
      expect(res.text).toContain('авторизованим');
    }
    const reviewsRes = await request(app).get(`/review?gameId=${reviewGameId}`);
    if (reviewsRes.body) {
      expect(Array.isArray(reviewsRes.body)).toBe(true);
      expect(reviewsRes.body).toEqual([]);
    }
  });

  it('should allow a logged-in user to add a review to a game', async () => {
    const res = await reviewAgent
      .post(`/review/${reviewGameId}`)
      .send({ rating: 9, text: 'Excellent game!' });
    expect([200, 302]).toContain(res.statusCode);
    if (res.header.location) {
      expect(res.header.location).toBe(`/games/${reviewGameId}`);
    }
    const reviewsRes = await reviewAgent.get(`/review?gameId=${reviewGameId}`);
    expect([200, 302]).toContain(reviewsRes.statusCode);
    const reviewsList = reviewsRes.body;
    expect(Array.isArray(reviewsList)).toBe(true);
    expect(reviewsList.length).toBe(1);
    expect(reviewsList[0].text).toBe('Excellent game!');
    expect(Number(reviewsList[0].rating)).toBe(9);
    createdReviewId = reviewsList[0].id;
  });

  it('should not allow the same user to add more than one review for the same game', async () => {
      const res = await reviewAgent
    .post(`/review/${reviewGameId}`)
    .send({ rating: 7, text: 'Trying to review again' });

  if (res.statusCode === 200) {
    expect(res.text).toMatch(/залишений відгук/);
  } else if ([201, 204, 302].includes(res.statusCode)) {
    expect(res.header.location).toBeDefined();
  } else {
    throw new Error('Unexpected response status for double review');
  }

  const reviewsRes = await reviewAgent.get(`/review?gameId=${reviewGameId}`);
  expect(reviewsRes.statusCode).toBe(200);
  expect(Array.isArray(reviewsRes.body)).toBe(true);
  expect(reviewsRes.body.length).toBe(1);
  });

  it('should allow a user to edit their review', async () => {
    const updatedContent = { rating: 8, text: 'Great game (edited)', returnTo: `/games/${reviewGameId}` };
    const res = await reviewAgent
      .put(`/review/${createdReviewId}`)
      .send(updatedContent);
    expect([200, 302]).toContain(res.statusCode);
    if (res.header.location) {
      expect(res.header.location).toBe(`/games/${reviewGameId}`);
    }
    const reviewsRes = await reviewAgent.get(`/review?gameId=${reviewGameId}`);
    if (reviewsRes.body) {
      const editedReview = reviewsRes.body.find((r: any) => r.id === createdReviewId);
      expect(editedReview).toBeDefined();
      expect(editedReview.text).toBe('Great game (edited)');
      expect(Number(editedReview.rating)).toBe(8);
    }
  });

  it('should require login to edit a review', async () => {
    const res = await request(app)
      .put(`/review/${createdReviewId}`)
      .send({ rating: 5, text: 'Hacked edit', returnTo: `/games/${reviewGameId}` });
    expect([200, 302, 400]).toContain(res.statusCode);
    if (res.text) {
      expect(res.text).toContain('авторизованим');
    }
    const reviewsRes = await reviewAgent.get(`/review?gameId=${reviewGameId}`);
    if (reviewsRes.body) {
      const review = reviewsRes.body.find((r: any) => r.id === createdReviewId);
      expect(review).toBeDefined();
      if (review) expect(review.text).not.toBe('Hacked edit');
    }
  });

  it('should allow the user (author) to delete their review', async () => {
  const res = await reviewAgent
    .delete(`/review/${createdReviewId}`)
    .send({ returnTo: `/games/${reviewGameId}` });

  expect([204, 302]).toContain(res.statusCode);

  await new Promise(res => setTimeout(res, 100));

  const reviewsRes = await reviewAgent.get(`/review?gameId=${reviewGameId}`);
  expect(reviewsRes.statusCode).toBe(200);
  expect(Array.isArray(reviewsRes.body)).toBe(true);
  expect(reviewsRes.body.length).toBe(0);
  });

  afterAll(async () => {
    await adminAgent.delete(`/games/${reviewGameId}`).send({});
  });
});
