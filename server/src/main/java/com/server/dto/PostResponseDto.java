package com.server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.server.model.Post;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponseDto {

    private Long id;
    private String title;
    private String content;
    private String animalType;
    private String imageUrl;
    private String authorUsername;  // 추가된 필드
    private String authorNickname;
    private boolean completed; // 추가
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public static PostResponseDto fromEntity(Post post) {
        PostResponseDto response = new PostResponseDto();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setAnimalType(post.getAnimalType());
        response.setImageUrl(post.getImageUrl());
        response.setAuthorUsername(post.getAuthor().getUsername()); // 추가된 부분
        response.setAuthorNickname(post.getAuthor().getNickname());
        response.setCreatedAt(post.getCreatedAt());
        response.setCompleted(post.isCompleted()); // 추가된 부분
        return response;
    }
}
