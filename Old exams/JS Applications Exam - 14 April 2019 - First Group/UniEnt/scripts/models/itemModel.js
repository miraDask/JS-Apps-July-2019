const itemModel = (() => {

    //TODO ERROR HANDLING MOVE TO CONTROLLER
    const create = function (context) {
        const url = constants.url.items;
        const {
            dateTime,
            description,
            imageURL,
            name
        } = context.params;
        const organizer = storage.getData('username');
        const subscribers = 0;

        const body = {
            dateTime,
            description,
            imageURL,
            name,
            organizer,
            subscribers
        }

        const headers = {
            headers: {},
            body: JSON.stringify(body)
        }

        return requester.post(url, headers);

    }

    const showDetails = function (id) {
        const itemHolder = document.getElementById(`${id}`);
        itemHolder.style.display = itemHolder.style.display === 'none' ? '' : 'none';
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
        try {
            const url = constants.url.items + `/${id}`;
            const item = await getItem(id);
            item.subscribers++;
            const headers = {
                headers: {},
                body: JSON.stringify(item)
            }

            const response = requester.put(url, headers);
            await validator.response(response);

        } catch (err) {
            //TODO
        }
    }

    const del = async function (id) {
        try {
            const url = constants.url.items + `/${id}`;
            const headers = {
                headers: {},
            }

            const response = requester.del(url, headers);
            validator.response(response);
        } catch (err) {
            //todo
        }
    }

    const edit = async function (context) {
        try {
            const itemId = context.params.itemId;
            const body = {
                ...context.params
            };
            delete body["itemId"];
            const headers = {
                headers: {},
                body : JSON.stringify(body)
            }

            const url = constants.url.items + `/${itemId}`;
            const response = await requester.put(url, headers);
            validator.response(response);

        } catch (err) {
            console.log('err');

        }
    }

    return {
        create,
        edit,
        join,
        del,
        showDetails,
        getItem,
        getAllItems
    }
})();