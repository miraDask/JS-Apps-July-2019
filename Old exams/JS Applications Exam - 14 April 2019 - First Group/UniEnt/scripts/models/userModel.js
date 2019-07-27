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

    const getItems = async function () {
        let items = null;

        if (storage.getData('items') !== null) {
            items = storage.getItems()
        } else {

            const url = constants.url.items;
            const headers = {
                headers: {}
            }

            const response = await requester.get(url, headers);
            items = await validator.response(response);
        }

        return items;
    }

    return {
        register,
        login,
        logout,
        getItems
    }
})();