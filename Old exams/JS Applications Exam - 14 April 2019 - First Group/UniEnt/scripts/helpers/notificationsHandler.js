const notificationsHandler = (() => {
    const errorBox = constants.elements.errorBox;
    const successBox = constants.elements.successBox;
    const loadingBox = constants.elements.loadingBox;


    const displayError = (message) => {
        setTimeout(() => {
            errorBox.style.display = '';
            errorBox.textContent = message;
        }, 5000);
    }

    const displayMessage = (message) => {
        setTimeout(() => {
           successBox.style.display = '';
           successBox.textContent = message;
        }, 5000);
    }

    const displayLoading = () => {
        loadingBox.style.display = '';
    }

    return {
        displayError,
        displayLoading,
        displayMessage
    }
})