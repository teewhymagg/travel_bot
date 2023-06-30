import * as React from "react";

const ChatMessage = ({ message }) => {
  const isUserMessage = message.user === "me";
  const messageClassName = isUserMessage ? "user-message" : "bot-message";

  return (
    <div className={`chat-message ${messageClassName}`}>
      <div className="chat-message-center">
        <div className={`avatar ${messageClassName}`}></div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
