const itemController = (() => {
    const {
        header,
        footer,
        allItems,
    } = constants.partials;

    const sortItems = (items) => {
        return items.sort((a, b) => b.subscribers - a.subscribers || b.listened - a.listened);
    }

    const manipulateItem = async function (context) {
        try {
            await itemModel.manipulate(context);
            if (context.path.includes('user')) {
                context.redirect('#/user');
            } else {
                context.redirect('#/allItems');
            }
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getDelete = async function (context) {
        try {
            const itemId = context.params.itemId;
            notificationsHandler.stopLoading();
            itemModel.del(itemId)
                .then(() => {
                    notificationsHandler.stopLoading();
                    notificationsHandler.displayMessage(constants.successMessages.deleted)
                    context.redirect('#/allItems');
                });
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }

    const getItemsAll = async function (context) {
        try {
            const items = await itemModel.getAllItems();
            items.map((item) => {
                if (item._acl.creator === storage.getData('userId')) {
                    item.isCreator = true;
                }
            })

            sortItems(items);

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
        manipulateItem,
        getDelete,
        getItemsAll,
        sortItems
    }
})();