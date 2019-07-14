function loadCommits() {
    const username = document.getElementById('username').value;
    const repository = document.getElementById('repo').value;
    const commitsUL = document.getElementById('commits');
    const url = `https://api.github.com/repos/${username}/${repository}/commits`;
 
    const responseChecker = (response) => {
        if(response.status > 300) {
            throw new Error(`Error: ${response.status} (${response.statusText})`);
        }

        return response;
    }
    
    const renderUserData = (userData) => {
        commitsUL.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        userData.forEach(data => {
            const li = document.createElement('li');
            const author = data.commit.author.name;
            const message = data.commit.message;

            li.textContent = `${author}: ${message}`;
            fragment.appendChild(li);
        });

        commitsUL.appendChild(fragment);
    }

    const renderErrorMessage = (errorMessage) => {
        commitsUL.innerHTML = `<li>${errorMessage}</li>`;
    }

    fetch(url)
        .then(responseChecker)
        .then(response => response.json())
        .then(renderUserData)
        .catch(error => {
            renderErrorMessage(error.message);
        })
}