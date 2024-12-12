// src/pages/MessagePage.js

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../store/messageSlice";
import MessageList from "../components/messages/MessageList";
import MessageForm from "../components/messages/MessageForm";
import { sendPrivateMessage } from "../utils/websocket"; // 추가

const MessagePage = () => {
  const { otherUsername } = useParams();
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (otherUsername) {
      dispatch(fetchConversation(otherUsername));
    }
  }, [dispatch, otherUsername]);

  const handleSend = (content) => {
    const chatMessage = {
      // sender 필드 제거
      receiverUsername: otherUsername,
      content,
      timestamp: new Date().toISOString(),
    };
    // 실시간 메시지 전송
    sendPrivateMessage(chatMessage);
    // 이미 WebSocket을 통해 메시지가 Redux 스토어에 추가되므로 추가적인 디스패치는 필요 없음
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{otherUsername}님과의 대화</h2>
      <MessageList messages={messages} />
      <MessageForm onSubmit={handleSend} receiverUsername={otherUsername} />
    </div>
  );
};

export default MessagePage;
