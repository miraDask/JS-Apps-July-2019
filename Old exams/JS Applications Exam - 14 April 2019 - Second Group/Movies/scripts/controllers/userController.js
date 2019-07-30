const userController = (() => {
    const {
        notifications,
        header,
        footer,
    } = constants.partials;

    const getRegister = function (context) {
        try {
            context.loadPartials({
                notifications,
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
                notifications,
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
           
           const correctData = validator.register(context.params.username, context.params.password, context.params.repeatPassword)
            console.log(context);
            
            if(!correctData) {
                throw new Error(constants.errorMessages.register)
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
                    notificationsHandler.displayMessage(constants.successMessages.login)
                    storage.saveUser(data);
                    context.redirect('#/home');
                })
        } catch (err) {
          //  notificationsHandler.displayError(err.message);
        }
    };

    const logout = function (context) {
        try {
            userModel.logout()
                .then(validator.response)
                .then(() => {
                    notificationsHandler.displayMessage(constants.successMessages.logout)
                    storage.deleteUser();
                    homeController.getHome(context);
                });
        } catch (err) {
           // notificationsHandler.displayError(err.message);
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
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.user);
            })
        } catch (err) {
           // notificationsHandler.displayError(err.message);
        }
    }

    const getCreate = function (context) {

        try {
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
          
            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(constants.partials.itemCreate);
            })
        } catch (err) {
          //  notificationsHandler.displayError(err.message);
        }
    }

    const postCreate = function (context) {
        try {
           
            itemModel.create(context)
                .then(validator.response)
                .then(() => {
                  //  notificationsHandler.displayMessage(constants.successMessages.created)
                    context.redirect('#/user');
                })
        } catch (err) {
          //  notificationsHandler.displayError(err.message);
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