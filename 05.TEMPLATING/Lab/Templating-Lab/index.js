(async (scope) => {
    const contacts = window.contacts;

    const getTemplatePath = (name) => {
        return `./templates/contact-${name}.hbs`;
    }

    const getTemplate = async (path) => {
        const response = await fetch(path);

        if (response.status >= 400) {
            throw new Error(err.statusText);
        }

        return await response.text();
    }

    const body = document.querySelector('body');
    const contactCardPath = getTemplatePath('card');
    const contactListPath = getTemplatePath('list');

    const contactList = await getTemplate(contactListPath);
    const contactCard = await getTemplate(contactCardPath);

    Handlebars.registerPartial('contactCard', contactCard);
    const templateFunc = Handlebars.compile(contactList);
    const html = templateFunc({
        contacts
    });

    body.innerHTML = html;

    const getParentElement = (node) => {
        let parent = node.parentNode;

        while (parent) {
            if (parent.className = 'contact card') {
                return parent;
            }

            parent = parent.parentNode;
        }
    }

    const showInfo = function (id) {
        const details = document.getElementById(id);
        
        if (details.style.display === 'none') {
            details.style.display = '';
        } else {
            details.style.display = 'none';
        }
    }

    scope.showInfo = showInfo;

})(window);