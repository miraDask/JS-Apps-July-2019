const notificationsHandler = (() => {
    const loadingBox = constants.elements.getLoadingBox();

    function displayMessage(message) {
        const successBox = $('#infoBox');
        successBox.text(message);
        successBox.css( "display", "block" );
        setTimeout(() => successBox.fadeOut(), 3000);
    }

    function displayError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.css( "display", "block" );;
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    const displayLoading = () => {
        loadingBox.style.display = 'block';
    }

    const stopLoading = () => {
        loadingBox.style.display = '';
    }

    return {
        displayError,
        displayLoading,
        displayMessage,
        stopLoading
    }
})()