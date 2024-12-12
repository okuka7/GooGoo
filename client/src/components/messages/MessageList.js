// src/components/messages/MessageList.js
import React from "react";
import { useSelector } from "react-redux";
import "./MessageList.css";

const MessageList = ({ messages }) => {
  // 현재 로그인한 사용자 정보 가져오기
  const currentUser = useSelector((state) => state.auth.user);

  // currentUser가 없거나 username이 없는 경우
  if (!currentUser || !currentUser.username) {
    return <p>로그인이 필요합니다.</p>;
  }

  // messages가 없거나 빈 배열인 경우
  if (!messages || messages.length === 0) {
    return <p>메시지가 없습니다.</p>;
  }

  return (
    <div className="message-list">
      {messages.map((msg) => {
        // msg.senderUsername 필드 확인 (MessageDTO에서 senderUsername을 반환하므로 이 필드를 사용)
        if (!msg.senderUsername) {
          return <div key={msg.id || Math.random()}>잘못된 메시지 데이터</div>;
        }

        const isSentByMe = msg.senderUsername === currentUser.username;

        return (
          <div
            key={msg.id}
            className={`message-item ${isSentByMe ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <span>{new Date(msg.sentAt).toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
