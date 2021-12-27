const multer = require('multer');

/* ----------------------------------------------
                NOT TESTED YET
---------------------------------------------- */

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const nameWithoutExtension = name.split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, nameWithoutExtension + "_" + Date.now() + "." + extension); //callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');