const homeController = (function () {
    const getHome = async function (context) {
        const {
            header,
            notifications,
            footer,
            homePage
        } = constants.partials;

        //context.params.password = '';
        const loggedIn = storage.getData('username') !== null;
        
        if (loggedIn) {
            context.username = storage.getData('username');
            context.loggedIn = loggedIn;
            //debugger
            items = await userModel.getItems();
           
            // TODO MOVE userModel.getItems TO ITEMCONTROLLER  AND ITEMMODEL
            if (!storage.getData('items')) {
                storage.saveData('items', JSON.stringify(items));
            } 

            context.hasCreated = items.length > 0;
            context.items = items;
            
        } 

        context.loadPartials({
            header,
            notifications,
            footer
        }).then(function () {
            this.partial(homePage);
        })
    };

    return {
        getHome
    }
})();