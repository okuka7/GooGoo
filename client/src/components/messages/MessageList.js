// src/components/messages/MessageList.js

import React from "react";
import "./MessageList.css";

const MessageList = ({ messages }) => {
  if (messages.length === 0) return <p>메시지가 없습니다.</p>;

  return (
    <ul className="message-list">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={`message-item ${
            msg.sender === "Me" ? "sent" : "received"
          }`}
        >
          <p>{msg.content}</p>
          <span>{new Date(msg.sentAt).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
