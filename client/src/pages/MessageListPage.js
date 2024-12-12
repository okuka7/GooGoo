// src/pages/MessageListPage.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../store/messageSlice"; // fetchConversations -> fetchConversation
import MessageList from "../components/messages/MessageList";

const MessageListPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchConversation("conversations")); // 올바른 경로
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <MessageList messages={messages} />;
};

export default MessageListPage;
