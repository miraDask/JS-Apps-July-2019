const app = Sammy('#container', function () {

    this.use('Handlebars', 'hbs');

    // Home
    this.get('#/home', homeController.getHome);

    // User
    this.get('#/register', userController.getRegister);
    this.post('#/register', userController.postRegister);

    this.get('#/login', userController.getLogin);
    this.post('#/login', userController.postLogin);

    this.get('#/logout', userController.logout);

    this.get('#/user', userController.getUser);


    // Songs
    this.get('#/allItems', itemController.getItemsAll);

    this.get('#/create', userController.getCreate);
    this.post('#/create', userController.postCreate);

    this.get('#/details/:itemId', itemController.getItemDetails)

    this.get('#/details/:itemId/delete', itemController.getDelete);
   
    this.get('#/details/:itemId/like', itemController.manipulateItem);
    this.get('#/details/:itemId/listen', itemController.manipulateItem);

    this.get('#/user/:itemId/like', itemController.manipulateItem);
    this.get('#/user/:itemId/listen', itemController.manipulateItem);

});

(() => {
    app.run('#/home');
})();