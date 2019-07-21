$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        const handleHomeView = function () { // takes context as param
            const {
                header,
                footer,
                homePage
            } = partialsPaths;

            this.loggedIn = sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

            this.loadPartials({
                    header,
                    footer
                })
                .then(function () {
                    this.partial(homePage);
                })
        }

        const handleAboutView = function (context) {
            const {
                header,
                footer,
                aboutPage
            } = partialsPaths;

            context.loggedIn = sessionStorage.getItem('authtoken');
            context.username = sessionStorage.getItem('username');

            context.loadPartials({
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
                    context.loggedIn = sessionStorage.getItem('authtoken');
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

        const handleCatalogView = function (context) {
            const {
                header,
                footer,
                team,
                catalogPage
            } = partialsPaths;

            teamsService.loadTeams(response => response.json())
                .then((teams) => {
                    context.loggedIn = sessionStorage.getItem('authtoken');
                    context.username = sessionStorage.getItem('username');
                    context.teams = teams;
                    context.hasNoTeam = !sessionStorage.getItem('teamId');

                    this.loadPartials({
                        header,
                        team,
                        footer
                    }).then(function () {
                        this.partial(catalogPage);
                    })
                })
        }

        const handleTeamDetailsView = function (context) {
            const teamId = this.params.teamId.substr(1);

            const {
                header,
                footer,
                details,
                teamMember,
                teamControls
            } = partialsPaths;

            requester.get('user', '', 'kinvey')
                .then(users => {
                    const members = users.filter(u => u.teamId === teamId);
                    context.loggedIn = sessionStorage.getItem('authtoken');
                    context.username = sessionStorage.getItem('username');
                    context.teamId = teamId;

                    teamsService.loadTeamDetails(teamId)
                        .then(team => {
                            context.members = members;
                            context.name = team.name;
                            context.comment = team.comment;
                            context.isOnTeam = sessionStorage.teamId === teamId;
                            context.isAuthor = sessionStorage.teamId === team._acl.creator;

                            this.loadPartials({
                                    header,
                                    teamMember,
                                    teamControls,
                                    footer
                                })
                                .then(function () {
                                    this.partial(details)
                                })
                        })
                        .catch(auth.handleError);
                })
                .catch(auth.handleError);
        }

        // TODO => JOIN TEAM
        // TODO => LEAVE TEAM
        //TODO => CREATE TEAM
        //TODO => EDIT TEAM

        const handleCreateTeamView = function (context) {
            const {
                header,
                footer,
                createForm,
                createPage
            } = partialsPaths;

            context.loggedIn = sessionStorage.getItem('authtoken');
            context.username = sessionStorage.getItem('username');

            context.loadPartials({
                    header,
                    footer,
                    createForm
                })
                .then(function () {
                    this.partial(createPage)
                })
        }

        // const createTeam = function() {

        // }

        const handleJoinTeam = function(context) {
            const teamId = this.params.teamId.substr(1);

            teamsService.joinTeam(teamId).
            then(() => {
            this.redirect(`#/catalog/:${teamId}`);
            })
            .catch(auth.handleError);
        }

        const handleLeaveTeam = function(context) {
            console.log(this)
            const teamId = sessionStorage.teamId.substr(1);

            teamsService.leaveTeam().
            then(() => {
            this.redirect(`#/catalog/:${teamId}`);
            })
            .catch(auth.handleError);
        }




        this.get('#/home', handleHomeView);
        this.get('#/about', handleAboutView);
        this.get('#/login', handleLoginView);
        this.post('#/login', handleLoggedInUserView);
        this.get('#/register', handleRegisterView);
        this.post('#/register', handleRegisteredUserView);
        this.get('#/logout', handleLogout);
        this.get('#/catalog', handleCatalogView);
        this.get('#/catalog/:teamId', handleTeamDetailsView);
        this.get('#/join/:teamId', handleJoinTeam);
        this.get('#/leave', handleLeaveTeam);


        this.get('#/create', handleCreateTeamView);
       // this.post('#/create', createTeam);


    });

    app.run('#/home');
});