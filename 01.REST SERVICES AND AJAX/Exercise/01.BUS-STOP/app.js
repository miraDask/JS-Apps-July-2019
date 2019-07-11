function getInfo() {
    const inputField = document.getElementById('stopId');
    const stopId = inputField.value;
    const stopNameElement = document.getElementById('stopName');
    const busesField = document.getElementById('buses');
    const url = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;

    const clearOldData = () => {
        busesField.innerHTML = '';
    }

    const displayBusData = function ([busId, time]) {
        document.getElementById('stopId').value = '';
        const listItem = document.createElement('li');
        listItem.textContent = `Bus ${busId} arrives in ${time} minutes`;
        busesField.appendChild(listItem);
    }

    const displayData = function ({ name, buses }) {
        stopNameElement.innerHTML = name;
        clearOldData();
        Object.entries(buses).forEach(displayBusData);
    }

    const displayError = function () {
        stopNameElement.textContent = 'Error';
    }

    const clearInputField = () => {
        inputField.value = '';
    }

    fetch(url)
        .then(response => response.json())
        .then(displayData)
        .catch(displayError);

    clearInputField();
}