package com.server.repository;

import com.server.model.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findBySenderUsernameAndReceiverUsernameOrReceiverUsernameAndSenderUsernameOrderByTimestampAsc(
            String senderUsername1, String receiverUsername1, String senderUsername2, String receiverUsername2
    );

    List<ChatMessageEntity> findBySenderUsernameOrReceiverUsername(String senderUsername, String receiverUsername);

    long countByReceiverUsernameAndIsReadFalse(String receiverUsername);
}
