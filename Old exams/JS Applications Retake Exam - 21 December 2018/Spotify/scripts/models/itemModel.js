const itemModel = (() => {
    const create = function (context) {
        notificationsHandler.displayLoading();
        const url = constants.url.items;

        const organizer = storage.getData('username');
        const subscribers = 0;

        const body = {
            ...context.params,
            organizer,
            subscribers
        }

        const headers = {
            headers: {},
            body: JSON.stringify(body)
        }

        return requester.post(url, headers);
    }

    const getItem = async function (id) {
        notificationsHandler.displayLoading();

        const url = constants.url.items + `/${id}`;
        const headers = {
            headers: {}
        }

        const response = await requester.get(url, headers);
        const item = await validator.response(response);
        return item;
    }

    const getAllItems = async function () {
        notificationsHandler.displayLoading();

        const url = constants.url.items;
        const headers = {
            headers: {}
        }

        const response = await requester.get(url, headers);
        const items = await validator.response(response);

        return items;
    }

    const manipulate = async function (context) {
        const id = context.params.itemId;
        const path = context.path;
        const action = path.endsWith('like') ? 'like' : 'listen';
        const url = constants.url.items + `/${id}`;
        const item = await getItem(id);

        if(action === 'like') {
            item.subscribers++;
        } else {
            item.listened++;
        }
        
        const headers = {
            headers: {},
            body: JSON.stringify(item)
        }

        const response = await requester.put(url, headers);
        await validator.response(response);

        if(action === 'like') {
            notificationsHandler.displayMessage(constants.successMessages.like);
        } else {
            const songName = item.title;
            const message = constants.successMessages.listen(songName);
            notificationsHandler.displayMessage(message);
        }

    }

    const del = async function (id) {
        notificationsHandler.displayLoading();
        
        const url = constants.url.items + `/${id}`;
        const headers = {
            headers: {},
        }

        const response = await requester.del(url, headers);
        
        return validator.response(response);
    }

    const edit = async function (context) {
        notificationsHandler.displayLoading();

        const itemId = context.params.itemId;
        const body = {
            ...context.params
        };
        delete body["itemId"];
        const headers = {
            headers: {},
            body: JSON.stringify(body)
        }

        const url = constants.url.items + `/${itemId}`;
        const response = await requester.put(url, headers);
        await validator.response(response);
    }

    return {
        create,
        edit,
        manipulate,
        del,
        getItem,
        getAllItems,
    }
})();