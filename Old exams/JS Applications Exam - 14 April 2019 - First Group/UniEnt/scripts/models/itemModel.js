const itemModel = (() => {

    const create = function (context) {
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
        const url = constants.url.items + `/${id}`;
        const headers = {
            headers: {}
        }

        const response = await requester.get(url, headers);
        const item = await validator.response(response);
        return item;
    }

    const getAllItems = async function () {
        const url = constants.url.items;
        const headers = {
            headers: {}
        }

        const response = await requester.get(url, headers);
        const items = await validator.response(response);

        return items;
    }

    const join = async function (id) {
        const url = constants.url.items + `/${id}`;
        const item = await getItem(id);
        item.subscribers++;
        const headers = {
            headers: {},
            body: JSON.stringify(item)
        }

        const response = await requester.put(url, headers);
        await validator.response(response);
    }

    const del = async function (id) {

        const url = constants.url.items + `/${id}`;
        const headers = {
            headers: {},
        }

        const response = await requester.del(url, headers);
        await validator.response(response);
    }

    const edit = async function (context) {

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
        join,
        del,
        getItem,
        getAllItems
    }
})();