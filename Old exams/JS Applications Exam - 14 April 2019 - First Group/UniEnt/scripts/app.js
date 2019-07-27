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
    
    this.get('#/create', userController.getCreate);
    this.post('#/create', userController.postCreate);

    this.get('#/edit', userController.getEdit);
    this.post('#/edit', userController.postEdit);

    this.get('#/user', userController.getUser);

    this.get('#/details/:itemId', itemController.getItemDetails)

    //TODO display all events on homePage
    //? handle notifications
    // edit event
    // delete event
    // ??? subscribe
});

(() => {
    app.run('#/home');
})();
