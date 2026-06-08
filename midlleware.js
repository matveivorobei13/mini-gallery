const multer = require("multer")
const schemas = require("./schemas.js")

const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },



  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isValidExt = allowedTypes.test(ext);
  const isValidMime = allowedTypes.test(mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};
const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },

  fileFilter
});

function upload_validate(req, res, next){
    const result = schemas.upload_schema.safeParse(req.body)
    if(!result.success){
        const firstErrorMessage = result.error.issues[0].message
        return res.json({
        status:"error",
        message: firstErrorMessage
    })
    } 
    next()
}

function file_midlleware(req, res, next){
    if(!req.file){
        return res.json({status: "error", message: "вы не добавили файл"})
    }
    next()
}

function validateSearch(req, res, next) {
    const { search } = req.query
    console.log(search)
    if (typeof search !== "string") {
        return res.json({
            status: "error",
            message: "поисковый запрос должен быть строкой"
        })
    }

    const cleanSearch = search.trim()

    if (cleanSearch.length === 0) {
        return res.json({
            status: "error",
            message: "строка не должна быть пустой"
        })
    }

    req.cleanSearch = cleanSearch
    next()
}



module.exports = {
    upload_validate,
    file_midlleware, 
    upload,
    validateSearch
}