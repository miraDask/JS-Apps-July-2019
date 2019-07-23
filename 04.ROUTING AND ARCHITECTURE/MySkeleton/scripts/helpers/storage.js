const storage = function () {

    const getData = function (key) {
        return localStorage.getItem(key + constants.appKey);
    };

    const saveData = function (key, value) {
        localStorage.setItem(key + constants.appKey, JSON.stringify(value));
    };

    const saveUser = function (data) {
        saveData("userInfo", data);
        saveData("authToken", data._kmd.authtoken);
    };

    const deleteUser = function () {
        localStorage.removeItem("userInfo" + constants.appKey);
        localStorage.removeItem("authToken" + constants.appKey);
    };

    return {
        getData,
        saveData,
        saveUser,
        deleteUser,
    }
}();