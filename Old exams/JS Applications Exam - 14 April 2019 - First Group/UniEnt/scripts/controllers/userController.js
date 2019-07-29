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
            passwordIsCorrect = validator.register(context.params.username, context.params.password, context.params.rePassword)
            if(!passwordIsCorrect) {
                throw new Error(`
                The username should be at least 3 characters long.
                The password should be at least 6 characters long.
                The repeat password should be equal to the password.
                `)
            }

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
            let items = await itemModel.getAllItems();
            const userId = storage.getData('userId');

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
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
          
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
                .then(() => {
                    context.redirect('#/home');
                })
        } catch (err) {
            console.log('error')
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