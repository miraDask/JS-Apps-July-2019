function attachEvents() {
    const players = {};
    let playerId = 0;

    const authString = 'Z3Vlc3Q6Z3Vlc3Q=';
    const addPlayerMessage = 'Add new player...';
    const initialMoney = 500;
    const initialBullets = 6;
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_BkL3yFobr/players/';
    const divPlayers = document.getElementById('players');
    const btnAddPlayer = document.getElementById('addPlayer');
    const inputAddName = document.getElementById('addName');
    const canvas = document.querySelector('canvas');
    const btnSave = document.getElementById('save');
    const btnReload = document.getElementById('reload');

    btnReload.addEventListener('click', reload);
    btnSave.addEventListener('click', saveGame)


    window.onload = async () => {
        const playersData = await getPlayers();

        if (playersData.length === 0) {
            divPlayers.textContent = addPlayerMessage;
        } else {
            playersData.forEach(p => displayPlayer(p._id, p.name, p.money, p.bullets));
        }
    }

    btnAddPlayer.addEventListener('click', addPlayer);

    async function saveGame() {
        const player = players[playerId];

        const newData = {
            name : player.name,
            money: player.money,
            bullets: player.bullets
        }
        console.log(playerId)
        const url = baseUrl + playerId

        try {
            const response = await fetch(url , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${authString}`
                },
                body: JSON.stringify(newData)
            });

            const playerData = await responseHandler(response);
            editPayerInfo(playerData.money, playerData.bullets);

        } catch (err) {
            alert(err.message);
        }
    }

    function editPayerInfo(money, bullets) {
        const playerDiv = document.querySelector(`div.player[data-id="${playerId}"]`);
        playerDiv.querySelector('label.money').textContent = money;
        playerDiv.querySelector('label.bullets').textContent = bullets;
    }

    function reload() {
        const player = players[playerId];

        if (player.money >= 60) {
            player.money -= 60;
            player.bullets = 6;
        }
    }

    async function addPlayer() {
        if (!inputAddName.value) {
            alert('You should add player name!');
        } else {
            const newPlayer = {
                name: inputAddName.value,
                money: initialMoney,
                bullets: initialBullets
            }

            inputAddName.value = '';

            try {
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${authString}`
                    },
                    body: JSON.stringify(newPlayer)
                });

                const player = await responseHandler(response);
                displayPlayer(player._id, player.name, player.money, player.bullets);

            } catch (err) {
                alert(err.message);
            }
        }
    }

    function displayPlayer(id, name, money, bullets) {
        if (divPlayers.textContent === addPlayerMessage) {
            divPlayers.textContent = '';
        }

        const divWrapper = createElement('div', null, 'player');
        divWrapper.setAttribute('data-id', id);

        const divRowName = createElement('div', null, 'row');
        const labelName = createElement('label', null, null, 'Name:');
        const labelNameValue = createElement('label', null, null, name);
        parentAppendChildren(divRowName, [labelName, labelNameValue]);

        const divRowMoney = divRowName.cloneNode(true);
        divRowMoney.firstChild.textContent = 'Money:';
        divRowMoney.lastChild.textContent = money;
        divRowMoney.lastChild.className = 'money';

        const divRowBullets = divRowName.cloneNode(true);
        divRowBullets.firstChild.textContent = 'Bullets:';
        divRowBullets.lastChild.textContent = bullets;
        divRowBullets.lastChild.className = 'bullets';

        const btnPlay = createElement('button', null, 'play', 'Play');
        const btnDelete = createElement('button', null, 'delete', 'Delete');

        btnPlay.addEventListener('click', displayPlayGround)
        btnDelete.addEventListener('click', deletePlayer);

        parentAppendChildren(divWrapper, [divRowName, divRowMoney, divRowBullets, btnPlay, btnDelete]);
        parentAppendChildren(divPlayers, [divWrapper]);
    }

    function displayPlayGround() {
        playerId = this.parentNode.getAttribute('data-id');
        const player = players[playerId];
        loadCanvas(player);
        canvas.style.display = 'block';
        btnSave.style.display = 'inline-block';
        btnReload.style.display = 'inline-block';
    }

    async function deletePlayer() {
        const playerId = this.parentNode.getAttribute('data-id');
        const url = baseUrl + playerId;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${authString}`
                }
            });

            await responseHandler(response);
            this.parentNode.remove();

        } catch (err) {
            alert(err.message);
        }

        if (!divPlayers.textContent) {
            divPlayers.textContent = addPlayerMessage;
        }
    }

    async function getPlayers() {
        try {
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${authString}`
                }
            });

            const playersData = await responseHandler(response);
            playersData.forEach(p => {
                players[p._id] = p;
            })

            return playersData;

        } catch (err) {
            alert(err.message);
        }
    }

    function responseHandler(response) {
        if (response.status > 400) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    function createElement(tagName, id, className, textContent) {
        const element = document.createElement(tagName);

        if (id) {
            element.id = id;
        }

        if (className) {
            element.className = className;
        }

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }

    function parentAppendChildren(parentElement, childrenArray) {
        childrenArray.forEach(child => {
            parentElement.appendChild(child);
        });
    }
}