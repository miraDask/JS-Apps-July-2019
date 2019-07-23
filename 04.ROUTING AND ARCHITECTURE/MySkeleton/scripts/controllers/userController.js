const userController = (() => {

    const getRegister = function (context) {

        context.loadPartials({
            header: constants.partials.header,
            footer: constants.partials.footer
        }).then(function () {
            this.partial(constants.partials.register)
        })
    };

    const getLogin = function (context) {
        context.loadPartials({
            header: constants.partials.header,
            footer: constants.partials.footer
        }).then(function () {
            this.partial(constants.partials.login)
        })
    };

    const postRegister = function (context) {

        userModel.register(context.params)
            .then(helper.handler)
            .then((data) => {
                storage.saveUser(data);
                homeController.getHome(context);
            })
    };

    const postLogin = function (context) {

        userModel.login(context.params)
            .then(validator.response)
            .then((data) => {
                storage.saveUser(data);
                homeController.getHome(context);
            })
    };

    const logout = function (context) {

        userModel.logout()
            .then(validator.response)
            .then(() => {
                storage.deleteUser();
                homeController.getHome(context);
            });
    };

    return {
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        logout
    }
})();