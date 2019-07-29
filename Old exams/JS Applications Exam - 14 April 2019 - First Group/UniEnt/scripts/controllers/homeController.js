const homeController = (function () {
    const getHome = async function (context) {
        try {
            const {
                notifications,
                header,
                footer,
                homePage
            } = constants.partials;

            //context.params.password = '';
            const loggedIn = storage.getData('username') !== null;

            if (loggedIn) {
                context.username = storage.getData('username');
                context.loggedIn = loggedIn;
                items = await itemModel.getAllItems();
                context.hasCreated = items.length > 0;
                context.items = items;
            }


            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(homePage);
            })

        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    return {
        getHome
    }
})();