const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newMessage = await Message.create({ senderId, receiverId, message });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessagesBetweenUsers = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ error: "Missing user IDs" });
        }

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort("createdAt");

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};