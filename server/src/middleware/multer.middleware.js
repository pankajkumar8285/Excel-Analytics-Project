import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/temp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop();
  if (["xlsx", "xls", "csv"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel/CSV files allowed"), false);
  }
};

const  upload = multer({ storage, fileFilter });

export default upload;
