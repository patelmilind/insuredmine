var multer  = require('multer');

const excelFilter = (req, file, cb) => {
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml") ||
      file.mimetype.includes("csv")
    ) {
      cb(null, true);
    } else {
      cb("Please upload only excel file.", false);
    }
  };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
       cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
  });
   
  const upload = multer({storage: storage, fileFilter: excelFilter});

  module.exports = upload;