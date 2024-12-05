// src/pages/Messages.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  clearMessages,
} from "../store/messageSlice";
import MessageList from "../components/messages/MessageList";
import MessageForm from "../components/messages/MessageForm";
import "./Messages.css";

const Messages = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const [currentRecipient, setCurrentRecipient] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleSelectRecipient = (username) => {
    setCurrentRecipient(username);
    dispatch(fetchMessages(username));
  };

  return (
    <div className="messages-container">
      <h1>메시지</h1>
      <div className="messages-content">
        <div className="recipients-list">
          {/* 사용자의 친구 목록 또는 채팅 가능한 사용자 목록을 표시 */}
          {/* 예시: */}
          <button onClick={() => handleSelectRecipient("friend1")}>
            friend1
          </button>
          <button onClick={() => handleSelectRecipient("friend2")}>
            friend2
          </button>
          {/* 실제 구현 시, 동적으로 친구 목록을 가져와야 합니다 */}
        </div>
        <div className="chat-section">
          {currentRecipient ? (
            <>
              {loading ? (
                <p>메시지 로딩 중...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <MessageList messages={messages} />
              )}
              <MessageForm recipientUsername={currentRecipient} />
            </>
          ) : (
            <p>대화할 상대를 선택하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
