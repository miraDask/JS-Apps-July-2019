const validator = function () {

    const response = (response) => {
        if (response.status >= 400) {

            throw new Error(`Something went wrong. Error: ${response.statusText}`);
        }

        if (response.status !== 204) {
            response = response.json();
        }

        return response;
    }

    const register = (username, password, repeatedPassword) => {
        const passwordIsCorrect = username.length >= 3 &&
            password.length >= 6 &&
            password === repeatedPassword;
        return passwordIsCorrect
    }

    // const create = ({imageURL, description, name, dateTime}) => {
    //     //TODO
    // }

    return {
        response,
        register
    }
}()