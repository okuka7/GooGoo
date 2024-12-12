package com.server.service;

import com.server.dto.ChatMessageDTO;
import com.server.dto.ConversationDTO;
import com.server.model.ChatMessage;
import com.server.model.ChatMessageEntity;
import com.server.repository.ChatMessageRepository;
import com.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatMessage createChatMessage(String sender, String receiver, String content) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSenderUsername(sender);
        chatMessage.setReceiverUsername(receiver);
        chatMessage.setContent(content);
        chatMessage.setTimestamp(java.time.LocalDateTime.now());
        chatMessage.setRead(false);
        return chatMessage;
    }

    /**
     * saveChatMessage 메서드가 ChatMessageEntity를 반환하도록 수정
     */
    public ChatMessageEntity saveChatMessage(ChatMessage chatMessage) {
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setSenderUsername(chatMessage.getSenderUsername());
        entity.setReceiverUsername(chatMessage.getReceiverUsername());
        entity.setContent(chatMessage.getContent());
        entity.setTimestamp(chatMessage.getTimestamp());
        entity.setRead(chatMessage.isRead());

        // 저장 후 엔티티 반환
        return chatMessageRepository.save(entity);
    }

    public List<ConversationDTO> getAllConversations(String currentUsername) {
        List<ChatMessageEntity> userMessages = chatMessageRepository.findBySenderUsernameOrReceiverUsername(
                currentUsername,
                currentUsername
        );

        Map<String, ChatMessageEntity> lastMessages = new HashMap<>();
        Map<String, Long> unreadCounts = new HashMap<>();

        for (ChatMessageEntity msg : userMessages) {
            String otherUsername = msg.getSenderUsername().equals(currentUsername) ? msg.getReceiverUsername() : msg.getSenderUsername();

            if (!lastMessages.containsKey(otherUsername) ||
                    msg.getTimestamp().isAfter(lastMessages.get(otherUsername).getTimestamp())) {
                lastMessages.put(otherUsername, msg);
            }

            if (msg.getReceiverUsername().equals(currentUsername) && !msg.isRead()) {
                unreadCounts.put(otherUsername, unreadCounts.getOrDefault(otherUsername, 0L) + 1);
            }
        }

        return lastMessages.entrySet().stream()
                .map(entry -> {
                    String otherUsername = entry.getKey();
                    ChatMessageEntity lastMsg = entry.getValue();
                    long unreadCount = unreadCounts.getOrDefault(otherUsername, 0L);

                    return new ConversationDTO(
                            otherUsername,
                            lastMsg.getContent(),
                            lastMsg.getTimestamp().toString(),
                            unreadCount
                    );
                })
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getConversation(String currentUsername, String otherUsername) {
        List<ChatMessageEntity> messages = chatMessageRepository.findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
                currentUsername, otherUsername, otherUsername, currentUsername
        );

        return messages.stream().map(msg -> new ChatMessageDTO(
                msg.getId(),
                msg.getSenderUsername(),
                msg.getReceiverUsername(),
                msg.getContent(),
                msg.getTimestamp()
        )).collect(Collectors.toList());
    }

    public long getUnreadCount(String username) {
        return chatMessageRepository.countByReceiverUsernameAndIsReadFalse(username);
    }
}
