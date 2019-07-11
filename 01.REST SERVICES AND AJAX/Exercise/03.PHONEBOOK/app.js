function attachEvents() {
    const btnLoad = document.getElementById('btnLoad');
    const btnCreate = document.getElementById('btnCreate');
    const phoneBook = document.getElementById('phonebook');
    const getAndPostUrl = 'https://phonebook-nakov.firebaseio.com/phonebook.json';

    const displayPhoneBookData = (data) => {
        phoneBook.innerHTML = '';
        Object.keys(data)
            .forEach(key => {
                const listItem = document.createElement('li');
                const btnDelete = document.createElement('button');

                const sendDeleteRequest = (data) => {
                    const deleteUrl = `https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`;

                    fetch(deleteUrl, {
                            method: 'delete',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(data),
                        })
                        .then(response => response.json())
                        .then(sendGetRequest)
                }

                listItem.textContent = `${data[key].person}: ${data[key].phone}`;
                btnDelete.textContent = 'Delete';
                btnDelete.addEventListener('click', sendDeleteRequest);
                listItem.appendChild(btnDelete);
                phoneBook.appendChild(listItem);
            })
    }

    const sendGetRequest = () => {
        fetch(getAndPostUrl)
            .then(response => response.json())
            .then(data => displayPhoneBookData(data))
            .catch(() => {
                phoneBook.innerHTML = 'There are no contacts in the phonebook at the moment!';
            })
    }

    const sendPostRequest = () => {
        const personInput = document.getElementById('person');
        const phoneInput = document.getElementById('phone');
        const person = personInput.value;
        const phone = phoneInput.value;
        const personData = {
            person,
            phone
        };

        fetch(getAndPostUrl, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(personData)
            })
            .then(response => response.json())
            .then(sendGetRequest)

        personInput.value = '';
        phoneInput.value = '';
    }


    btnLoad.addEventListener('click', sendGetRequest);
    btnCreate.addEventListener('click', sendPostRequest);
}

attachEvents();