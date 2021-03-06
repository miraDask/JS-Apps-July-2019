const app = Sammy('#root', function () {

    this.use('Handlebars', 'hbs');

    // Home
    this.get('#/home', homeController.getHome);

    // User
    this.get('#/register', userController.getRegister);
    this.post('#/register', userController.postRegister);

    this.get('#/login', userController.getLogin);
    this.post('#/login', userController.postLogin);

    this.get('#/logout', userController.logout);

    this.get('#/userPage', userController.getUser);


    // Item
    this.get('#/dashboard', itemController.getItemsAll);

    this.get('#/create', userController.getCreate);
    this.post('#/create', userController.postCreate);

    this.get('#/details/:itemId', itemController.getItemDetails)

    this.get('#/details/:itemId/edit', itemController.getEdit);
    this.post('#/details/:itemId/edit', itemController.postEdit);
    
    this.get('#/details/:itemId/delete', itemController.getDelete);
    this.post('#/details/:itemId/delete', itemController.postDelete);
   
    //depends on the current task
    this.get('#/details/:itemId/buy', itemController.manipulateItem);
    //------------------------------------------------------------------
});

(() => {
    app.run('#/home');
})();