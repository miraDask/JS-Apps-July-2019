const userController = (() => {
    const {
        header,
        notifications,
        footer,
    } = constants.partials;

    const getRegister = function (context) {
        try {
            context.loadPartials({
                header,
                notifications,
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
                notifications,
                footer
            }).then(function () {
                this.partial(constants.partials.login);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }

    };

    const postRegister = function (context) {
        try {
            userModel.register(context.params)
                .then(validator.response)
                .then((data) => {
                    validator.password(context.params.password, context.params.rePassword);
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
                    storage.saveUser(data);
                    context.redirect('#/home');
                })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    const logout = function (context) {
        try {
            userModel.logout()
                .then(validator.response)
                .then(() => {
                    storage.deleteUser();
                    homeController.getHome(context);
                });
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    };

    const getUser = async function (context) {
        try {
            let items = await userModel.getItems();
            const userId = storage.getData('userId');
            console.log(items[0]._acl.creator)
            console.log(userId)

            items = items.filter(i => i._acl.creator === userId);
            context.items = items;
            context.count = items.length;
            context.hasCreatedEvents = items.length > 0;
            context.username = storage.getData('username');
            context.loggedIn = true;

            context.loadPartials({
                header,
                notifications,
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

            const loggedIn = storage.getData('username') !== null;

            if (loggedIn) {
                context.username = storage.getData('username');
                context.loggedIn = loggedIn;
            }

            context.loadPartials({
                header,
                notifications,
                footer
            }).then(function () {
                this.partial(constants.partials.itemCreate);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }
    //TODO CHECK

    const postCreate = function (context) {
        try {
            itemModel.create(context)
                .then(validator.response)
                .then((item) => {
                    storage.addItem(item);
                    context.redirect('#/user');
                })
        } catch (err) {
            console.log('error')
        }
    }

    const getEdit = function (context) {
        try {
            const loggedIn = storage.getData('username') !== null;

            if (loggedIn) {
                context.username = storage.getData('username');
                context.loggedIn = loggedIn;
            }

            context.loadPartials({
                header,
                notifications,
                footer
            }).then(function () {
                this.partial(constants.partials.itemEdit);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const postEdit = function (context) {
        try {
            itemModel.create(context)
                .then(validator.response)
                .then(() => {
                    //TODO
                })
        } catch (err) {

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
        getEdit,
        postEdit
    }
})();