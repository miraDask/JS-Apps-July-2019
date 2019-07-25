const townsInput = document.getElementById('towns');
const loadBtn = document.getElementById('btnLoadTowns');
const root = document.getElementById('root');

loadBtn.addEventListener('click', loadListOfTowns)

function loadListOfTowns() {

    const towns = townsInput.value.split(', ')
        .reduce((acc, curr) => {
            acc[curr] = {
                name: curr
            };
            return acc;
        }, {})

    renderTowns(towns)

}

async function renderTowns(towns) {
    const response = await fetch('templates/list.hbs');
    const listTemplate = await response.text();
    const templateFunc = Handlebars.compile(listTemplate);
    const html = templateFunc({
        towns
    });
    root.innerHTML = html;
}