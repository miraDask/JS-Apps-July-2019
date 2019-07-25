(() => {
    const monkeysDiv = document.querySelector('.monkeys');

    monkeysDiv.addEventListener('click', handleClickEvent);

    displayMonkeys();

    function handleClickEvent(ev) {
        if(ev.target.tagName === 'BUTTON') {
            const infoDiv = ev.target.parentNode.getElementsByTagName('p')[0];
            infoDiv.style.display = infoDiv.style.display === 'none' ? '' : 'none'
            
        }
    }

    function displayMonkeys() {
        const templateText = document.getElementById('monkey-template').innerHTML;
        const templateFunc = Handlebars.compile(templateText);
        const html = templateFunc({
            monkeys
        });

        monkeysDiv.innerHTML = html;
    }
})();