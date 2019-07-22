$(() => {
    const app = Sammy('#main', function () {
        let currentTeam = '';
        this.use('Handlebars', 'hbs');

        //TODO EXPORT THESE IN CONTROLLER
        //TODO REFACTOR
        const handleHomeView = function () { // takes context as param
            const {
                header,
                footer,
                homePage
            } = partialsPaths;

            this.loggedIn = sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');
            this.hasTeam = !!sessionStorage.getItem('teamId');
            this.teamId = sessionStorage.getItem('teamId');
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
            const teamId = context.params.teamId.substr(1);
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
                            currentTeam = team.name;
                            context.comment = team.comment;
                            context.isOnTeam = sessionStorage.teamId === teamId;
                            context.isAuthor = sessionStorage.userId === team._acl.creator;
                            context.hasNoTeam = !sessionStorage.teamId;

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

        const createTeam = function () {
            const {
                name,
                comment
            } = this.params;

            if (!name) {
                auth.showInfo('Team name can not be empty!');
                return;
            }

            teamsService.createTeam(name, comment)
                .then((team) => {
                    const teamId = team._id
                    sessionStorage.teamId = teamId;
                    teamsService.joinTeam(teamId);
                    this.redirect(`#/catalog/:${teamId}`);
                })
        }

        const handleEditTeamView = function () {
            const {
                header,
                footer,
                editForm,
                editPage
            } = partialsPaths;

            this.teamId = sessionStorage.teamId;

            this.loadPartials({
                    header,
                    footer,
                    editForm
                })
                .then(function () {
                    this.partial(editPage);
                })
        }

        const editTeam = function () {
            const {
                name,
                comment
            } = this.params;
            const teamId = sessionStorage.teamId;

            if (!name) {
                auth.showInfo('Team name can not be empty!');
                return;
            }

            teamsService.edit(teamId, name, comment)
                .then(() => {
                    this.redirect(`#/catalog/:${teamId}`);
                })
        }

        const handleJoinTeam = function (context) {
            const teamId = this.params.teamId.substr(1);

            teamsService.joinTeam(teamId).
            then(() => {
                    sessionStorage.teamId = teamId;
                    this.redirect(`#/catalog/:${teamId}`);

                })
                .catch(auth.handleError);
            auth.showInfo(`You joined ${currentTeam} team successfully!`);
        }

        const handleLeaveTeam = function (context) {
            const teamId = sessionStorage.teamId;

            teamsService.leaveTeam().
            then(() => {
                    this.redirect(`#/catalog/:${teamId}`);
                    sessionStorage.teamId = '';
                })
                .catch(auth.handleError);

            auth.showInfo(`You leaved ${currentTeam} team successfully!`);

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
        this.post('#/create', createTeam);
        this.get('#/edit/:teamId', handleEditTeamView);
        this.post('#/edit/:teamId', editTeam);
    });

    app.run('#/home');
});