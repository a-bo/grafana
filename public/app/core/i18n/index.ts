import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import config from '../config';


function LoadLanguage(callback: () => void) {
    let name = config.bootData.user.language;
    if (name === "") {
        name = "en_US";
    }
    let locale: any;
    switch (name) {
        case "zh_CN":
            require.ensure([], (require: NodeRequire) => {
                locale = require("./translate/zh_CN.js");
                initI18n(locale, name);
                callback();
            }, "zh_CN");
            break;
        default:
            require.ensure([], (require: NodeRequire) => {
                locale = require("./translate/en_US.js");
                initI18n(locale, name);
                callback();
            }, "en_US");
            break;
    }
}

export const T = (text: string) => {
    const locale = config.bootData.translate;
    if (locale.hasOwnProperty(text)) {
        return Object.getOwnPropertyDescriptor(locale, text).value;
    }
    return text;
};

export const initI18n = (locale: object, name: string) => {
    try {
        config.bootData.translate = locale;
        const resources: { [index: string]: any } = {};
        resources[name] = {
            translation: locale
        };
        i18n
            .use(initReactI18next) // passes i18n down to react-i18next
            .init({
                resources,
                lng: name,
                saveMissing: false,
                react: {
                    useSuspense: true,
                },
                debug: true,
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



export default LoadLanguage;
