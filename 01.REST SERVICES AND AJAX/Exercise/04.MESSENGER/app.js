function attachEvents() {
    const url = 'https://rest-messanger.firebaseio.com/messanger.json';
    const submitBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');
    const messagesInput = document.getElementById('messages');

    const getPost = () => {
        const authorInput = document.getElementById('author');
        const contentInput = document.getElementById('content');
        const author = authorInput.value;
        const content = contentInput.value;

        authorInput.value = '';
        contentInput.value = '';

        return { author, content};
    }

    const handlePostRequest = () => {
        const newPost = getPost();

        fetch(url, {
            method : 'post',
            headers : {
                'Content-type': 'application/json'
            },
            body : JSON.stringify(newPost)
        })
        .then(response => response.json);
    }

    const displayMessages = (data) => {
        messagesInput.value = '';
        Object.keys(data).forEach(key => {
            const {author, content} = data[key];
            messagesInput.value += `${author}: ${content}\n`;
        });
    }

    const handleGetRequest = () => {
        fetch(url)
        .then(response => response.json())
        .then(displayMessages)
    }

    submitBtn.addEventListener('click', handlePostRequest);
    refreshBtn.addEventListener('click', handleGetRequest);
}

attachEvents();