import React, { useState, useEffect } from 'react';
import bgImage from './istockphoto-1403848173-612x612.jpg';
import { io } from "socket.io-client";
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

const socket = io("http://localhost:3001");

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUnreadCounts(prev => ({ ...prev, [selectedUser]: 0 }));
    }
  }, [selectedUser]);

  // Listen for real-time messages
  useEffect(() => {
    socket.on("new_message", (message) => {
      setIncomingMessage(message);
      if (message.wa_id !== selectedUser) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.wa_id]: (prev[message.wa_id] || 0) + 1
        }));
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedUser]);

  return (
    <div className="app">
      {!isMobile || !selectedUser ? (
        <Sidebar
          onSelectUser={setSelectedUser}
          unreadCounts={unreadCounts}
        />
      ) : null}

      {(!isMobile || selectedUser) && (
        <ChatWindow
          selectedUser={selectedUser}
          incomingMessage={incomingMessage}
        />
      )}
    </div>
  );
}

export default App;
