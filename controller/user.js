const {agentdatamodel,userdatamodel,usersaccnamemodel} = require('../model/user');
const {policycarriermodel,policycatmodel,policyinfomodel} = require('../model/policy')
const fs = require('fs');
const csv = require('fast-csv');
var moment = require('moment');

exports.getuserpolicy = (req,res)=>{
    let username = req.body.username;

    console.log(username);
    userdatamodel
    .findOne({first_name:username}).exec()
    .then(result =>{
        // console.log(result);
        if(result){
            policyinfomodel.findOne({user_id:result._id}).exec()
            .then(finalresult =>{
                if(finalresult){
                res.status(200).send(finalresult)
                }
                else res.status(200).send('user does not have any policy to show');
            })
        }
        else res.status(200).send('username not available in DB');
    })
    .catch(err =>{
        return err;
    })
};

exports.uploadData = (req, res)=>{

        if (req.file == undefined) {
            return res.status(400).send("Please upload a file!");
        }
        else {
            let importdata = importCsvData2Mongo(__basedir + '/uploads/' + req.file.filename);
            if(importdata)
            {
                res.status(200).json({
                    'msg': 'File uploaded/import successfully!', 'file': req.file
                });
            }
            
        }
};

async function importCsvData2Mongo(filePath){

    let stream = fs.createReadStream(filePath);
    let jsonData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {

            jsonData.push({
                Agent: data[0],
                Users: {first_name:data[16],DOB:data[23],address:data[20],phone_number:data[19],state:data[21],zip_code:data[22],email:data[14],gender:data[15],usertype:data[1],agent:'null',useraccountname:'null'},
                Users_account:data[13],
                Policy_category:data[9],
                Policy_carrier:data[8], 
                Policy_info:{policy_number:data[4],policy_start_date:data[10],policy_end_date:data[11],policy_category_id:'null',company_id:'null',user_id:'null'}
              });
        })
        .on("end", function () {

            jsonData.shift();
            let agents = [...new Set(jsonData.map(item => item.Agent))];
            let acc_name = [...new Set(jsonData.map(item => item.Users_account))];
            let policy_category = [...new Set(jsonData.map(item => item.Policy_category))];
            let policy_carrier = [...new Set(jsonData.map(item => item.Policy_carrier))];

            createDocument('agent',agents);
            createDocument('acc_name',acc_name);
            createDocument('policy_category',policy_category);
            createDocument('policy_carrier',policy_carrier);

            setTimeout( ()=>{
                createDocument('User',jsonData);
            },2000);

            setTimeout( ()=>{
                createDocument('Policy_info',jsonData);
            },10000);
            
            fs.unlinkSync(filePath);
            return true;
        });
 
    stream.pipe(csvStream);
};

async function createDocument(collection_name,coll_data){
    
    switch (collection_name) {
        
        case 'agent':
            console.log('started inserting agent data');
            let agentsdata = [];
            coll_data.forEach(ele =>{
                let data = {agent_name:ele}
                agentsdata.push(data);
            });
            agentdatamodel.insertMany(agentsdata)
            .then(function(){ 
                console.log("Agent Data inserted")  // Success 
            })
            .catch(function(error){ 
                console.log(error)      // Failure 
            });
          break;

        case 'acc_name':

            console.log('started inserting acc_name data');
            let acc_name_data = [];
            coll_data.forEach(ele =>{
                let data = {account_name:ele}
                acc_name_data.push(data);
            });
            usersaccnamemodel.insertMany(acc_name_data)
            .then(function(){ 
                console.log("acc_name Data inserted")  // Success 
            })
            .catch(function(error){ 
                console.log(error)      // Failure 
            });

          break;

        case 'policy_category':

            console.log('started inserting policy_category data');
            let policy_cat_data = [];
            coll_data.forEach(ele =>{
                let data = {category_name:ele}
                policy_cat_data.push(data);
            });
            policycatmodel.insertMany(policy_cat_data)
            .then(function(){ 
                console.log("policy_category Data inserted")
            })
            .catch(function(error){ 
                console.log(error)   
            });

          break;

        case 'policy_carrier':

            console.log('started inserting policy_carrier data');
            let policy_carr_data = [];
            coll_data.forEach(ele =>{
                let data = {company_name:ele}
                policy_carr_data.push(data);
            });
            policycarriermodel.insertMany(policy_carr_data)
            .then(function(){ 
                console.log("policy_carrier Data inserted")  
            })
            .catch(function(error){ 
                console.log(error)
            });
          break;

        case 'User':
            
            console.log('started inserting User data');
            let promiseArray = [];

            coll_data.forEach((ele,index) =>{
                coll_data[index].Users.DOB = moment(coll_data[index].Users.DOB,"DD-MM-YYYY").endOf('day').toISOString();
                
                promiseArray.push(userData(coll_data, ele, index))
            });
            
            await Promise.all(coll_data);

            setTimeout(()=>{ 
        
             insertintodb(coll_data);
             },5000);
    
          break;
          
        case 'Policy_info':

            console.log('started inserting Policy_info data');
            let Policy_promiseArray = [];

            coll_data.forEach((ele,index) =>{
                coll_data[index].Policy_info.policy_start_date = moment(coll_data[index].Policy_info.policy_start_date,"DD-MM-YYYY").endOf('day').toISOString();
                coll_data[index].Policy_info.policy_end_date = moment(coll_data[index].Policy_info.policy_end_date,"DD-MM-YYYY").endOf('day').toISOString();
                
                Policy_promiseArray.push(policyData(coll_data, ele, index))
            });
            
            await Promise.all(coll_data);

            setTimeout(()=>{ 
        
                insertpolicyintodb(coll_data);
             },5000);

          break;
        
      }
};

function userData(coll_data, ele, index) {
        
            agentdatamodel
            .findOne({ agent_name: ele.Agent }).exec()
            .then((result) => {

                coll_data[index].Users.agent = result._id;
                
                usersaccnamemodel
                .findOne({ account_name: ele.Users_account }).exec()
                .then((result) => {
                    coll_data[index].Users.useraccountname = result._id;
                });
            });
};

function insertintodb(newUsersData)
{
    let finaluserdata =  newUsersData.map(item => item.Users);
    console.log(finaluserdata.length);
    // process.exit();
    userdatamodel.insertMany(finaluserdata)
            .then(function(){ 
                console.log("user Data inserted")  
            })
            .catch(function(error){ 
                console.log('this is error = ',error)
            });
};

function policyData(coll_data, ele, index){

    policycarriermodel
            .findOne({ company_name: ele.Policy_carrier}).exec()
            .then((result) => {

                coll_data[index].Policy_info.company_id = result._id;
                
                policycatmodel
                .findOne({ category_name: ele.Policy_category }).exec()
                .then((result) => {
                    
                    coll_data[index].Policy_info.policy_category_id = result._id;

                    userdatamodel
                    .findOne({ first_name: ele.Users.first_name}).exec()
                    .then((result) => {
                        coll_data[index].Policy_info.user_id = result._id;
                    });
                });
            });

};

function insertpolicyintodb(newUsersData)
{
    let finaluserdata =  newUsersData.map(item => item.Policy_info);
    // console.log(finaluserdata[0]);
    // process.exit();
    policyinfomodel.insertMany(finaluserdata)
            .then(function(){
                console.log("policy Data inserted")  
            })
            .catch(function(error){ 
                console.log(error)
            });
};