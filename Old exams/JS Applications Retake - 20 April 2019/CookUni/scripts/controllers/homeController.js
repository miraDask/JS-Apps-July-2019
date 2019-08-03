const homeController = (function () {
    const getHome = async function (context) {

        try {
            const {
                header,
                footer,
                meal,
                homePage
            } = constants.partials;

            const loggedIn = storage.getData('username') !== null;

            if (loggedIn) {
                context.username = storage.getData('username');
                context.names = `${storage.getData('firstName')} ${storage.getData('lastName')}`;
                context.loggedIn = loggedIn;
                const items = await itemModel.getAllItems();
                
                context.items = items !== null;
                context.dairyProducts = items.dairyProducts;
                context.meat = items.meat;
                context.vegetables = items.vegetables;
                context.fruits = items.fruits;
                context.grainFood = items.grainFood;
            }

            context.loadPartials({
                header,
                footer,
                meal
            }).then(function () {
                
                this.partial(homePage);
            })

            notificationsHandler.stopLoading();

        } catch (err) {
            //notificationsHandler.displayError(err.message);
        }
    };

    return {
        getHome
    }
})();