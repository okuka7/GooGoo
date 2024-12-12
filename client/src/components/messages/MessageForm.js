// src/components/messages/MessageForm.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import "./MessageForm.css";

const MessageForm = ({ onSubmit, receiverUsername }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === "") return;

    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button type="submit">전송</button>
    </form>
  );
};

MessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  receiverUsername: PropTypes.string.isRequired,
};

export default MessageForm;
