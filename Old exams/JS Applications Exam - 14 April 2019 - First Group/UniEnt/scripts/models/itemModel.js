const itemModel = (() => {

    const create = function(context) {
        const url = constants.url.items;
        const { dateTime, description, imageURL, name} = context.params;
        const organizer = storage.getData('username');
        const subscribers = 0;

        const body = {
            dateTime, description, imageURL, name, organizer, subscribers
        }
        
        const headers = {
            headers: {},
            body : JSON.stringify(body)
        }
       
       return requester.post(url, headers);
    
}
    const edit = function() {

    }

    const showDetails = function(id) {
        
        const itemHolder = document.getElementById(`${id}`);
     
        itemHolder.style.display = itemHolder.style.display === 'none' ? '' : 'none';
    }


    return {
        create,
        edit,
        showDetails
    }
})();