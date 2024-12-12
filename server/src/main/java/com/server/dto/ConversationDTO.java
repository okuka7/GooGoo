package com.server.dto;

public class ConversationDTO {
    private String otherUsername;
    private String lastMessage;
    private String lastTimestamp;
    private long unreadCount;

    public ConversationDTO() {}

    public ConversationDTO(String otherUsername, String lastMessage, String lastTimestamp, long unreadCount) {
        this.otherUsername = otherUsername;
        this.lastMessage = lastMessage;
        this.lastTimestamp = lastTimestamp;
        this.unreadCount = unreadCount;
    }

    public String getOtherUsername() { return otherUsername; }
    public void setOtherUsername(String otherUsername) { this.otherUsername = otherUsername; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public String getLastTimestamp() { return lastTimestamp; }
    public void setLastTimestamp(String lastTimestamp) { this.lastTimestamp = lastTimestamp; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
}
