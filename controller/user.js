const {agentdatamodel,userdatamodel,usersaccnamemodel} = require('../model/user');
const {policycarriermodel,policycatmodel,policyinfomodel} = require('../model/policy')
const fs = require('fs');
const csv = require('fast-csv');
var moment = require('moment');
const { Worker } = require('worker_threads');

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

exports.uploadData = async (req, res)=>{


        if (req.file == undefined) {
            return res.status(400).send("Please upload a file!");
        }
        else {
            await runService(__basedir + '/uploads/' + req.file.filename)
            .then((result) =>{
                res.status(200).json({
                    message: 'File uploaded/import successfully!'
                });
            })
            .catch((err) =>{
                console.log(err);
                res.json({error:err});
            });
            

            // let importdata = importCsvData2Mongo(__basedir + '/uploads/' + req.file.filename);
            // if(importdata)
            // {
            //     res.status(200).json({
            //         'msg': 'File uploaded/import successfully!', 'file': req.file
            //     });
            // }
            
        }
};

function runService(workerData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./controller/importCsvData2Mongo.js', { workerData });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      })
    })
  }
