import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import config from '../config';


async function LoadLanguage() {
    let name = config.bootData.user.language;
    if (name === "") {
        name = "en_US";
    }
    config.bootData.ready = false;
    let locale: any;
    switch (name) {
        case "zh_CN":
            require.ensure([], (require: NodeRequire) => {
                locale = require("./translate/zh_CN.js");
                initI18n(locale, name);
                config.bootData.ready = true;
            }, "zh_CN");
            break;
        default:
            require.ensure([], (require: NodeRequire) => {
                locale = require("./translate/en_US.js");
                initI18n(locale, name);
                config.bootData.ready = true;
            }, "en_US");
            break;
    }
    return await locale;
}


export const initI18n = (locale: object, name: string) => {
    try {
        const resources: { [index: string]: any } = {};
        resources[name] = {
            translation: locale
        };
        i18n
            .use(initReactI18next) // passes i18n down to react-i18next
            .init({
                resources,
                lng: name,

                keySeparator: false, // we do not use keys in form messages.welcome

                interpolation: {
                    escapeValue: false // react already safes from xss
                }
            });
        depthTrans(locale, config.bootData.navTree as NavTree[]);
        console.log("加载语言完成");
    } catch (e) {
        console.log("加载语言失败...");
        console.log(e);
    }
};

interface NavTree {
    text: string;
    children: NavTree[];
    subTitle: string;
}



function depthTrans(locale: object, nav: NavTree[]) {
    nav.forEach((n, idx) => {
        if (n.hasOwnProperty("text")) {
            if (locale.hasOwnProperty(n.text)) {
                nav[idx].text = Object.getOwnPropertyDescriptor(locale, n.text).value;
            } else {
                console.log(n.text);
            }
        }
        if (n.hasOwnProperty("subTitle")) {
            if (locale.hasOwnProperty(n.subTitle)) {
                nav[idx].subTitle = Object.getOwnPropertyDescriptor(locale, n.subTitle).value;
            } else {
                console.log(n.subTitle);
            }
        }
        if (n.hasOwnProperty("children")) {
            depthTrans(locale, n.children);
        }
    });
}

LoadLanguage();

export default { "locale": config.bootData.user.language };
