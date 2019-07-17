(function () {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_BkL3yFobr/books/';
    const authorizationString = 'Z3Vlc3Q6Z3Vlc3Q=';
    const headers = {
        'Authorization': `Basic ${authorizationString}`,
        'Content-Type': 'application/json'
    };

    let bookId = '';

    const elements = {
        btnSubmit: document.querySelector('form').lastElementChild,
        btnLoadBooks: document.getElementById('loadBooks'),
        inputTitle: document.getElementById('title'),
        inputAuthor: document.getElementById('author'),
        inputIsbn: document.getElementById('isbn'),
        tbody: document.querySelector('table tbody'),
        table: document.querySelector('table'),
        loading: document.getElementById('loading')
    }

    elements.btnLoadBooks.addEventListener('click', loadBooks);
    elements.btnSubmit.addEventListener('click', handleEvent);

    async function loadBooks() {
        elements.loading.hidden = false;
        elements.table.hidden = true;
        elements.btnSubmit.textContent = 'Submit';
        clearInputFields();
        const response = await fetch(baseUrl, {
            method: 'GET',
            headers
        });

        const books = await response.json();
        elements.tbody.innerHTML = '';
        elements.loading.hidden = true;
        elements.table.hidden = false;

        books.forEach(book => {
            const {
                title,
                author,
                isbn,
                _id
            } = book;
            const newTableRow = createTableRow(title, author, isbn, _id);
            elements.tbody.appendChild(newTableRow);
        });
    }

    async function handleEvent(e) {
        e.preventDefault();

        if (this.textContent === 'Submit') {
            await createNewBook();
        } else {
            await editBook();
        }
    }

    function displayForm() {
        const currentBookTableRow = this.parentNode.parentNode;
        bookId = currentBookTableRow.firstElementChild.id;
        const tdCollection = currentBookTableRow.children;
        elements.inputTitle.value = tdCollection[0].textContent;
        elements.inputAuthor.value = tdCollection[1].textContent;
        elements.inputIsbn.value = tdCollection[2].textContent;
        elements.table.hidden = true;
        elements.btnSubmit.textContent = 'Edit';
    }

    async function editBook() {
        const bookData = takeInputFieldsInfo();

        if (!bookData) {
            alert('Input fields can not be empty');
        } else {
            const url = baseUrl + bookId;
            clearInputFields();
            makePutRequest(url, bookData);
            const currentBookTableRow = document.getElementById(bookId).parentNode;
            const tdCollection = currentBookTableRow.children;
            tdCollection[0].textContent = bookData.title;
            tdCollection[1].textContent = bookData.author;
            tdCollection[2].textContent = bookData.isbn;
            elements.btnSubmit.textContent = 'Submit';
            elements.table.hidden = false;
        }
    }

    async function createNewBook() {
        const newBookData = takeInputFieldsInfo();

        if (!newBookData) {
            alert('Input fields can not be empty');
        } else {
            clearInputFields();
            await makePostRequest(newBookData);
            elements.btnLoadBooks.click();
        }
    }

    async function deleteBook() {
        const currentBookTableRow = this.parentNode.parentNode;
        bookId = currentBookTableRow.firstElementChild.id;
        const url = baseUrl + bookId;
        makeDeleteRequest(url);
        currentBookTableRow.remove();
    }

    async function makePostRequest(newBookData) {
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(newBookData)
            });

            responseHandler(response);
        } catch (err) {
            alert(err.message);
        }
    }

    async function makePutRequest(url, bookData) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(bookData)
            });

            responseHandler(response);

        } catch (err) {
            alert(err.message)
        }
    }

    async function makeDeleteRequest(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers,
            });

            responseHandler(response);
        } catch (err) {
            alert(err.message);
        }
    }

    function takeInputFieldsInfo() {
        const book = {
            title: elements.inputTitle.value,
            author: elements.inputAuthor.value,
            isbn: elements.inputIsbn.value
        }

        if (!book.title || !book.author || !book.isbn) {
            return null;
        }

        return book;
    }

    function clearInputFields() {
        elements.inputTitle.value = '';
        elements.inputAuthor.value = '';
        elements.inputIsbn.value = '';
    }

    function responseHandler(response) {
        if (response.status >= 400) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return response.json();
    }

    function createTableRow(title, author, isbn, bookId) {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        tdTitle.id = bookId;
        tdTitle.textContent = title;
        const tdAuthor = document.createElement('td');
        tdAuthor.textContent = author;
        const tdIsbn = document.createElement('td');
        tdIsbn.textContent = isbn;

        const btnWrapper = document.createElement('td');
        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Edit';
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnEdit.addEventListener('click', displayForm);
        btnDelete.addEventListener('click', deleteBook);
        btnWrapper.appendChild(btnEdit);
        btnWrapper.appendChild(btnDelete);

        tr.appendChild(tdTitle);
        tr.appendChild(tdAuthor);
        tr.appendChild(tdIsbn);
        tr.appendChild(btnWrapper);
        return tr;
    }
})();