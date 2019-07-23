const userModel = (() => {

    const register = function (params) {
        const data = {
            username: params.username,
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

        const url = constants.url.login;
        const authString = constants.authorization.login;

        let headers = {
            headers: {
                Authorization: authString
            },
            body: JSON.stringify({...params})
        };

        return requester.post(url, headers);
    };

    const logout = function () {
    
        let url = constants.url.logout;
        let headers = {
            headers: {}
        };
        
        return requester.post(url, headers);
    };

    return {
        register,
        login,
        logout
    }
})();