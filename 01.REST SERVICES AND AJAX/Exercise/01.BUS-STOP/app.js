function getInfo() {
    const stopId = document.getElementById('stopId').value;
    const stopNameElement = document.getElementById('stopName');
    const busesField = document.getElementById('buses');
    const url = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;

    const clearOldData = () => {
        busesField.innerHTML = '';
    }

    const displayBusData = function ([busId, time]) {
        const listItem = document.createElement('li');
        listItem.textContent = `Bus ${busId} arrives in ${time}`;
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

    fetch(url)
        .then(response => response.json())
        .then(displayData)
        .catch(displayError);

}