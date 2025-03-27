import request from 'supertest'
import { app } from '../../src/app'
import { generateKey } from 'crypto'
import { title } from 'process'
import { HTTP_CODES } from '../../src/utility'

describe('/games', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })
    
    
    it(' Should return a empty database of games and 200 status code', async () => {
        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [])
    })

    it(`Should'nt get any game and should return 400`, async () => {
        await request(app)
        .get('/games/1')
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })
    
    let CreatedGame1 : any = null
    it(` Should create game with correct data`, async () => {
        let DataOfGame1 = {
            title: 'Europa Universalis 4',
            genre: 'Strategy'
        } 
        CreatedGame1 = await request(app)
        .post('/games')
        .send(DataOfGame1)
        .expect(HTTP_CODES.Created_201)
        expect(CreatedGame1.body).toEqual({id: expect.any(Number), title: DataOfGame1.title, genre: DataOfGame1.genre})

        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body])
    })

    it(`Should'nt create a new game and return a 400 Code status`, async () => {
        await request(app)
        .post('/games')
        .send({
            title: 'Europa Universalis 3',
            genre: ''
        })
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })

    let CreatedGame2 : any = null
    it(` Should create a second game with correct data`, async () => {
        let DataOfGame2 = {
            title: 'Europa Universalis 3',
            genre: 'Simulator'
        } 
        CreatedGame2 = await request(app)
        .post('/games')
        .send(DataOfGame2)
        .expect(HTTP_CODES.Created_201)
        expect(CreatedGame2.body).toEqual({id: expect.any(Number), title: DataOfGame2.title, genre: DataOfGame2.genre})

        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame2.body])
    })

    it(` Should change title of second game and return 200`, async () =>{
        await request(app)
        .put('/games/' + CreatedGame2.body.id)
        .send({title: "Fifa 19"})
        .expect(HTTP_CODES.OK_200, {id: CreatedGame2.body.id, title: "Fifa 19", genre: CreatedGame2.body.genre})
        CreatedGame2.body = {id: CreatedGame2.body.id, title: "Fifa 19", genre: CreatedGame2.body.genre}
        
        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame2.body])
    })

    it(` Should change genre of first game and return 200`, async () =>{
        let dataChange1 = {title: "", genre: "Global Strategy"}
        await request(app)
        .put('/games/' + CreatedGame1.body.id)
        .send(dataChange1)
        .expect(HTTP_CODES.OK_200, {id: CreatedGame1.body.id, title: "Europa Universalis 4", genre: dataChange1.genre})
        CreatedGame1.body = {id: CreatedGame1.body.id, title: CreatedGame1.body.title, genre: dataChange1.genre}
        
        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame2.body])
    })

    it(`Should'nt change any parametres and return 400`, async () => {
        await request(app)
        .put('/games/' + CreatedGame1.body.id)
        .send({title: "", genre: ""})
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })
    let CreatedGame3: any = null
    it(` Should create a third game with correct data`, async () => {
        let DataOfGame3 = {
            title: 'Euro Truck 2',
            genre: 'Simulator'
        } 
        CreatedGame3 = await request(app)
        .post('/games')
        .send(DataOfGame3)
        .expect(HTTP_CODES.Created_201)
        expect(CreatedGame3.body).toEqual({id: expect.any(Number), title: DataOfGame3.title, genre: DataOfGame3.genre})

        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame2.body, CreatedGame3.body])
    })

    it(`Should return first game and third with querry title parametr and 200`, async () => {
        await request(app)
        .get('/games?title=Euro')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame3.body])
    })

    it(`Should return second and third games with querry genre parametr and 200`, async() => {
        await request(app)
        .get('/games?genre=Simulator')
        .expect(HTTP_CODES.OK_200, [CreatedGame2.body, CreatedGame3.body])
    })

    it(`Should'nt delete any game with incorrect data`, async () => {
        await request(app)
        .delete('/games/1')
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })

    it(`Should delete third game`, async () => {
        await request(app)
        .delete('/games/' + CreatedGame3.body.id)
        .expect(HTTP_CODES.Deleted_204)

        await request(app)
        .get('/games')
        .expect(HTTP_CODES.OK_200, [CreatedGame1.body, CreatedGame2.body])
    })
})

