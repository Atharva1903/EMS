const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const multer = require('multer');

// Configure Multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to share report
// Expects: 'file' (the PDF), 'employeeId', 'description', 'title', 'recipientEmail', 'reportType'
router.post('/share', upload.single('file'), reportController.shareReport);

module.exports = router;
