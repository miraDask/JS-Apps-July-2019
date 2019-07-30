const itemModel = (() => {

    const sortItemsByCategory = (items) => {
        const sortedItems = {};
        sortedItems.meat = items.filter(i => i.category === 'Lean meats and poultry, fish and alternatives');
        sortedItems.dairyProducts = items.filter(i => i.category === 'Milk, cheese, eggs and alternatives');
        sortedItems.grainFood = items.filter(i => i.category === 'Grain Food');
        sortedItems.fruits = items.filter(i => i.category === 'Fruits');
        sortedItems.vegetables = items.filter(i => i.category === 'Vegetables and legumes/beans');

        return sortedItems;
    };
         
    const create = function (context) {
        notificationsHandler.displayLoading();
        const url = constants.url.items;
 
        let ingredients = [];

        context.params.ingredients.split(', ').forEach(i => {
            ingredients.push({name : i});
        });

        const organizer = storage.getData('username');
        const subscribers = 0;

        const body = {
            ...context.params,
            organizer,
            subscribers
        }

        body.ingredients = ingredients;

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
        let items = await validator.response(response);
        items = sortItemsByCategory(items);
        return items;
    }

    const manipulate = async function (id) {
        const url = constants.url.items + `/${id}`;
        const item = await getItem(id);
        //property for manipulation depends on the task
        item.subscribers++;
        const headers = {
            headers: {},
            body: JSON.stringify(item)
        }

        const response = await requester.put(url, headers);
        await validator.response(response);
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
        
        let ingredients = [];
        context.params.ingredients.split(', ').forEach(i => {
            ingredients.push({name : i});
        });
       
        const body = {
            ...context.params
        };

        body.ingredients = ingredients;

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