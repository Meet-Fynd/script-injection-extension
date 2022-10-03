'use strict';

const { setupFdk } = require("fdk-extension-javascript/express");
const { RedisStorage } = require("fdk-extension-javascript/express/storage");
const config =  require("../config");
const { appRedis } = require("./../common/redis.init");
const { ScriptInjectionRecord } = require("../connections/mongo")

let fdkExtension = setupFdk({
    api_key: config.extension.api_key,
    api_secret: config.extension.api_secret,
    callbacks: {
        auth: async (req) => {
        // Writee you code here to return initial launch url after suth process complete
            return `${req.extension.base_url}/company/${req.query['company_id']}`;
        },

        install: async (req) => {
            console.log("auto install req", req)
        },
        
        uninstall: async (req) => {
            // Write your code here to cleanup data related to extension
            // If task is time taking then process it async on other process.
            const { company_id } = req.body
            await ScriptInjectionRecord.updateMany(
                { company_id: company_id },
                { is_active: false }
            )
        }
    },
    storage: new RedisStorage(appRedis,"exapmple-fynd-platform-extension"), // add your prefix
    access_mode: "offline",
    cluster:  config.extension.fp_api_server// this is optional by default it points to prod.
});


module.exports = fdkExtension;
