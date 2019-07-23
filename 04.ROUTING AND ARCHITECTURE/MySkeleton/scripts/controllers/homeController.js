const homeController = (() => {
    const getHome = function (context) {

        const loggedIn = storage.getData('userInfo') !== null;

        if (loggedIn) {
            const username = JSON.parse(storage.getData('userInfo')).username;
            context.loggedIn = loggedIn;
            context.username = username;
        }

        context.loadPartials({
            header: constants.partials.header,
            footer: constants.partials.footer
        }).then(function () {
            this.partial(constants.partials.homePage);
        })
    };

    return {
        getHome
    }
})();