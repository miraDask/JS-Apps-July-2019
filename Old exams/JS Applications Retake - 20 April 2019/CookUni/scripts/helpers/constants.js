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
        meal : './views/items/meal.hbs'

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
            return document.getElementById('successBox')
        },
        getLoadingBox: () => {
            return document.getElementById('loadingBox')
        },
    }

    //depends on the current task
    const errorMessages = {
        register : `
        o	The first and last name should be at least 2 characters long
        o	The username should be at least 3 characters long
        o	The password should be at least 6 characters long
        o	The repeat password should be equal to the password
        `
    }

    //depends on the current task
    const successMessages = {
        register: 'User registration successful.',
        login: 'Login successful.',
        logout: 'Logout successful.',
        created: 'Recipe shared successfully!',
        edited: 'Recipe edited successfully.',
        manipulation: 'You {manipulation description} successfully.',
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