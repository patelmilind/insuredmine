var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const agentSchema = new Schema({
    agent_name :{
        type:String
    }
});

const usersAccountSchema  = new Schema({
    account_name :{
        type: String
    }
});

const userSchema = new Schema({
    first_name: {
        type : String
    },
    DOB: {
        type: Date
    },
    address: {
        type: String
    },
    phone_number: {
        type: String
    },
    state: {
        type: String
    },
    zip_code: {
        type: String
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    usertype: {
        type: String
    },
    agent:{
        type: Schema.Types.ObjectId, ref: 'agent' 
    },
    useraccountname:{
        type: Schema.Types.ObjectId, ref: 'usersAccount'
    }
})

const userdatamodel = mongoose.model('user', userSchema);
const agentdatamodel = mongoose.model('agent', agentSchema);
const usersaccnamemodel = mongoose.model('usersAccount', usersAccountSchema);

module.exports = {
    userdatamodel : userdatamodel,
    agentdatamodel : agentdatamodel,
    usersaccnamemodel : usersaccnamemodel 
}