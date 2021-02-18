var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const policyCatSchema = new Schema({
    category_name :{
        type:String
    }
});

const policyCarrierSchema  = new Schema({
    company_name :{
        type: String
    }
});

const policyInfoSchema = new Schema({
    policy_number: {
        type : String
    },
    policy_start_date: {
        type: Date
    },
    policy_end_date: {
        type: Date
    },
    policy_category_id:{
        type: Schema.Types.ObjectId, ref: 'LOB'
    },
    company_id:{
        type: Schema.Types.ObjectId, ref: 'carrier'
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'user'
    }
})
    
const policycatmodel = mongoose.model('LOB', policyCatSchema);
const policycarriermodel = mongoose.model('carrier', policyCarrierSchema);
const policyinfomodel = mongoose.model('policy', policyInfoSchema);

module.exports = {
    policycatmodel : policycatmodel,
    policycarriermodel : policycarriermodel,
    policyinfomodel : policyinfomodel 
}