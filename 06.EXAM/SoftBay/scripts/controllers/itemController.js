const itemController = (() => {
    const {
        header,
        footer,
        details,
        itemEdit,
        allItems,
        itemDelete
    } = constants.partials;

    const sortItems = (items) => {
        return items.sort((a, b) => b.tickets - a.tickets);
    }

    const getItemDetails = async function (context) {

        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');

            notificationsHandler.stopLoading();

            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(details);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);

        }
    }

    const manipulateItem = async function (context) {
        try {
            await itemModel.manipulate(context.params.itemId);
            notificationsHandler.displayMessage(constants.successMessages.manipulation);
            context.redirect('#/allItems');
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getDelete = async function (context) {
        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');

            notificationsHandler.stopLoading();

            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(itemDelete);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const postDelete = function (context) {
        try {
            itemModel.del(context.params.itemId)
                .then(() => {
                    notificationsHandler.stopLoading();
                    notificationsHandler.displayMessage(constants.successMessages.deleted)
                    context.redirect('#/dashboard');
                });

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

            notificationsHandler.stopLoading();

            context.loadPartials({
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
            const dataIsCorrect = validator
                .create(context.params.product, context.params.description, context.params.price, context.params.pictureUrl)

            if(!dataIsCorrect) {
                throw new Error(constants.errorMessages.create)

            }

            itemModel.edit(context)
                .then(async () => {
                    notificationsHandler.stopLoading();

                    notificationsHandler.displayMessage(constants.successMessages.edited);
                    context.redirect(`#/dashboard`);
                })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getItemsAll = async function (context) {
        try {
            let items = await itemModel.getAllItems();
            items.map(i => {
                i.index = items.indexOf(i);
                i.isCreator = i._acl.creator === storage.getData('userId');
            })

            // sortItems(items);

            context.items = items;
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
            notificationsHandler.stopLoading();

            context.loadPartials({
                header,
                footer
            }).then(function () {
                this.partial(allItems);
            })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

  
    return {
        getItemDetails,
        manipulateItem,
        getDelete,
        postDelete,
        getEdit,
        postEdit,
        getItemsAll,
        // postSearch
    }
})();