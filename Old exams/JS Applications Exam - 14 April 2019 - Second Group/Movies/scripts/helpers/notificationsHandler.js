const notificationsHandler = (() => {

    // const fadeOut = (element) => {
    //     var s = element.style;
    //     s.opacity = 1;
    //     (function fade() {
    //         (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 1000)
    //     })();
    // }

    // const displayError = (message) => {
    //     const errorBox = constants.elements.getErrorBox();
    //     errorBox.style.display = 'block';
    //     errorBox.textContent = message;

    //     fadeOut(errorBox);
    // }

    // const displayMessage = (message) => {
    //     const successBox = constants.elements.getSuccessBox();
    //     successBox.style.display = 'block';
    //     successBox.firstChild.textContent = message;

    //     fadeOut(successBox);
    // }



    function displayMessage(message) {
        const successBox = $('#infoBox');
        successBox.first().text(message);
        successBox.css( "display", "block" );
        setTimeout(() => successBox.fadeOut(), 3000);
    }

    function displayError(message) {
        let errorBox = $('#errorBox');
        errorBox.first().text(message);
        errorBox.css( "display", "" );;
        setTimeout(() => errorBox.fadeOut(), 3000);
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