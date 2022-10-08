'use strict';

const express = require('express');
const { ScriptInjectionRecord } = require("../connections/mongo")

const router = express.Router();

router.get('/test-api', (req, res, next) => {
    res.json({
        "hello": "hello"
    });
});

let scriptContent = `
const scriptInjectionHead = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.setAttribute('type','text/javascript');
script.setAttribute('async',true);
script.text = 'alert("hello from test-extension")'
if (scriptInjectionHead) {
    scriptInjectionHead.appendChild(script);
}`

scriptContent = Buffer.from(scriptContent).toString('base64')

const createTagSchema = {
    tags: [{
        "name" : "test-injection",
        "sub_type" : "inline",
        "type" : "js",
        "position" : "body-bottom",
        "content" : scriptContent,
        "attributes" : {
        }
    }]
}


// Get applications list
router.get('/applications', async function view(req, res, next) {
    try {
        const {
            platformClient
        } = req;
        let data = await platformClient.configuration.getApplications({
            pageSize: 1000,
            q: JSON.stringify({"is_active": true})
        });

        // getting data from DB
        let scriptStateObj = {}
        let scriptRecord = await ScriptInjectionRecord.find({
            company_id: platformClient.config.companyId
        })
        scriptRecord.map((ele) => {
            scriptStateObj[ele.application_id] = ele.is_active
        })

        // mapping state of script in data
        data.items.map((ele) => {
            if (scriptStateObj[ele._id]) {
                ele.script_state = true
            } else {
                ele.script_state = false
            }
        })

        return res.json(data)
    } catch (err) {
        next(err);
    }
});

router.get('/application/:application_id', async function view(req, res, next) {
    try {
        const {
            platformClient,
            params
        } = req;
        const { application_id } = params;
        return res.json(await platformClient.application(application_id).configuration.getApplicationById());
    } catch (err) {
        next(err);
    }
});



// Injection APIs
router.get('/test/injection/:application_id', async function view(req, res, next) {
    try {
        const {
            platformClient,
            params
        } = req;
        const { application_id } = params;
        return res.json(await platformClient.application(application_id).content.getInjectableTags())
    } catch(err) {
        next(err)
    }
})

router.post('/test/injection/:application_id', async function view(req, res, next) {
    try {
        const {
            platformClient,
            params
        } = req;
        const { application_id } = params


        const scriptInjectionRecord = await ScriptInjectionRecord.findOne({ application_id: application_id })
        

        if (scriptInjectionRecord) {
            if (scriptInjectionRecord.is_active === false) {
                const data = await platformClient.application(application_id).content.addInjectableTag(
                    { body: createTagSchema }
                )
                scriptInjectionRecord.script_id = data.tags[0]._id
                scriptInjectionRecord.is_active = true
                scriptInjectionRecord.save()
            } else {
                // injection script is already available
                return res.status(200).json({"Message": "Script Already Created!!"})
            }
        
        } else {
            // script is not activated for application
            var data =  await platformClient.application(application_id).content.addInjectableTag(
                { body: createTagSchema }
            )
            const scriptInjection = {
                application_id: data.application,
                company_id: data.company,
                script_id: data.tags[0]._id,
                is_active: true
            }
            await new ScriptInjectionRecord(scriptInjection).save()
        }
        return res.status(200).json(data)
    } catch(err) {
        next(err)
    }
})

router.delete('/test/injection/:application_id', async function view(req, res, next) {
    try {
        const {
            platformClient,
            params
        } = req;
        const { application_id } = params
        
        // getting script record from MongoDB
        const scriptInjectionRecord = await ScriptInjectionRecord.findOne({application_id: application_id})
        
        // if script record is not in mongodb
        if (!scriptInjectionRecord) {
            return res.status(404).json({"Error": "Injection Script for this application is not available!!"})
        } else {
            // deleting script from application
            await platformClient.application(application_id).content.removeInjectableTag({
                body: { tags: [scriptInjectionRecord.script_id] }
            })
            // deleting script record from DB
            await scriptInjectionRecord.delete()
            return res.status(204).end()
        }
    } catch(err) {
        next(err)
    }
})


router.post("/proxy-text", async (req, res) => {
    try {
        console.log(req)
        return res.status(201).json({"Message": "Tada!!! your proxy is working"})
    } catch(err) {
        console.log(err)
    }
})


module.exports = router;