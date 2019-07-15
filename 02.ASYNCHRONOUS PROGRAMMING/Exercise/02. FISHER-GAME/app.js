function attachEvents() {
    //TODO handle Errors
    const elements = {
        btnLoad: document.querySelector('button.load'),
        btnAdd: document.querySelector('button.add'),
        catches: document.getElementById('catches'),
        fieldset_addForm: document.querySelector('fieldset#addForm')
    }

    const basicUrl = 'https://fisher-game.firebaseio.com/catches';
    const getAndPostPrefix = '.json';

    const responseHandler = async (response) => {
        if (response.status > 400) {
            throw new Error(`Error: ${response.status}(${response.statusText})`);
        }

        return response.json();
    }

    const getCatchesData = async () => {
        const response = await fetch(basicUrl + getAndPostPrefix);
        return await responseHandler(response);
    }

    const createHtmlElement = (tagName, className, textContent) => {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }

    const parentAppendChildren = (childrenElements, parent) => {
        childrenElements.forEach(child => parent.appendChild(child));
    }

    const createFragment = (labelText, className, type, value) => {
        const fragment = document.createDocumentFragment();
        const label = createHtmlElement('label', '', labelText);
        const input = createHtmlElement('input', className, '');
        input.setAttribute('type', type);
        input.setAttribute('value', value);
        const hr = createHtmlElement('hr', '', '');
        parentAppendChildren([label, input, hr], fragment);
        return fragment;
    }

    const getInputFieldsValues = (element) => {
        const data = [...element.children]
            .filter(c => c.tagName === 'INPUT')
            .reduce((acc, curr) => {
                acc[curr.className] = curr.value;
                return acc;
            }, {});
        return data;
    }

    const makePostRequest = async (data) => {
        try {
            const response = await fetch(basicUrl + getAndPostPrefix, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        } catch (err) {
            throw new Error();
        }
    }

    const makeRequest = async (method, updatedData, catchId) => {
        const deleteAndUpdatePrefix = `/${catchId}.json`;

        try {
            const response = await fetch(basicUrl + deleteAndUpdatePrefix, {
                method,
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            return await response.json();
        } catch (err) {
            throw new Error();
        }
    }

    const changeCurrentCatch = async function () {
        let method = this.className === 'delete' ? 'delete' : 'put';

        const currentCatchDiv = this.parentNode;
        const id = currentCatchDiv.getAttribute('data-id');
        const updatedData = await getInputFieldsValues(currentCatchDiv);
        await makeRequest(method, updatedData, id);
        elements.btnLoad.click();
    }

    const renderCatchData = (id, data) => {
        const {
            angler,
            bait,
            location,
            species,
            captureTime,
            weight
        } = data;

        const divWrapper = createHtmlElement('div', 'catch');
        divWrapper.setAttribute('data-id', id);
        const anglerFragment = createFragment('Angler', 'angler', 'text', angler);
        const weightFragment = createFragment('Weight', 'weight', 'number', weight);
        const speciesFragment = createFragment('Species', 'species', 'text', species);
        const locationFragment = createFragment('Location', 'location', 'text', location);
        const baitFragment = createFragment('Bait', 'bait', 'text', bait);
        const captureTimeFragment = createFragment('Capture Time', 'captureTime', 'number', captureTime);
        const btnUpdate = createHtmlElement('button', 'update', 'Update');
        btnUpdate.addEventListener('click', changeCurrentCatch);
        const btnDelete = createHtmlElement('button', 'delete', 'Delete');
        btnDelete.addEventListener('click', changeCurrentCatch);

        parentAppendChildren([anglerFragment,
            weightFragment,
            speciesFragment,
            locationFragment,
            baitFragment,
            captureTimeFragment,
            btnUpdate,
            btnDelete
        ], divWrapper);
        parentAppendChildren([divWrapper], elements.catches);
    }

    const loadAllCatches = async () => {
        const catchesData = await getCatchesData();

        if (catchesData) {
            const catches = Object.keys(catchesData);
            elements.catches.innerHTML = '';
            catches.forEach(key => {
                renderCatchData(key, catchesData[key]);
            })
        }
    }

    const clearAddField = () => {
        [...elements.fieldset_addForm.children]
        .filter(e => e.tagName === 'INPUT')
            .map(e => e.value = '');
    }

    const inputsCheck = (data) => {
        return Object.values(data).some(v => v === '');
    }

    const createNewCatch = async () => {
        const newCatchData = getInputFieldsValues(elements.fieldset_addForm);
        const hasEmptyInput = inputsCheck(newCatchData);
        if (hasEmptyInput) {
            return;
        }
        
        await makePostRequest(newCatchData);
        clearAddField();
        loadAllCatches();
    }

    elements.btnLoad.addEventListener('click', loadAllCatches);
    elements.btnAdd.addEventListener('click', createNewCatch);
}

attachEvents();