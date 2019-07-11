function solve() {
    let currentId = 'depot';
    const infoBox = document.querySelector('div#info span');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    let currentStop = '';
    let url = '';

    function depart() {
        url = `https://judgetests.firebaseio.com/schedule/${currentId}.json`;

        fetch(url)
            .then(response => response.json())
            .then(({ name, next }) => {
                infoBox.textContent = `Next stop ${name}`;
                currentId = next;
                currentStop = name;
                departBtn.disabled = true;
                arriveBtn.disabled = false;
            })
    }

    function arrive() {
        infoBox.textContent = `Arriving at ${currentStop}`;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();