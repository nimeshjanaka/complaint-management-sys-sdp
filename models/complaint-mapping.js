const mongoose = require('mongoose')
const dbconnect = require('../db')

//Call  to connect the mongo db
dbconnect()


const ComplaintMappingSchema = mongoose.Schema({
    complaintID: {
        type: String,
        required: true
    },
    engineerName: {
        type: String,
        required: true
    },
});

const ComplaintMapping = module.exports = mongoose.model('ComplaintMapping', ComplaintMappingSchema);

module.exports.registerMapping = function (newComplaintMapping, callback) {
    newComplaintMapping.save(callback);
}
