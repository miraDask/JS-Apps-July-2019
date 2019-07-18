function knocking() {
    const username = 'guest';
    const password = 'guest';
    let queryValue = 'Knock Knock';
    const knockMessage = ' Knock again...'
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/knock';
    const loginUrl = 'https://baas.kinvey.com/user/kid_BJXTsSi-e/login';
    
    const loginAuthString = 'a2lkX0JKWFRzU2ktZTo0NDdiOGU3MDQ2ZjA0ODAzOWQ5NTYxMGMxYjAzOTM5MA==';
    const btnPush = document.querySelector('button');
    const h2 = document.getElementById('result');

    login();

    async function login() {
        try {
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

            const data = await responseHandler(response);
            btnPush.hidden = false;
            const authToken = data._kmd.authtoken;
            btnPush.addEventListener('click', async () => {
                h2.textContent = '';
                const query = `?query=${queryValue}`;
                const data = await sendGetRequest(authToken, query);
                if (!data) {
                    btnPush.textContent = 'Welcome!'
                    return;
                }

                queryValue = data.answer;
                h2.textContent = queryValue + knockMessage;

            });
        } catch (err) {
            alert(err.message)
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