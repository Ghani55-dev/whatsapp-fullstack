const express = require("express");
const Message = require("../models/Message");

module.exports = (io) => {
  const router = express.Router();

  // POST: Insert a new message from webhook payload
  router.post("/", async (req, res) => {
    try {
      const payload = req.body;

      const message = new Message({
        id: payload.id || payload.meta_msg_id,
        meta_msg_id: payload.meta_msg_id || '',
        wa_id: payload.wa_id,
        name: payload.name || 'User',
        text: payload.text || '',
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
        status: payload.status || 'sent'
      });

      await message.save();

      // Emit the new message to all clients
      io.emit("new_message", message);

      res.status(201).json({ success: true, message });
    } catch (err) {
      console.error("Error saving message:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT: Update status of existing message
  router.put("/status", async (req, res) => {
    try {
      const { id, status } = req.body;

      const result = await Message.updateOne(
        { $or: [{ id }, { meta_msg_id: id }] },
        { $set: { status } }
      );

      res.json({ success: true, updatedCount: result.modifiedCount });
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET: Fetch all messages
  router.get("/messages", async (req, res) => {
    try {
      const allMessages = await Message.find().sort({ timestamp: 1 });
      res.json(allMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
