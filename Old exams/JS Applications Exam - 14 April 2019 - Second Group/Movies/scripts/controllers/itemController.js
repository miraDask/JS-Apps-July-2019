const itemController = (() => {
    const {
        notifications,
        header,
        footer,
        details,
        itemEdit,
        allItems,
        itemDelete
    } = constants.partials;

    const getItemDetails = async function (context) {
        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');

            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(details);
            })
        } catch (err) {
            // notificationsHandler.displayError(err.message);

        }
    }

    const buyItem = async function (context) {
        try {
            await itemModel.buy(context.params.itemId);
            //  notificationsHandler.displayMessage(constants.successMessages.join);
            context.redirect('#/allItems');
        } catch (err) {
            //  notificationsHandler.displayError(err.message);
        }
    }

    const getDelete = async function (context) {
        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');

            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(itemDelete);
            })
        } catch (err) {
            //  notificationsHandler.displayError(err.message);
        }
    }

    const postDelete = function (context) {
        try {
            itemModel.del(context.params.itemId)
                .then(() => {
                    //  notificationsHandler.displayMessage(constants.successMessages.deleted)
                    context.redirect('#/user');
                });


        } catch (err) {
            console.log(err.message);

            //  notificationsHandler.displayError(err.message);
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
            // notificationsHandler.displayError(err.message);
        }
    }

    const postEdit = function (context) {
        try {
            itemModel.edit(context)
                .then(async () => {
                    //   notificationsHandler.displayMessage(constants.successMessages.edited);
                    context.redirect(`#/user`);
                })
        } catch (err) {
            // notificationsHandler.displayError(err.message);
        }
    }

    const getItemsAll = async function (context) {
        try {
            context.items = await itemModel.getAllItems();
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');

            context.loadPartials({
                notifications,
                header,
                footer
            }).then(function () {
                this.partial(allItems);
            })
        } catch (err) {
            // notificationsHandler.displayError(err.message);
        }
    }

    // const postItemsAll = function(context) {
    //     debugger
    //     console.log(context)
    // }

    return {
        getItemDetails,
        buyItem,
        getDelete,
        postDelete,
        getEdit,
        postEdit,
        getItemsAll,
        // postItemsAll
    }
})();