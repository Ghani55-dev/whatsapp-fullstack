import React from 'react';
import './ChatList.css';

function ChatList({ users, selectUser }) {
  return (
    <div className="chat-list">
      {users.map((user) => (
        <div key={user.wa_id} className="chat-item" onClick={() => selectUser(user.wa_id)}>
          <strong>{user.name || user.wa_id}</strong>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
