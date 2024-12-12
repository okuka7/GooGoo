package com.server.controller;

import com.server.dto.ChatMessageDTO;
import com.server.dto.ConversationDTO;
import com.server.model.ChatMessage;
import com.server.model.ChatMessageEntity;
import com.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String currentUsername = principal.getName();
        List<ConversationDTO> conversations = messageService.getAllConversations(currentUsername);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{otherUsername}")
    public ResponseEntity<List<ChatMessageDTO>> getConversationWithUser(
            Principal principal,
            @PathVariable("otherUsername") String otherUsername) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String currentUsername = principal.getName();
        List<ChatMessageDTO> conversation = messageService.getConversation(currentUsername, otherUsername);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping
    public ResponseEntity<ChatMessageDTO> sendMessage(
            Principal principal,
            @RequestBody ChatMessageDTO chatMessageDTO) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        String senderUsername = principal.getName();

        if (chatMessageDTO.getReceiverUsername() == null || chatMessageDTO.getReceiverUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (chatMessageDTO.getContent() == null || chatMessageDTO.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ChatMessage chatMessage = messageService.createChatMessage(senderUsername,
                chatMessageDTO.getReceiverUsername(),
                chatMessageDTO.getContent());

        // 수정된 부분: saveChatMessage 반환값을 엔티티로 받고, 엔티티에서 ID 추출
        ChatMessageEntity savedEntity = messageService.saveChatMessage(chatMessage);

        ChatMessageDTO responseDTO = new ChatMessageDTO(
                savedEntity.getId(),
                savedEntity.getSenderUsername(),
                savedEntity.getReceiverUsername(),
                savedEntity.getContent(),
                savedEntity.getTimestamp()
        );

        return ResponseEntity.ok(responseDTO);
    }
}
