// UpdateMapping.js
const mongoose = require('mongoose');
const dbconnect = require('../db');

// Call to connect the mongo db
dbconnect();

const UpdateMappingSchema = mongoose.Schema({
    complaintID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    engineerName: {
        type: String,
        required: true
    },
    update: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    engineerName: {
        type: String,
        required: true
    }
});

const UpdateMapping = module.exports = mongoose.model('UpdateMapping', UpdateMappingSchema);

module.exports.registerUpdate = function (newUpdateMapping, callback) {
    newUpdateMapping.save(callback);
}
