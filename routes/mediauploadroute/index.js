const express = require('express');
const router = express.Router();
const {uploadMedia} = require('../../controllers/media/mediauploads');
router.post("/upload", uploadMedia);
module.exports = router; 