package com.server.controller;

import com.server.dto.PostRequestDto;
import com.server.dto.PostResponseDto;
import com.server.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시물 목록 조회
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllPosts() {
        log.debug("게시물 목록 조회 요청");
        List<PostResponseDto> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // 게시물 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable("postId") Long postId) throws Exception {
        log.debug("게시물 상세 조회 요청: {}", postId);
        PostResponseDto post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // 게시물 생성
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("post") PostRequestDto postRequest,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        log.debug("게시물 생성 요청: 사용자={}, 제목={}", userDetails.getUsername(), postRequest.getTitle());
        PostResponseDto createdPost = postService.createPost(userDetails.getUsername(), postRequest, image);
        return ResponseEntity.ok(createdPost);
    }

    // 게시물 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId,
            @Valid @RequestBody PostRequestDto postRequest) throws Exception {
        log.debug("게시물 수정 요청: 사용자={}, 게시물ID={}", userDetails.getUsername(), postId);
        PostResponseDto updatedPost = postService.updatePost(userDetails.getUsername(), postId, postRequest);
        return ResponseEntity.ok(updatedPost);
    }

    // 게시물 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId) throws Exception {
        log.debug("게시물 삭제 요청: 사용자={}, 게시물ID={}", userDetails.getUsername(), postId);
        postService.deletePost(userDetails.getUsername(), postId);
        return ResponseEntity.noContent().build();
    }
}