describe('/people', () => {
    it(`Should return empty array of peoples and 200`, async () => {
        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [])
    })
    
    let New_person1 : any = null
    it (`Should create a new person and return 204`, async () => {
        let Data_person1 = {
            name: 'Artem',
            sex: 'male',
            age: 19,
            isOld: true
        }
        New_person1 = await request(app)
        .post('/people')
        .send(Data_person1)
        .expect(HTTP_CODES.Created_201)
        expect(New_person1.body)

        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [New_person1.body])
    })

    it(`Should'nt create any person and return 400`, async ()=> {
        let Data_person1 = {
            name: 'Artem',
            sex: '',
            age: 19,
            isOld: true
        }
        await request(app)
        .post('/people')
        .send(Data_person1)
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })

    it(`Should return person with name Artem and 200`, async () => {
        await request(app)
        .get('/people?name=Artem')
        .expect(HTTP_CODES.OK_200, [New_person1.body])
    })

    it(`Should return empty array with incorrect data and 200 code status`, async () => {
        await request(app)
        .get('/people?sex=female')
        .expect(HTTP_CODES.OK_200, [])
    })

    let New_person2 : any = null
    it (`Should create a new person and return 204`, async () => {
        let Data_person2 = {
            name: 'Semen',
            sex: 'male',
            age: 25,
            isOld: false
        }
        New_person2 = await request(app)
        .post('/people')
        .send(Data_person2)
        .expect(HTTP_CODES.Created_201)
        expect(New_person2.body)

        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person2.body])
    })

    let New_person3 : any = null
    it (`Should create a new person and return 204`, async () => {
        let Data_person3 = {
            name: 'Nadia',
            sex: 'female',
            age: 20,
            isOld: true
        }
        New_person3 = await request(app)
        .post('/people')
        .send(Data_person3)
        .expect(HTTP_CODES.Created_201)
        expect(New_person3.body)

        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person2.body, New_person3.body])
    })
    it(`Should change some info aboot third person and 200 stasus code`, async () => {
        let Data_Change1 = {
            name: 'Angelina',
            isOld: false
        }
        await request(app)
        .put('/people/Nadia')
        .send(Data_Change1)
        .expect(HTTP_CODES.OK_200, {name: 'Angelina', sex: 'female', age: New_person3.body.age, isOld: false})
        New_person3.body = {name: 'Angelina', sex: 'female', age: New_person3.body.age, isOld: false}
    })

    it (`Should return first and second person`, async () => {
        await request(app)
        .get('/people?sex=male')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person2.body])
    })

    it (`Should return first and third person`, async () => {
        await request(app)
        .get('/people?name=A')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person3.body])
    })

    it (`Should return second and third person`, async () => {
        await request(app)
        .get('/people?isOld=false')
        .expect(HTTP_CODES.OK_200, [New_person2.body, New_person3.body])
    })

    it (`Should delete third person and 204 status code`, async () => {
        await request(app)
        .delete('/people/Angelina')
        .expect(HTTP_CODES.Deleted_204)
    
        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person2.body])
    })

    it (`Should'nt delete any person with incorrect data and return 400 status code`, async () => {
        await request(app)
        .delete('/people/Arte')
        .expect(HTTP_CODES.BAD_REQUEST_400)
    
        await request(app)
        .get('/people')
        .expect(HTTP_CODES.OK_200, [New_person1.body, New_person2.body])
    })

    it (`Should'nt return any person and must return 400 status code`, async () => {
        await request(app)
        .get('/people?isOld=d')
        .expect(HTTP_CODES.BAD_REQUEST_400)
    })
})
