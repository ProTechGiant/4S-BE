import multer from "multer";
import { RequestHandler } from "express";
import * as path from "path";
import { UnsupportedMediaTypeException } from "../errors/exceptions";

const storage = multer.diskStorage({
  destination: (_, file, callback) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === ".csv") {
      callback(null, path.join(__dirname, "../../public/csv/"));
    } else if ([".png", ".jpg", ".jpeg"].includes(extname)) {
      callback(null, path.join(__dirname, "../../public/images/"));
    } else {
      const error = new UnsupportedMediaTypeException(`Invalid Type Specified`);
      callback(error, null);
    }
  },

  filename: (_, file, callback) => {
    const extname = path.extname(file.originalname).toLowerCase();

    if (extname === ".csv") {
      const filename = `${Date.now()}-csv-${file.originalname}`;
      callback(null, filename);
    } else if ([".png", ".jpg", ".jpeg"].includes(extname)) {
      const filename = `${Date.now()}-4s-${file.originalname}`;
      callback(null, filename);
    }
  },
});

const uploadFiles = multer({ storage: storage }).array("file", 1);
const uploadFilesMiddleware: RequestHandler = (req, res, next) => {
  uploadFiles(req, res, (error: any) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + error.message });
      }

      return res.status(400).json({ error: error.message });
    }
    return next();
  });
};

export default uploadFilesMiddleware;
