const notificationsHandler = (() => {

    const fadeOut = (element) => {
        var s = element.style;
        s.opacity = 1;
        (function fade() {
            (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 1000)
        })();
    }

    const displayError = (message) => {
        const errorBox = constants.elements.getErrorBox();
        errorBox.style.display = 'block';
        errorBox.textContent = message;

        fadeOut(errorBox);
    }

    const displayMessage = (message) => {
        const successBox = constants.elements.getSuccessBox();
        successBox.style.display = 'block';
        successBox.textContent = message;

        fadeOut(successBox);
    }

    // const displayLoading = () => {
    //     const loadingBox = constants.elements.getLoadingBox();
    //     loadingBox.style.display = 'block';
    // }

    return {
        displayError,
       // displayLoading,
        displayMessage
    }
})()