const express = require("express");
const multer = require("multer");
const helpers = require("./helpers/helpers");
const path = require("path");
const PORT = 8888;
const app = express();
app.use(express.static("multipleUploads")); //express middleware
app.set("view engine", "ejs");
//for uploading
const storage = multer.diskStorage({
  //storing  files
  destination: (req, file, cb) => {
    cb(null, "multipleUploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
//end
app.get("/", (req, res) => {
  res.render("upload");
});
app.post("/fileupload", (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).array("multiple_Images", 10);
  upload(req, res, (err) => {
    if (req.fileValidationError) {
      res.send(req.fileValidationError);
    } else if (!req.files) {
      res.send("Please select a file");
    } else if (err) {
      res.send("Some uploading error");
    } else {
      const files = req.files;
      let result = "";
      for (i = 0; i < files.length; i++) {
        result += `<img src="${files[i].filename}" width="300" height="300"/>`;
        console.log(result);
      }
      console.log(result);
      res.send(result);
    }
  });
});
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Work on ${PORT}`);
});
