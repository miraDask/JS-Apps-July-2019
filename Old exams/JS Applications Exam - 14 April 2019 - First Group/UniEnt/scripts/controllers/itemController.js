const itemController = (() => {

    const getItemDetails = async function (context) {
        const itemId = context.params.itemId;
        context.item = await itemModel.getItem(itemId);
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

    const getJoin = async function (context) {
       await itemModel.join(context.params.itemId);
       context.redirect(`#/details/${context.params.itemId}`);
    }

    const getDelete = async function(context) {
       await itemModel.del(context.params.itemId);
       context.redirect(`#/home`);
    }

    return {
        getItemDetails,
        getJoin,
        getDelete
    }
})();