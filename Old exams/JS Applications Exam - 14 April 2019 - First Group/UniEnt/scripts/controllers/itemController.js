const itemController = (() => {
    const {
        header,
        notifications,
        footer,
        details,
        itemEdit
    } = constants.partials;

    const getItemDetails = async function (context) {   // (context, item))
        const itemId = context.params.itemId;
        context.item = await itemModel.getItem(itemId);
        const loggedIn = true;
        context.loggedIn = loggedIn;
        context.username = storage.getData('username');
        context.isOrganizer = context.username === context.item.organizer

        context.loadPartials({
            header,
            notifications,
            footer
        }).then(function () {
            this.partial(details);
        })
    }

    const getJoin = async function (context) {
       await itemModel.join(context.params.itemId);
       context.redirect(`#/details/${context.params.itemId}`);
    }

    const getDelete = async function(context) {
       await itemModel.del(context.params.itemId);
       context.redirect(`#/home`);
    }

    const getEdit = async function (context) {
        try {
            context.loggedIn = storage.getData('username') !== null;
            context.username = storage.getData('username');
            const itemId = context.params.itemId;
            const item = await itemModel.getItem(itemId);
            context.item = item;

            context.loadPartials({
                header,
                notifications,
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
                .then(async() => {
                    context.redirect(`#/details/${context.params.itemId}`);
                })
        } catch (err) {
console.log('err');

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