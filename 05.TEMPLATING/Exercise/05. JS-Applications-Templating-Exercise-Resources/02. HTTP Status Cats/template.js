(() => {
    const root = document.getElementById('allCats');

    root.addEventListener('click', (ev) => {
        if (ev.target.classList.contains('showBtn')) {
            showInfo(ev.target.parentNode);
            ev.target.textContent = 
                ev.target.textContent === 'Show status code' ?
                           'Hide status code' :
                           'Show status code';
        }
    });

    renderCatTemplate();

    function showInfo(parent) {
        const infoDiv = parent.querySelectorAll('.status')[0];
        infoDiv.style.display = infoDiv.style.display === 'none' ? '' : 'none';
    }

    function renderCatTemplate() {

        const template = document.getElementById('cat-template').innerHTML;
        const templateFunc = Handlebars.compile(template);
        const html = templateFunc({
            cats
        });
        root.innerHTML = html;
    }

})();