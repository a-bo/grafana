import i18n from './core/i18n';

i18n(() => {
    const app = require('./app');
    console.log(app);
    app.default.initEchoSrv();
    app.default.init();
});
