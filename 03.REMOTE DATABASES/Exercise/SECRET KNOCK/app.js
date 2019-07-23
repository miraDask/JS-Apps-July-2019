function knocking() {
    const username = 'guest';
    const password = 'guest';
    let queryValue = 'Knock Knock.';
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock';
    const loginUrl = 'https://baas.kinvey.com/user/kid_BJXTsSi-e/login';

    const loginAuthString = 'a2lkX0JKWFRzU2ktZTo0NDdiOGU3MDQ2ZjA0ODAzOWQ5NTYxMGMxYjAzOTM5MA==';
    const btnPush = document.querySelector('button');
    const result = document.getElementById('result');
    let counter = 1;
    let authToken = '';

    run();

    async function run() {
        try {
            const loginData = await login();
            authToken = loginData._kmd.authtoken;

            if (counter === 1) {
                btnPush.hidden = false;
            }

            btnPush.addEventListener('click', handleKnocking);
        } catch (err) {
            alert(err.message)
        }
    }

    async function login() {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${loginAuthString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })

        return responseHandler(response);
    }

    async function handleKnocking() {
        while (true) {
            if (counter > 1) {
                btnPush.hidden = true;
            }
            const query = `?query=${queryValue}`;
            const response = await sendGetRequest(authToken, query);

            queryValue = response.message;

            result.innerHTML += (`
        <h1>${response.answer}</h1>
    `)
            if (response.message) {
                result.innerHTML += (`
        <h1>${queryValue}</h1>
    `)
            }

            if (!response.message) {
                break;
            }
            counter++;
        }
    }

    async function sendGetRequest(authToken, query) {
        const response = await fetch(baseUrl + query, {
            method: 'GET',
            headers: {
                'Authorization': `Kinvey ${authToken}`,
                'Content-Type': 'application/json'
            }
        })

        return responseHandler(response);
    }

    function responseHandler(response) {
        if (response.status > 400) {
            throw new Error(`Error: ${response.status}(${response.statusText})`);
        }

        return response.json();
    }
}

knocking();