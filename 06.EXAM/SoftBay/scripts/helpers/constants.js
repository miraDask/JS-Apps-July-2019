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
        user: './views/user/userPage.hbs',
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
        items: baseUrl + `/appdata/${appKey}/offers`
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

    //depends on the current task
    const errorMessages = {
        register : `
            The username should can not be empty,
            The repeated password should be equal to the password.
        `,
        create : `
            The input fields for product, description and price should be non-empty,
            The input field for imageUrl, must be valid url.
        `
    }

    //depends on the current task
    const successMessages = {
        register: 'User registration successful.',
        login: 'Login successful.',
        logout: 'Logout successful.',
        created: 'Your offer was created successfully.',
        edited: 'Your offer was edited successfully.',
        manipulation: 'You bought this product successfully.',
        deleted: 'Your offer was deleted successfully.'
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