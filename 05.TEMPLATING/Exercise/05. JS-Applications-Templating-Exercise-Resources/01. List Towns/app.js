(() => {
    const townsInput = document.getElementById('towns');
    const loadBtn = document.getElementById('btnLoadTowns');
    const root = document.getElementById('root');

    loadBtn.addEventListener('click', loadListOfTowns);

    async function loadListOfTowns(ev) {
        ev.preventDefault();
        
        const inputValue = townsInput.value;

        if (!inputValue) {
            return;
        }

        const towns = inputValue
            .split(', ')
            .map(t => ({
                name: t
            }))
        debugger

        const townsHtml = await getTowns(towns);
        root.innerHTML = townsHtml;
    }

    async function getTowns(towns) {
        const response = await fetch('templates/list.hbs');
        const listTemplate = await response.text();
        const templateFunc = Handlebars.compile(listTemplate);
        const html = templateFunc({
            towns
        });

        return html;
    }
})()