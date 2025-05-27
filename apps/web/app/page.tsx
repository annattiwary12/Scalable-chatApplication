'use client';
import { useSocket } from '../context/SocketProvider';
import { useState } from 'react';
import './Chat.css';

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [input, setInput] = useState('');

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat</h1>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.from === 'me' ? 'me' : 'server'}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput('');
          }}
          className="chat-send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
