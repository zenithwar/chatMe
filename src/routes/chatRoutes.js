const express = require("express");
const createChatController = require("../controllers/chatControllers");
const gemini = require("../services/gemini");

const router = express.Router();
const chatController = createChatController(gemini);

router.post("/chat", chatController);

module.exports = router;

