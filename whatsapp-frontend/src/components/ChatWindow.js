import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from '../api/axiosInstance';
import SendBox from './SendBox';
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messageEndRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchMessages = useCallback(async () => {
    const res = await axios.get('/webhook/messages');
    const userMsgs = res.data.filter(m => m.wa_id === selectedUser);
    const sorted = [...userMsgs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setMessages(sorted);
    scrollToBottom();

    userMsgs.forEach(msg => {
      if (msg.status !== 'read') {
        axios.put('/webhook/status', { id: msg.id, status: 'read' });
      }
    });
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages();
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    socket.on("new_message", (msg) => {
      if (msg.wa_id === selectedUser) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
        axios.put('/webhook/status', { id: msg.id, status: 'read' });
      }
    });

    socket.on("typing", (data) => {
      if (data.wa_id === selectedUser) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1500);
      }
    });

    return () => {
      socket.off("new_message");
      socket.off("typing");
    };
  }, [selectedUser]);

  if (!selectedUser) {
    return <div className="chat-window"><div className="chat-header">Select a chat</div></div>;
  }

  const markAllAsRead = () => {
    messages.forEach(msg => {
      if (msg.status !== 'read') {
        axios.put('/webhook/status', { id: msg.id, status: 'read' });
      }
    });
    fetchMessages();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        {isMobile && (
          <button onClick={() => window.location.reload()} style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '18px', marginRight: '10px' }}>
            ⬅️
          </button>
        )}
        Chat with {selectedUser}
        <button onClick={markAllAsRead} style={{ marginLeft: 'auto', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '5px', padding: '2px 6px' }}>
          Mark all as read
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.status === 'sent' ? 'sent' : ''}`}>
            <div>{msg.text}</div>
            <small>
              {new Date(msg.timestamp).toLocaleString()} -{" "}
              {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓ (gray)' : '✓'}
            </small>
          </div>
        ))}
        {typing && <div style={{ fontStyle: 'italic', color: 'gray', padding: '5px' }}>Typing...</div>}
        <div ref={messageEndRef} />
      </div>

      <SendBox wa_id={selectedUser} onSend={fetchMessages} />
    </div>
  );
};

export default ChatWindow;
