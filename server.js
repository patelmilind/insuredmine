const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const basicroutes = require('./routes/basic_routes');
const os = require('os-utils');
const mongoose = require('mongoose');

global.__basedir = __dirname;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/insuredmine', { useNewUrlParser: true, useUnifiedTopology: true }).then(
    (res)=>{
        if(res){
            console.log("Connection Establish");
        }
    }).catch((error)=>{
        if(error){
            console.log("DB Connection Error");
        }
    });

// Task 2 -- real-time CPU utilization of the node server and on 70% usage restart the server
setInterval(function () {
    os.cpuUsage(function(v){
       // console.log( 'CPU Usage (%): ' + v.toFixed(0) );
        if(v.toFixed(0) >= 70)
        {

            console.log("This is pid " + process.pid);
            setTimeout(function () {
                process.on("exit", function () {
                    require("child_process").spawn(process.argv.shift(), process.argv, {
                        cwd: process.cwd(),
                        detached : true,
                        stdio: "inherit"
                    });
                });
                process.exit();
            }, 5000);
            
            // process.exit(0);
        }
    });
}, 100);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api',basicroutes);

app.use('**', (req, res)=> {
    return res.status(404).json({
        message : "Invalid Request"
    })
});

app.use((err, req , res , next)=>{
    console.log(err);
    res.status(500).send({
        status:"fail",
        err: err.message,
    });
});

let server = app.listen(3000, () => {
    let host = 'localhost';
    let port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
  });