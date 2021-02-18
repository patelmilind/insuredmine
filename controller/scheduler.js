const cron = require('node-cron');
const schedulerMsgSchema = require('../model/schedulemsg');

var cron_message = [];

exports.scheduleMsgInsert = async (req, res)=>{

    var message = req.body.message;
    cron_message.push(message);
    var day = req.body.day.charAt(0).toUpperCase() + req.body.day.slice(1);
    
    var time = req.body.time;

    cron.schedule(`${time.split(":")[1]} ${time.split(":")[0]} * * ${day}`, function() {
        
        var msg = new schedulerMsgSchema({  
            message : cron_message.shift()
        });
        
        msg.save()
        .then((data) => { return console.log(`message , inserted in the DB, Data = ${data} `)})
        .catch((err) => { return console.log(`err while inserting scheduled msg \n ${err}`)});

      });
    
    res.status(200).send(`Your ${message} will be inserted on ${day}, at ${time}`);

};