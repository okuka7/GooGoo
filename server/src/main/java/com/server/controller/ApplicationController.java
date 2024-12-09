package com.server.controller;

import com.server.dto.ApplicationResponseDto;
import com.server.dto.UpdateStatusRequestDto;
import com.server.model.ApplicationStatus;
import com.server.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 분양 신청 생성
    @PostMapping("/{postId}")
    public ResponseEntity<ApplicationResponseDto> createApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId) { // 명시적으로 "postId" 추가
        ApplicationResponseDto application = applicationService.createApplication(userDetails.getUsername(), postId);
        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    // 특정 게시물에 대한 신청자 목록 조회 (게시물 작성자만)
    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsByPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId) { // 명시적으로 "postId" 추가
        List<ApplicationResponseDto> applications = applicationService.getApplicationsByPost(userDetails.getUsername(), postId);
        return ResponseEntity.ok(applications);
    }

    // 신청 승인 또는 거절
    @PostMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("applicationId") Long applicationId,
            @RequestBody UpdateStatusRequestDto request // ✅ 요청 본문으로 DTO 받기
    ) {
        ApplicationResponseDto application = applicationService.updateApplicationStatus(userDetails.getUsername(), applicationId, request.getStatus());
        return ResponseEntity.ok(application);
    }
}
