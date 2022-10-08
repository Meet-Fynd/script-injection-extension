'use strict';

const express = require('express')
const router = express.Router()
const { ScriptProxyPathRecord } = require('../connections/mongo')
const config = require('../config')


{
router.get('/add/:application_id', async (req, res, next) => {
    try{
        const {
            application_id
        } = req.params
        const {
            platformClient,
            fdkSession
        } = req

        const companyId = Number(req.fdkSession.company_id);
        const proxy_path = await ScriptProxyPathRecord.findOne({
            application_id,
            company_id: companyId
        })
        if(proxy_path){
            return res.json(proxy_path);
        }
        const proxyResponse = await platformClient.application(application_id).partner.addProxyPath({
            extensionId: fdkSession.extension_id,
            body: {
                attached_path: "test-extension",
                proxy_url: config.extension.base_url
            }
        })
        await ScriptProxyPathRecord.create({
            application_id,
            company_id: companyId,
            attached_path: proxyResponse.attached_path
        })
        return res.status(201).json(proxyResponse)

    } catch(e) {
        console.log(e)
        next(e)
    }
})


router.get('/remove/:application_id', async (req, res, next) => {
    try {
        const { application_id } = req.params
        const { platformClient, fdkSession } = req

        const companyId = Number(fdkSession.company_id)
        const proxyResponse = await platformClient.application(application_id).partner.removeProxyPath({
            extensionId: fdkSession.extension_id,
            attachedPath: "test-extension"
        })

        await ScriptProxyPathRecord.deleteOne({
            application_id,
            company_id: companyId,
        })
        return res.json(200).json(proxyResponse)

    } catch(e) {
        console.log(e)
        next(e)
    }
})


router.get('/:application_id', async (req, res, next) => {
    try {
        const { application_id } = req.params
        const { fdkSession } = req

        const companyId = Number(fdkSession.company_id)

        const proxy_path = await ScriptProxyPathRecord.findOne({
            application_id,
            company_id: companyId
        })
        if (proxy_path) {
            return res.status(200).json(proxy_path)
        }
        return res.status(400).json({"Error": "No proxy path added"})

    } catch(e) {
        console.log(e)
        next(e)
    }
})
}

module.exports = router;
