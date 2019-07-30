const constants = (() => {
    const baseUrl = 'https://baas.kinvey.com';
    const appKey = 'kid_BkL3yFobr';
    const appSecret = '9b6c532771f947348ec83133cfe378af';

    const partials = {
        homePage: './views/home/home.hbs',
        header: './views/common/header.hbs',
        footer: './views/common/footer.hbs',
        register: './views/user/register.hbs',
        login: './views/user/login.hbs',
        notifications: './views/common/notifications.hbs',
        userHome: './views/home/userHome.hbs',
        user: './views/user/user.hbs',
        itemCreate: './views/items/itemCreate.hbs',
        itemEdit: './views/items/itemEdit.hbs',
        details: './views/items/details.hbs',
        allItems : './views/items/allItems.hbs',
        itemDelete : './views/items/itemDelete.hbs',

    }

    const url = {
        register: baseUrl + `/user/${appKey}`,
        login: baseUrl + `/user/${appKey}/login`,
        logout: baseUrl + `/user/${appKey}/_logout`,
        // this is for PUT , DELETE requests  -  you should add itemId at the end
        items: baseUrl + `/appdata/${appKey}/items`
    }

    const authorization = {
        login: `Basic ${btoa(appKey + ':' + appSecret)}`,
        session: `Kinvey `, // add current authToken
    }

    const elements = {
        getErrorBox: () => {
            return document.getElementById('errorBox')
        },
        getSuccessBox: () => {
            return document.getElementById('infoBox')
        },
        getLoadingBox: () => {
            return document.getElementById('loadingBox')
        },
    }

    const errorMessages = {
        register : `
            The username should be at least 3 characters long,
            The password should be at least 6 characters long,
            The repeat password should be equal to the password.
        `
       
        
    }

    const successMessages = {
        register: 'User registration successful.',
        login: 'Login successful.',
        logout: 'Logout successful.',
        created: 'Event created successfully.',
        edited: 'Event edited successfully.',
        join: 'You join the event successfully.',
        deleted: 'Event closed successfully.'
    }

    return {
        url,
        partials,
        authorization,
        elements,
        errorMessages,
        successMessages
    }
})();