
const schedulerMsgSchema = require('../model/schedulemsg');
var Agenda = require('agenda');
const mongoConnectionString = 'mongodb://127.0.0.1/insuredmine';
const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('insert msg in db', async job => {

    const {msgg} = job.attrs.data;
    
    var msg = new schedulerMsgSchema({  
                    message : msgg
    });

    await msg.save()
    
    .then(result =>{
        console.log(`message, inserted in the DB,  Data = ${msgg}`);
    })
    .catch(err =>{
        console.log(`err while inserting scheduled msg \n ${err}`);
    });

  });

exports.scheduleMsgInsert = async (req,res) => {

    var message = req.body.msg;
    var day = req.body.day;
    var day = req.body.day.slice(0,3);
    var time = req.body.time;
    
    await agenda.every(`${time.split(":")[1]} ${time.split(":")[0]} * * ${day}`,'insert msg in db', {msgg: message,timezone: 'Asia/Kolkata'});
    await agenda.start();
    
}
