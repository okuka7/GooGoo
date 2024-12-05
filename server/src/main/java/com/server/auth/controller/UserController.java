package com.server.auth.controller;

import com.server.auth.model.User;
import com.server.auth.service.UserService;
import com.server.post.dto.PostResponseDto;
import com.server.post.service.PostService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PostService postService; // PostService 주입

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        UserResponse response = new UserResponse(
                user.getUsername(),
                user.getNickname(),
                user.isSurveyCompleted()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/posts")
    public ResponseEntity<List<PostResponseDto>> getMyPosts(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<PostResponseDto> myPosts = postService.getPostsByUsername(username);
        return ResponseEntity.ok(myPosts);
    }

    @Data
    @AllArgsConstructor
    public static class UserResponse {
        private String username;
        private String nickname;
        private boolean surveyCompleted;
    }
}
