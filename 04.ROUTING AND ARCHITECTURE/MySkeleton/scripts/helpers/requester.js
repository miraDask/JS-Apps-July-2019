const requester = (() => {

    const get = function (url, headers) {
        headers.method = "GET";
        return makeRequest(url, headers);
    };

    const post = function (url, headers) {
        headers.method = "POST";
        return makeRequest(url, headers);
    };

    const put = function (url, headers) {
        headers.method = "PUT";
        return makeRequest(url, headers);
    };

    const del = function (url, headers) {
        headers.method = "DELETE";
        return makeRequest(url, headers);
    };

    const makeRequest = function (url, headers) {

        headers.headers["Content-Type"] = "application/json";

        if (storage.getData('userInfo') !== null) {
            headers.headers["Authorization"] = constants.authorization.session;
        }

        return fetch(url, headers);
    };

    return {
        get,
        post,
        del,
        put,
    }
})();