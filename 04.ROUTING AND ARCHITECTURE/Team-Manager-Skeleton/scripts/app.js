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

        const handleAboutView = function () {
            const {
                header,
                footer,
                aboutPage
            } = partialsPaths;

            this.loggedIn = sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

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

        const handleLoggedInUserView = function () {
            const {
                username,
                password
            } = this.params;

            auth.login(username, password)
                .then(response => {
                    auth.saveSession(response);
                    auth.showInfo('Logged Successfully!');
                    this.loggedIn = sessionStorage.getItem('authtoken');
                    this.username = sessionStorage.getItem('username');
                    this.redirect('#/home');
                })
                .catch(auth.handleError);
        }

        const handleRegisteredUserView = function () {
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
                    this.loggedIn = sessionStorage.authtoken;
                    this.redirect('#/home');
                })
                .catch(auth.handleError);
        }

        const handleLogout = function () {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    this.redirect('#/home');
                    auth.showInfo('Logged Out Successfully!')
                })
                .catch(auth.handleError);
        }

        const handleCatalogView = function () {
            const {
                header,
                footer,
                team,
                catalogPage
            } = partialsPaths;

            teamsService.loadTeams(response => response.json())
                .then((teams) => {
                    this.loggedIn = sessionStorage.getItem('authtoken');
                    this.username = sessionStorage.getItem('username');
                    this.teams = teams;
                    this.hasNoTeam = !sessionStorage.getItem('teamId');

                    this.loadPartials({
                        header,
                        team,
                        footer
                    }).then(function () {
                        this.partial(catalogPage);
                    })
                })
        }

        const handleTeamDetailsView = function () {
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
                    this.loggedIn = sessionStorage.getItem('authtoken');
                    this.username = sessionStorage.getItem('username');
                    this.teamId = teamId;

                    teamsService.loadTeamDetails(teamId)
                        .then(team => {
                            this.members = members;
                            this.name = team.name;
                            currentTeam = team.name;
                            this.comment = team.comment;
                            this.isOnTeam = sessionStorage.teamId === teamId;
                            this.isAuthor = sessionStorage.userId === team._acl.creator;
                            this.hasNoTeam = !sessionStorage.teamId;

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

        const handleCreateTeamView = function () {
            const {
                header,
                footer,
                createForm,
                createPage
            } = partialsPaths;

            this.loggedIn = sessionStorage.getItem('authtoken');
            this.username = sessionStorage.getItem('username');

            this.loadPartials({
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

        const handleJoinTeam = function () {
            const teamId = this.params.teamId.substr(1);

            teamsService.joinTeam(teamId).
            then(() => {
                    sessionStorage.teamId = teamId;
                    this.redirect(`#/catalog/:${teamId}`);

                })
                .catch(auth.handleError);
            auth.showInfo(`You joined ${currentTeam} team successfully!`);
        }

        const handleLeaveTeam = function () {
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