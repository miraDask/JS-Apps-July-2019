$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        const handleHomeView = function () { // takes context as param
            const {
                header,
                footer,
                homePage
            } = partialsPaths;

            this.loggedIn = !!sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

            this.loadPartials({
                    header,
                    footer
                })
                .then(function () {
                    this.partial(homePage);
                })
        }

        const handleAboutView = function () {
            const {
                header,
                footer,
                aboutPage
            } = partialsPaths;

            this.loadPartials({
                    header,
                    footer
                })
                .then(function () {
                    this.partial(aboutPage);
                })
        }

        const handleLoginView = function () {
            const {
                header,
                footer,
                loginForm,
                loginPage
            } = partialsPaths;

            this.loadPartials({
                    header,
                    footer,
                    loginForm
                })
                .then(function () {
                    this.partial(loginPage);
                })
        }

        const handleRegisterView = function () {
            const {
                header,
                footer,
                registerForm,
                registerPage
            } = partialsPaths;

            this.loadPartials({
                    header,
                    footer,
                    registerForm
                })
                .then(function () {
                    this.partial(registerPage);
                })
        }

        const handleLoggedInUserView = function (context) {
            const {
                username,
                password
            } = this.params;

            auth.login(username, password)
                .then(response => {
                    auth.saveSession(response);
                    auth.showInfo('Logged Successfully!');
                    this.loggedIn = sessionStorage.getItem('authtoken');
                    context.username = sessionStorage.getItem('username');
                    context.redirect('#/home');
                })
                .catch(auth.handleError);
        }

        const handleRegisteredUserView = function (context) {
            const {
                username,
                password,
                repeatPassword
            } = this.params;

            if (Object.values(username).some(p => p === '')) {
                auth.showError('All Fields Should Be Filled')
                return;
            }

            auth.register(username, password, repeatPassword)
                .then(response => {
                    auth.saveSession(response);
                    auth.showInfo('Registered Successfully!');
                    context.loggedIn = sessionStorage.authtoken;
                    context.redirect('#/home');
                })
                .catch(auth.handleError);
        }

        const handleLogout = function (context) {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    context.redirect('#/home');
                    auth.showInfo('Logged Out Successfully!')
                })
                .catch(auth.handleError);
        }

        const handleCatalogView = async function () {
            const {
                header,
                footer,
                team,
                catalogPage
            } = partialsPaths;

            teamsService.loadTeams(response => response.json())
            .then((teams) => {
                this.teams = teams;
                this.hasNoTeam = sessionStorage.getItem('teamId');
                
                this.loadPartials({
                    header,
                    team,
                    footer
                }).then(function () {
                    this.partial(catalogPage);
                })
            })
        }

        this.get('#/home', handleHomeView);
        this.get('#/about', handleAboutView);
        this.get('#/login', handleLoginView);
        this.post('#/login', handleLoggedInUserView);
        this.get('#/register', handleRegisterView);
        this.post('#/register', handleRegisteredUserView);
        this.get('#/logout', handleLogout);
        this.get('#/catalog', handleCatalogView);


    });

    app.run('#/home');
});