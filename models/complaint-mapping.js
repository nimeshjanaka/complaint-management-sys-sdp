// ComplaintMapping.js
const mongoose = require('mongoose');
const dbconnect = require('../db');

// Call to connect the mongo db
// dbconnect();

const ComplaintMappingSchema = mongoose.Schema({
    complaintID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    depName: {
        type: String,
        required: true
    },
});

const ComplaintMapping = module.exports = mongoose.model('ComplaintMapping', ComplaintMappingSchema);

module.exports.registerMapping = function (newComplaintMapping, callback) {
    newComplaintMapping.save(callback);
}
