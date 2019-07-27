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

    const addItem = function (item) {
        const items = JSON.parse(getData('items'));
        items.push(item);
        localStorage["items"] = JSON.stringify(items);
    }

    const getItems = function () {
        return JSON.parse(getData('items'));
    }

    const deleteUser = function () {
        localStorage.clear()
    };

    return {
        getData,
        saveData,
        saveUser,
        deleteUser,
        addItem,
        getItems
    }
}();