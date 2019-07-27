const storage = function () {

    const getData = function (key) {
        return localStorage.getItem(key);
    };

    const saveData = function (key, value) {
        localStorage.setItem(key, value);
    };

    const saveUser = function (data) {
        saveData("username", data.username);
        saveData("authToken", data._kmd.authtoken);
        saveData("userId", data._id);

    };

    const deleteUser = function () {
        localStorage.clear()
    };

    return {
        getData,
        saveData,
        saveUser,
        deleteUser,
    }
}();