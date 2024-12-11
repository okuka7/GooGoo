package com.server.service;

import com.server.common.exception.PostNotFoundException;
import com.server.common.exception.UnauthorizedAccessException;
import com.server.common.exception.SurveyNotCompletedException;
import com.server.dto.PostRequestDto;
import com.server.dto.PostResponseDto;
import com.server.model.Post;
import com.server.repository.PostRepository;
import com.server.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;


    @Value("${server.url}")
    private String serverUrl;

    // 게시물 목록 조회
    public List<PostResponseDto> getAllPosts() {
        log.debug("모든 게시물 조회 서비스 호출");
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> {
                    PostResponseDto dto = PostResponseDto.fromEntity(post);
                    if (post.getImageUrl() != null) {
                        dto.setImageUrl(serverUrl + post.getImageUrl()); // 서버 URL을 포함한 전체 경로 설정
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 게시물 상세 조회
    public PostResponseDto getPostById(Long postId) {
        log.debug("게시물 조회 서비스 호출: {}", postId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없습니다."));
        PostResponseDto dto = PostResponseDto.fromEntity(post);
        if (post.getImageUrl() != null) {
            dto.setImageUrl(serverUrl + post.getImageUrl()); // 서버 URL을 포함한 전체 경로 설정
        }
        return dto;
    }

    // 게시물 생성
    @Transactional
    public PostResponseDto createPost(String username, PostRequestDto postRequest, MultipartFile image) {
        log.debug("게시물 생성 서비스 호출: 사용자={}", username);
        var user = userService.findByUsername(username);

        // 설문지 작성 여부 확인
        if (!user.isSurveyCompleted()) {
            log.warn("설문지 미작성 사용자: {}", username);
            throw new SurveyNotCompletedException("설문지를 작성해야 합니다.");
        }

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAnimalType(postRequest.getAnimalType());
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());

        // 이미지 저장
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            post.setImageUrl(imageUrl);
        }

        Post savedPost = postRepository.save(post);
        log.info("게시물 생성 성공: 게시물ID={}", savedPost.getId());
        return PostResponseDto.fromEntity(savedPost);
    }

    // 게시물 수정
    @Transactional
    public PostResponseDto updatePost(String username, Long postId, PostRequestDto postRequest) {
        log.debug("게시물 수정 서비스 호출: 사용자={}, 게시물ID={}", username, postId);
        var user = userService.findByUsername(username);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없습니다."));

        if (!post.getAuthor().equals(user)) {
            log.warn("게시물 수정 권한 없음: 사용자={}, 게시물ID={}", username, postId);
            throw new UnauthorizedAccessException("게시물을 수정할 권한이 없습니다.");
        }

        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAnimalType(postRequest.getAnimalType());

        Post updatedPost = postRepository.save(post);
        log.info("게시물 수정 성공: 게시물ID={}", updatedPost.getId());
        return PostResponseDto.fromEntity(updatedPost);
    }

    // 게시물 삭제
    @Transactional
    public void deletePost(String username, Long postId) {
        log.debug("게시물 삭제 서비스 호출: 사용자={}, 게시물ID={}", username, postId);
        var user = userService.findByUsername(username);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없습니다."));

        if (!post.getAuthor().equals(user)) {
            log.warn("게시물 삭제 권한 없음: 사용자={}, 게시물ID={}", username, postId);
            throw new UnauthorizedAccessException("게시물을 삭제할 권한이 없습니다.");
        }

        postRepository.delete(post);
        log.info("게시물 삭제 성공: 게시물ID={}", postId);
    }


    // 사용자 이름으로 게시글 목록 조회 - 추가된 부분
    public List<PostResponseDto> getPostsByUsername(String username) {
        List<Post> posts = postRepository.findByAuthor_Username(username);
        return posts.stream()
                .map(PostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
