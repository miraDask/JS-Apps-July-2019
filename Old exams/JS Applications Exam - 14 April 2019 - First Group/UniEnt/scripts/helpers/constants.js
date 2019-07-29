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
        notifications : './views/common/notifications.hbs',
        userHome : './views/home/userHome.hbs',
        user : './views/user/user.hbs',
        itemCreate : './views/items/itemCreate.hbs',
        itemEdit : './views/items/itemEdit.hbs',
        details : './views/items/details.hbs'
    }

    const url = {
        register : baseUrl + `/user/${appKey}` ,
        login : baseUrl + `/user/${appKey}/login`,
        logout : baseUrl + `/user/${appKey}/_logout`,
        // this is for PUT , DELETE requests  -  you should add itemId at the end
        items : baseUrl +  `/appdata/${appKey}/items` 
    }

    const authorization = {
        login : `Basic ${btoa(appKey + ':' + appSecret)}`,
        session : `Kinvey `,  // add current authToken
    }

    const elements = {
        errorBox : document.getElementById('errorBox'),
        successBox : document.getElementById('successBox'),
        loadingBox : document.getElementById('loadingBox'),
    }

    return {
        url,
        partials,
        authorization,
        elements
    }
})();