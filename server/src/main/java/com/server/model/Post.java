package com.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;

    private String animalType; // 반려동물 종류

    private String imageUrl; // 이미지 경로

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    private String authorUsername;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();

    private boolean completed = false;  // 초기값 false
}

