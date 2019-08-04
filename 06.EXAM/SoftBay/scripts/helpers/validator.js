const validator = function () {

    const response = (response) => {
        if (response.status >= 400) {
            
            notificationsHandler.stopLoading();
            notificationsHandler.displayError(`Something went wrong. Error: ${response.statusText}`)
            throw new Error();
        }

        if (response.status !== 204) {
            response = response.json();
        }

        return response;
    }

    const register = (username, password, repeatedPassword) => {
        const passwordIsCorrect = username.length > 0 &&
            password === repeatedPassword;
        return passwordIsCorrect
    }


    const create = (product,description, price, url) => {
        const dataIsCorrect = product.length > 0 &&
            description.length > 0 &&
            price.length > 0 &&   // ???
            (url.startsWith('http://') || url.startsWith('https://'));

        return dataIsCorrect;
    }

    return {
        response,
        register,
        create
    }
}()