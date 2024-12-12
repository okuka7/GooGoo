package com.server.controller;

import com.server.model.ChatMessage;
import com.server.model.ChatMessageEntity;
import com.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, Principal principal) {
        System.out.println("sendMessage called by user: " + (principal != null ? principal.getName() : "null"));
        try {
            if (chatMessage.getTimestamp() == null) {
                chatMessage.setTimestamp(java.time.LocalDateTime.now());
            }

            if (principal == null) {
                throw new RuntimeException("No authenticated user found for public message.");
            }

            // SenderUsername을 현재 인증된 사용자로 설정
            chatMessage.setSenderUsername(principal.getName());

            ChatMessageEntity savedEntity = messageService.saveChatMessage(chatMessage);

            ChatMessage responseMessage = new ChatMessage();
            responseMessage.setId(savedEntity.getId());
            responseMessage.setSenderUsername(savedEntity.getSenderUsername());
            responseMessage.setReceiverUsername(savedEntity.getReceiverUsername());
            responseMessage.setContent(savedEntity.getContent());
            responseMessage.setTimestamp(savedEntity.getTimestamp());
            responseMessage.setRead(savedEntity.isRead());

            return responseMessage;
        } catch (Exception e) {
            System.err.println("Error in sendMessage: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @MessageMapping("/chat.privateMessage")
    @SendToUser("/topic/private")
    public ChatMessage sendPrivateMessage(@Payload ChatMessage chatMessage, Principal principal) {
        System.out.println("sendPrivateMessage called by user: " + (principal != null ? principal.getName() : "null"));
        try {
            if (chatMessage.getTimestamp() == null) {
                chatMessage.setTimestamp(java.time.LocalDateTime.now());
            }

            if (principal == null) {
                throw new RuntimeException("No authenticated user found for private message.");
            }

            // SenderUsername을 현재 인증된 사용자로 설정
            chatMessage.setSenderUsername(principal.getName());

            ChatMessageEntity savedEntity = messageService.saveChatMessage(chatMessage);

            ChatMessage responseMessage = new ChatMessage();
            responseMessage.setId(savedEntity.getId());
            responseMessage.setSenderUsername(savedEntity.getSenderUsername());
            responseMessage.setReceiverUsername(savedEntity.getReceiverUsername());
            responseMessage.setContent(savedEntity.getContent());
            responseMessage.setTimestamp(savedEntity.getTimestamp());
            responseMessage.setRead(savedEntity.isRead());

            return responseMessage;
        } catch (Exception e) {
            System.err.println("Error in sendPrivateMessage: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
