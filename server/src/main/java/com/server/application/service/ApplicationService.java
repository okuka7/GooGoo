package com.server.application.service;

import com.server.application.dto.ApplicationResponseDto;
import com.server.application.model.Application;
import com.server.application.model.ApplicationStatus;
import com.server.application.repository.ApplicationRepository;
import com.server.auth.service.UserService;
import com.server.common.exception.AlreadyAppliedException;
import com.server.common.exception.ApplicationNotFoundException;
import com.server.common.exception.PostNotFoundException;
import com.server.common.exception.UnauthorizedAccessException;
import com.server.common.exception.SurveyNotCompletedException;
import com.server.post.model.Post;
import com.server.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    // 분양 신청 생성
    @Transactional
    public ApplicationResponseDto createApplication(String username, Long postId) {
        log.debug("분양 신청 생성 서비스 호출: 사용자={}, 게시물ID={}", username, postId);
        var user = userService.findByUsername(username);

        // 설문지 작성 여부 확인
        if (!user.isSurveyCompleted()) {
            log.warn("설문지 미작성 사용자: {}", username);
            throw new SurveyNotCompletedException("설문지를 작성해야 합니다.");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없습니다."));

        // 이미 신청했는지 확인
        boolean alreadyApplied = applicationRepository.existsByPostAndApplicant(post, user);
        if (alreadyApplied) {
            log.warn("이미 신청한 사용자: {}, 게시물ID={}", username, postId);
            throw new AlreadyAppliedException("이미 신청하셨습니다.");
        }

        Application application = new Application();
        application.setApplicant(user);
        application.setPost(post);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        Application savedApplication = applicationRepository.save(application);
        log.info("분양 신청 생성 성공: 신청ID={}", savedApplication.getId());
        return ApplicationResponseDto.fromEntity(savedApplication);
    }

    // 특정 게시물에 대한 신청자 목록 조회
    public List<ApplicationResponseDto> getApplicationsByPost(String username, Long postId) {
        log.debug("신청자 목록 조회 서비스 호출: 사용자={}, 게시물ID={}", username, postId);
        var user = userService.findByUsername(username);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("게시물을 찾을 수 없습니다."));

        if (!post.getAuthor().equals(user)) {
            log.warn("신청자 목록 조회 권한 없음: 사용자={}, 게시물ID={}", username, postId);
            throw new UnauthorizedAccessException("신청자 목록을 조회할 권한이 없습니다.");
        }

        List<Application> applications = applicationRepository.findByPost(post);
        return applications.stream()
                .map(ApplicationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 신청 상태 업데이트
    @Transactional
    public ApplicationResponseDto updateApplicationStatus(String username, Long applicationId, ApplicationStatus status) {
        log.debug("신청 상태 변경 서비스 호출: 사용자={}, 신청ID={}, 상태={}", username, applicationId, status);
        var user = userService.findByUsername(username);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException("신청을 찾을 수 없습니다."));

        if (!application.getPost().getAuthor().equals(user)) {
            log.warn("신청 상태 변경 권한 없음: 사용자={}, 신청ID={}", username, applicationId);
            throw new UnauthorizedAccessException("신청 상태를 변경할 권한이 없습니다.");
        }

        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        log.info("신청 상태 변경 성공: 신청ID={}, 상태={}", applicationId, status);
        return ApplicationResponseDto.fromEntity(updatedApplication);
    }
}
