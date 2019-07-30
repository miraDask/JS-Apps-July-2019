const itemController = (() => {
    const {
        header,
        footer,
        details,
        itemEdit,
        itemDelete
    } = constants.partials;

    // const sortItems = (items) => {
    //     return items.sort((a, b) =>  b.tickets - a.tickets);
    // } 

    const getItemDetails = async function (context) {

        try {
            const itemId = context.params.itemId;
            context.item = await itemModel.getItem(itemId);
            const loggedIn = true;
            context.loggedIn = loggedIn;
            context.username = storage.getData('username');
            context.names = `${storage.getData('firstName')} ${storage.getData('lastName')}`;
            context.id = itemId;

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
            context.names = `${storage.getData('firstName')} ${storage.getData('lastName')}`
           
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
                    context.redirect('#/user');
                });

        } catch (err) {

         notificationsHandler.displayError(err.message);
        }
    }

    const getEdit = async function (context) {

        try {
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
            context.names = `${storage.getData('firstName')} ${storage.getData('lastName')}`

            const itemId = context.params.itemId;
            let item = await itemModel.getItem(itemId);
            item.ingredients = item.ingredients.reduce((acc, curr) => {
                acc.push(curr.name);
                return acc;
            }, []).join(', ')
            
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
            itemModel.edit(context)
                .then(async () => {
                    notificationsHandler.stopLoading();

                    notificationsHandler.displayMessage(constants.successMessages.edited);
                    context.redirect(`#/home`);
                })
        } catch (err) {
            notificationsHandler.displayError(err.message);
        }
    }
    
    // todo search part
    // const postSearch = function(context) {
    //     console.log(context.params)
    // }

    return {
        getItemDetails,
        manipulateItem,
        getDelete,
        postDelete,
        getEdit,
        postEdit,
        
       // postSearch
    }
})();