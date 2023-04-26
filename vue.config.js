const { defineConfig } = require('@vue/cli-service')
process.env.VUE_APP_VERSION = require("./package.json").version
process.env.VUE_APP_PRODUCT_NAME = require("./package.json").product_name
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
module.exports = defineConfig({

    pages: {
        index: {
            entry: "src/main.js",
            title: process.env.VUE_APP_PRODUCT_NAME
        }
    },
    transpileDependencies: true,
    configureWebpack: {
    },
    pluginOptions: {
        electronBuilder: {
            mainProcessFile: 'src/background.js',
            nodeIntegration: true,
            builderOptions: {
                appId: 'com.cancler.lor-super-scouter',
                productName: process.env.VUE_APP_PRODUCT_NAME,
                copyright: "Copyright © 2023 ${author}",
                publish: {
                    provider: "github"
                },
                "win": {
                    "icon": "public/Scout.png"
                }
            }
        }
    }
})
