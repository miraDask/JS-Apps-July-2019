const userController = (() => {
    const {
        header,
        footer,
    } = constants.partials;

    const getRegister = function (context) {
        try {
            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.register);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    const getLogin = function (context) {
        try {
            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.login);
            })
        } catch (err) {
            // notificationsHandler.displayError(err.message);
        }

    };

    const postRegister = function (context) {
        try {

            const correctData = validator.register(context.params.username, context.params.password, context.params.rePassword)
            console.log(context);

            if (!correctData) {
                throw new Error(constants.errorMessages.register);
            }

            userModel.register(context.params)
                .then(validator.response)
                .then((data) => {
                    notificationsHandler.displayMessage(constants.successMessages.register)
                    storage.saveUser(data);
                    context.redirect('#/home');
                })

        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    const postLogin = function (context) {
        try {

            userModel.login(context.params)
                .then(validator.response)
                .then((data) => {
                    notificationsHandler.displayMessage(constants.successMessages.login);
                    storage.saveUser(data);
                    context.redirect('#/home');
                })
        } catch (err) {
            userController.getLogin(context)
            //notificationsHandler.displayError(err.message);
        }
    };

    const logout = function (context) {
        try {
            userModel.logout()
                .then(validator.response)
                .then(() => {
                    notificationsHandler.stopLoading();
                    notificationsHandler.displayMessage(constants.successMessages.logout);
                    storage.deleteUser();
                    homeController.getHome(context);
                });
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    const getUser = async function (context) {
        try {
            let currentUserOffers = [];
            let boughtItems = 0;
            const userId = storage.getData('userId');
            let items = await itemModel.getAllItems();
            items.forEach(i => {
                if(i._acl.creator === userId) {

                    currentUserOffers.push(i);
                }

                i.buyers.forEach(b => {
                    if(b === userId) {
                        boughtItems++;
                    }
                })
            });

            context.items = currentUserOffers;
            context.boughtItems = boughtItems;
            context.username = storage.getData('username');
            context.loggedIn = true;

            notificationsHandler.stopLoading();

            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.user);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getCreate = function (context) {

        try {
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');

            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.itemCreate);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const postCreate = function (context) {
        try {

            const dataIsCorrect = validator
                .create(context.params.product, context.params.description, context.params.price, context.params.pictureUrl)

            if(!dataIsCorrect) {
                throw new Error(constants.errorMessages.create)

            }

            itemModel.create(context)
                .then(validator.response)
                .then(() => {
                    notificationsHandler.displayMessage(constants.successMessages.created)
                    context.redirect('#/dashboard');
                })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    return {
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        logout,
        getUser,
        getCreate,
        postCreate,
    }
})();