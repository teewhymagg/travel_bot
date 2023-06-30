// ChatMessage.js

import React from 'react';

const ChatMessage = ({ message }) => {
  const { user, content } = message;
  const isUserMessage = user === 'me';
  const messageClassName = isUserMessage ? 'user-message' : 'bot-message';

  return (
    <div className={`chat-message ${messageClassName}`}>
      <div className="chat-message-center">
        <div className={`avatar ${messageClassName}`}></div>
        <div className="message">{content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
