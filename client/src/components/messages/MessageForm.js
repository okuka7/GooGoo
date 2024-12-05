// src/components/messages/MessageForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../store/messageSlice";
import "./MessageForm.css";

const MessageForm = ({ recipientUsername }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    dispatch(sendMessage({ receiverUsername: recipientUsername, content }))
      .unwrap()
      .then(() => setContent(""))
      .catch((error) => alert(error));
  };

  return (
    <form onSubmit={handleSend} className="message-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요..."
        required
      ></textarea>
      <button type="submit">전송</button>
    </form>
  );
};

export default MessageForm;
