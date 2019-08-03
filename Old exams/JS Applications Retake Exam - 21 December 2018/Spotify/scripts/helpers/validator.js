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

    const register = (username, password) => {
        const passwordIsCorrect = username.length >= 3 &&
            password.length >= 6;
        return passwordIsCorrect
    }

    return {
        response,
        register
    }
}()