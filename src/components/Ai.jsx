import React, { useState } from 'react';
import './Ai.css';

function Ai() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const botReply = getBotResponse(input);
    setMessages([...messages, { type: 'user', text: input }, { type: 'bot', text: botReply }]);
    setInput('');
  };

  const getBotResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('time')) return "We're open 7 AM to 10 PM!";
    if (lower.includes('special')) return "Our almond croissants are 🔥!";
    return "I’ll get better soon, I promise! 😊";
  };

  return (
    <div className="ai-chat-container">
      <h2>Chat with OvenBot 🤖</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>{msg.text}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Ai;
