import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const Sidebar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWaId, setNewWaId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [lastMessages, setLastMessages] = useState({});

  const fetchUsers = async () => {
    const res = await axios.get('/webhook/messages');
    const grouped = {};
    const unread = {};
    const lastMsgs = {};

    res.data.forEach(msg => {
      if (!grouped[msg.wa_id]) {
        // First message, store name
        grouped[msg.wa_id] = {
          ...msg,
          name: msg.name || 'User',
        };
      } else {
        const existing = grouped[msg.wa_id];
        if (new Date(msg.timestamp) > new Date(existing.timestamp)) {
          grouped[msg.wa_id] = {
            ...msg,
            name: existing.name || msg.name || 'User', // Preserve earlier name
          };
        }
      }

      if (msg.status !== 'read') {
        unread[msg.wa_id] = (unread[msg.wa_id] || 0) + 1;
      }

      lastMsgs[msg.wa_id] = msg.text;
    });

    setUsers(Object.values(grouped));
    setUnreadCounts(unread);
    setLastMessages(lastMsgs);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddChat = async () => {
    if (!newWaId || !newMessage) return alert("Enter number and message");

    await axios.post('/webhook', {
      id: Date.now().toString(),
      wa_id: newWaId,
      name: newName || 'User',
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });

    setFormOpen(false);
    setNewName('');
    setNewWaId('');
    setNewMessage('');
    await fetchUsers();
    onSelectUser(newWaId);
  };

  return (
    <div className="sidebar">
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #2a3942',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <strong>Chats</strong>
        <button
          onClick={() => setFormOpen(!formOpen)}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          + New Chat
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '95%',
          margin: '10px',
          padding: '5px',
          borderRadius: '5px'
        }}
      />

      {formOpen && (
        <div style={{ padding: '10px', borderBottom: '1px solid #2a3942' }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
          <input value={newWaId} onChange={e => setNewWaId(e.target.value)} placeholder="Mobile Number" style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
          <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="First Message" style={{ width: '100%', marginBottom: '5px', padding: '5px' }} />
          <button onClick={handleAddChat} style={{ width: '100%', padding: '6px', background: '#005c4b', color: 'white', border: 'none' }}>Start Chat</button>
        </div>
      )}

      {users
        .filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.wa_id.includes(searchTerm)
        )
        .map(user => (
          <div
            key={user.wa_id}
            onClick={() => onSelectUser(user.wa_id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              borderBottom: '1px solid #2a3942'
            }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`}
              alt="avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            <div style={{ flexGrow: 1 }}>
              <strong>{user.name || 'User'}</strong><br />
              <span style={{ fontSize: '12px', color: '#ccc' }}>{lastMessages[user.wa_id]}</span>
            </div>
            {unreadCounts[user.wa_id] > 0 && (
              <div style={{
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '4px 8px',
                fontSize: '12px',
                marginLeft: '5px'
              }}>
                {unreadCounts[user.wa_id]}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
