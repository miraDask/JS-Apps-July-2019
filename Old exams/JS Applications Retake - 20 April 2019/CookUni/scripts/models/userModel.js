const userModel = (() => {

    const register = function (params) {
        const data = {
            //check what data is needed for register 
            //this is username-password example
            username: params.username,
            firstName : params.firstName,
            lastName : params.lastName,
            password: params.password
        };

        const url = constants.url.register;
        const authString = constants.authorization.login;

        const headers = {
            body: JSON.stringify(data),
            headers: {
                Authorization: authString
            }
        };

        return requester.post(url, headers);
    };

    const login = function (params) {
        notificationsHandler.displayLoading();
        const url = constants.url.login;
        const authString = constants.authorization.login;
        const headers = {
            headers: {
                Authorization: authString
            },
            body: JSON.stringify({
                ...params
            })
        };

        return requester.post(url, headers);
    };

    const logout = function () {
        const url = constants.url.logout;
        const headers = {
            headers: {}
        };

        return requester.post(url, headers);
    };

    return {
        register,
        login,
        logout,
    }
})();