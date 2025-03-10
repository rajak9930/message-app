const express = require("express");
const { sendMessage, getMessagesBetweenUsers } = require("../controllers/messageController");
const protect = require("../middleware/authMiddleware"); 
const router = express.Router();


router.post("/send", protect, sendMessage); 
router.get("/", protect, getMessagesBetweenUsers); 

module.exports = router;