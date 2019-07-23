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

    const password = (password, repeatedPassword) => {
        return password === repeatedPassword;
    }

    // const inputIsFilled = (data) {
    //     data.forEach(element => {
    //         if(!element) return false;
    //     });
    //     return true;
    // }

    return {
        response,
        password,
        // inputIsFilled
    }
}()