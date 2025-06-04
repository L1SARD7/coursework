fetch('/games')
    .then(response => response.json())
    .then(games => {
        const list = document.getElementById('game-list');
        list.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');
            li.className = 'game-item';
            li.innerHTML = `<strong>${game.title}</strong><br>
                <span>Жанр: ${game.genre || 'N/A'}</span>
                ${game.year ? `<br><span>Рік: ${game.year}</span>` : ''}`;
            list.appendChild(li);
    li.innerHTML = `<a href="/games/${game.id}" style="color:#ffd700;">${game.title}</a><br>
    <span>Жанр: ${game.genre || 'N/A'}</span>
    ${game.year ? `<br><span>Рік: ${game.year}</span>` : ''}`;

        });
    })
    .catch(error => {
        document.getElementById('game-list').textContent = 'Помилка при завантаженні ігор!';
        console.error('Fetch error:', error);
    });

