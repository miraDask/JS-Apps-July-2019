const itemController = (() => {

    const getItemDetails = function (context) {
        const itemId = context.params.itemId;
        context.item = storage.getItems().filter(i => i._id === itemId)[0];
        const loggedIn = true;
        context.loggedIn = loggedIn;
        context.username = storage.getData('username');
        context.isOrganizer = context.username === context.item.organizer

        const {
            header,
            notifications,
            footer,
            details
        } = constants.partials;

        context.loadPartials({
            header,
            notifications,
            footer
        }).then(function () {
            this.partial(details);
        })



    }

    return {
        getItemDetails
    }
})();