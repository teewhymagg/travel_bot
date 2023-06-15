import * as React from "react";

const ChatMessage = ({ message, props }) => {
    return (
        <div className={`chat-message ${message.user == "bot" && "chatbot"}`}>
            <div className="chat-message-center">
                <div className={`avatar ${message.user == "bot" && "chatbot"}`}>

                </div>
                <div className="message">
                    {message.message}
                </div>
                </div>
        </div>
    )
}

export default ChatMessage;