const express = require('Express');
const router = express.Router();
const upload = require('../middleware/multer_config');
const user = require('../controller/user');
const scheduler = require('../controller/scheduler');

router.post('/upload', upload.single("uploadfile"), user.uploadData);
router.post('/mypolicy', user.getuserpolicy);

// task 2 scheduling of the msg
router.post('/schedule', scheduler.scheduleMsgInsert);

module.exports = router;