// src/utils/websocket.js

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import store from "../store";
import { addMessage } from "../store/messageSlice";

const SOCKET_URL = "http://localhost:8081/ws";

let isConnected = false;

// 메시지 큐를 추가하여 연결 후에 메시지를 전송할 수 있도록 함
let messageQueue = [];

const stompClient = new Client({
  webSocketFactory: () => {
    const token = store.getState().auth.token;
    console.log("WebSocket factory - token:", token);
    return new SockJS(`${SOCKET_URL}?token=${token}`);
  },
  reconnectDelay: 5000,
  onConnect: () => {
    console.log("WebSocket connected");
    isConnected = true;

    stompClient.subscribe("/topic/public", (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        store.dispatch(addMessage(chatMessage));
      } catch (e) {
        console.error("퍼블릭 메시지 파싱 실패:", e);
      }
    });

    stompClient.subscribe("/user/topic/private", (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        store.dispatch(addMessage(chatMessage));
      } catch (e) {
        console.error("프라이빗 메시지 파싱 실패:", e);
      }
    });

    // 큐에 저장된 메시지 전송
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift();
      stompClient.publish(msg);
      console.log("Queued 메시지 전송:", msg);
    }
  },
  onStompError: (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  },
  onWebSocketClose: (event) => {
    console.log(
      `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
    );
    isConnected = false;
  },
  onWebSocketError: (event) => {
    console.error("WebSocket error:", event);
  },
});

export const connectWebSocket = () => {
  console.log("Attempting to activate STOMP client");
  if (!stompClient.active) {
    stompClient.activate();
  }
};

export const disconnectWebSocket = () => {
  if (stompClient.active) {
    stompClient.deactivate();
  }
};

export const sendPrivateMessage = (chatMessage) => {
  console.log("Attempting to send private message. isConnected:", isConnected);
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/chat.privateMessage",
      body: JSON.stringify(chatMessage),
    });
    console.log(
      "프라이빗 메시지가 /app/chat.privateMessage로 전송됨:",
      chatMessage
    );
  } else {
    console.error(
      "WebSocket이 연결되어 있지 않습니다. 프라이빗 메시지를 전송할 수 없습니다:",
      chatMessage
    );
    // 메시지 큐에 저장
    messageQueue.push({
      destination: "/app/chat.privateMessage",
      body: JSON.stringify(chatMessage),
    });
  }
};

export const sendMessage = (chatMessage) => {
  console.log("Attempting to send public message. isConnected:", isConnected);
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });
    console.log("퍼블릭 메시지가 /app/chat.sendMessage로 전송됨:", chatMessage);
  } else {
    console.error(
      "WebSocket이 연결되어 있지 않습니다. 퍼블릭 메시지를 전송할 수 없습니다:",
      chatMessage
    );
    // 메시지 큐에 저장
    messageQueue.push({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });
  }
};
