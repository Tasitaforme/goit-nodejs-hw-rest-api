const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  //   destination: tempDir,
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const { _id } = req.user;

    // розширення файлу
    const extname = path.extname(file.originalname);
    // назва файлу без розширення
    // const basename = path.basename(file.originalname, extname);
    // змінюємо назву файлу на унікальну (заміна назви на id користувача)
    const filename = `${_id}${extname}`;

    cb(null, filename);
  },
});

const uploadAvatar = multer({
  storage: multerConfig,
});

module.exports = uploadAvatar;
