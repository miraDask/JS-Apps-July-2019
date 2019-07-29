const itemController = (() => {
    const {
        notifications,
        header,
        footer,
        details,
        itemEdit
    } = constants.partials;

    const getItemDetails = async function (context) {
        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');
            context.isOrganizer = context.username === context.item.organizer

            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(details);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);

        }
    }

    const getJoin = async function (context) {
        try {
            await itemModel.join(context.params.itemId);
            notificationsHandler.displayMessage(constants.successMessages.join);
            context.redirect(`#/details/${context.params.itemId}`);
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getDelete = async function (context) {
        try {
            await itemModel.del(context.params.itemId);
            notificationsHandler.displayMessage(constants.successMessages.deleted)
            homeController.getHome(context);

        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getEdit = async function (context) {

        try {
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
            const itemId = context.params.itemId;
            const item = await itemModel.getItem(itemId);
            context.item = item;

            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(itemEdit);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const postEdit = function (context) {
        try {
            itemModel.edit(context)
                .then(async () => {

                    notificationsHandler.displayMessage(constants.successMessages.edited);
                    context.redirect(`#/details/${context.params.itemId}`);
                })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    return {
        getItemDetails,
        getJoin,
        getDelete,
        getEdit,
        postEdit
    }
})();