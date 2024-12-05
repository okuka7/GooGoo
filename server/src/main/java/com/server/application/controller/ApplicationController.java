package com.server.application.controller;

import com.server.application.dto.ApplicationResponseDto;
import com.server.application.model.ApplicationStatus;
import com.server.application.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 분양 신청 생성
    @PostMapping("/{postId}")
    public ResponseEntity<ApplicationResponseDto> createApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId) throws Exception {
        log.debug("분양 신청 생성 요청: 사용자={}, 게시물ID={}", userDetails.getUsername(), postId);
        ApplicationResponseDto application = applicationService.createApplication(userDetails.getUsername(), postId);
        return ResponseEntity.ok(application);
    }

    // 특정 게시물에 대한 신청자 목록 조회 (게시물 작성자만)
    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<ApplicationResponseDto>> getApplicationsByPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("postId") Long postId) throws Exception {
        log.debug("신청자 목록 조회 요청: 사용자={}, 게시물ID={}", userDetails.getUsername(), postId);
        List<ApplicationResponseDto> applications = applicationService.getApplicationsByPost(userDetails.getUsername(), postId);
        return ResponseEntity.ok(applications);
    }

    // 신청 승인 또는 거절
    @PostMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("applicationId") Long applicationId,
            @RequestParam("status") ApplicationStatus status) throws Exception {
        log.debug("신청 상태 변경 요청: 사용자={}, 신청ID={}, 상태={}", userDetails.getUsername(), applicationId, status);
        ApplicationResponseDto application = applicationService.updateApplicationStatus(userDetails.getUsername(), applicationId, status);
        return ResponseEntity.ok(application);
    }
}
