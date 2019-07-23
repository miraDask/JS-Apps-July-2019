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
    }

    const url = {
        register : baseUrl + `/user/${storage.appKey}` ,
        login : baseUrl + `/user/${appKey}/login`,
        logout : baseUrl + `/user/${storage.appKey}/_logout`,
        // this is for PUT , DELETE requests  -  you should add itemId at the end
        edit : baseUrl + `/appdata/${storage.appKey}/`,    
    }

    const authorization = {
        login : `Basic ${btoa(appKey + ':' + appSecret)}`,
        session : `Kinvey ${btoa(localStorage.authToken)}`,
    }

    return {
        url,
        partials,
        authorization
    }
})();