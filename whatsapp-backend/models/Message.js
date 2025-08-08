const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  id: String,
  meta_msg_id: String,
  wa_id: String,
  name: String,
  text: String,
  timestamp: Date,
  status: { type: String, default: "sent" }
});

module.exports = mongoose.model("Message", MessageSchema);
