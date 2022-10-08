'use strict';

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/test-extension')

const ScriptInjectionSchema = new mongoose.Schema({
    company_id:  {
        type: String
    },
    application_id:{
        type: String,
        unique: true
    },
    script_id: {
        type: String,
        unique: true
    },
    is_active: {
        type: Boolean,
        default: false
    }
})


const ScriptProxyPathSchema = new mongoose.Schema({
    application_id: {
        type: String,
        required: true
    },
    company_id: {
        type: String,
        required: true
    },
    attached_path: {
        type: String,
        required: true
    }
})

ScriptProxyPathSchema.index(
    {
        application_id: 1,
        company_id: 1
    },
    {
        unique: true
    }
)

const ScriptInjectionRecord = mongoose.model('ScriptInjection', ScriptInjectionSchema)
const ScriptProxyPathRecord = mongoose.model('ScriptProxyPathRecord', ScriptProxyPathSchema)

module.exports = { ScriptInjectionRecord, ScriptProxyPathRecord };