import React, { useState } from 'react';
import axios from '../api/axiosInstance';

const SendBox = ({ wa_id, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text) return;
    await axios.post('/webhook', {
      id: Date.now().toString(),
      wa_id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    setText('');
    onSend(); // refresh messages
  };

  return (
    <div className="send-box">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default SendBox;
