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

const ScriptInjectionRecord = mongoose.model('ScriptInjection', ScriptInjectionSchema)

module.exports = { ScriptInjectionRecord };