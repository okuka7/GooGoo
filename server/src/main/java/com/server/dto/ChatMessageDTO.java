package com.server.dto;

import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private String senderUsername;
    private String receiverUsername;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessageDTO() {}

    public ChatMessageDTO(Long id, String senderUsername, String receiverUsername, String content, LocalDateTime timestamp) {
        this.id = id;
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
        this.content = content;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSenderUsername() { return senderUsername; }
    public void setSenderUsername(String senderUsername) { this.senderUsername = senderUsername; }

    public String getReceiverUsername() { return receiverUsername; }
    public void setReceiverUsername(String receiverUsername) { this.receiverUsername = receiverUsername; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
