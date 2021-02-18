var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schedulerMsgSchema = new Schema({
    message :{
        type:String
    }
});

module.exports = new mongoose.model('scheduledMsg',schedulerMsgSchema);