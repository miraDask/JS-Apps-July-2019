function solve() {
    let currentId = 'depot';
    const infoBox = document.querySelector('div#info span');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    let currentStop = '';
    let url = '';

    const enableBtn = (btn) => {
        btn.disabled = false;
    }

    const disableBtn = (btn) => {
        btn.disabled = true;
    }

    const loadStop = ({ name, next }) => {
        infoBox.textContent = `Next stop ${name}`;
        currentId = next;
        currentStop = name;
        enableBtn(arriveBtn);
        disableBtn(departBtn);
    }
 
    const depart = () => {
        url = `https://judgetests.firebaseio.com/schedule/${currentId}.json`;

        fetch(url)
            .then(response => response.json())
            .then(loadStop);
    }

    const arrive = () => {
        infoBox.textContent = `Arriving at ${currentStop}`;
        enableBtn(departBtn);
        disableBtn(arriveBtn);
    }

    return {
        depart,
        arrive
    };
}

let result = solve();