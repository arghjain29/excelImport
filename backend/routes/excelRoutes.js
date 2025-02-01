const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadFile, importData } = require("../controllers/excelController");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.post("/import", importData);

module.exports = router;
