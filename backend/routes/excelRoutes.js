const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadFile, importData, flushData } = require("../controllers/excelController");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.post("/import", importData);
router.delete("/flush-data", flushData);

module.exports = router;
