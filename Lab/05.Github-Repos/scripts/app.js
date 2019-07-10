function loadRepos() {
	const unsortedList = document.getElementById('repos');
	unsortedList.innerHTML = '';
	const username = document.getElementById('username').value;
	const url = `https://api.github.com/users/${username}/repos`;

	const parseData = ({ full_name, html_url }) => {
		return {
			link: html_url,
			name: full_name
		};
	}

	const toDomElement = ({ link, name }) => {
		const listItem = document.createElement('li');
		const linkElement = document.createElement('a');
		linkElement.href = link;
		linkElement.innerHTML = name;
		listItem.appendChild(linkElement);
		return listItem;
	}

	const displayRepos = function (data) {
		data.map(parseData)
			.map(toDomElement)
			.forEach(element => {
				unsortedList.appendChild(element);
			});
	}

	const displayError = function (err) {
		const listItem = document.createElement('li');
		listItem.textContent = err;
		unsortedList.appendChild(listItem);
	}


	fetch(url)
		.then(response => response.json())
		.then(data => displayRepos(data))
		.catch(error => displayError(error))
}