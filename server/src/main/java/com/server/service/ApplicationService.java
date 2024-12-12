// src/main/java/com/server/service/ApplicationService.java

package com.server.service;

import com.server.dto.ApplicationResponseDto;
import com.server.model.Application;
import com.server.model.ApplicationStatus;
import com.server.model.Post;
import com.server.model.User;
import com.server.repository.ApplicationRepository;
import com.server.repository.PostRepository;
import com.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 다른 메소드들...

    @Transactional
    public ApplicationResponseDto updateApplicationStatus(String username, Long applicationId, ApplicationStatus status) {
        // 신청자 검증
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        // 게시물 소유자 검증 (게시물 작성자인지 확인)
        Post post = application.getPost();
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        // 신청 상태 변경
        application.setStatus(status);
        applicationRepository.save(application);

        // 만약 ACCEPTED 상태라면 해당 게시물 completed 처리
        if (status == ApplicationStatus.ACCEPTED) {
            post.setCompleted(true);
            postRepository.save(post);

        }

        return ApplicationResponseDto.fromEntity(application);
    }

    // 특정 게시물에 대한 신청자 목록 조회 (게시물 작성자만)
    public List<ApplicationResponseDto> getApplicationsByPost(String username, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // 게시물 작성자 검증
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        List<Application> applications = applicationRepository.findByPost(post);
        return applications.stream()
                .map(ApplicationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 분양 신청 생성
    @Transactional
    public ApplicationResponseDto createApplication(String username, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // 이미 분양 완료된 게시물에는 신청 불가
        if (post.isCompleted()) {
            throw new IllegalArgumentException("이미 분양이 완료된 게시물입니다.");
        }

        // 신청자 정보 가져오기
        User applicant = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 새로운 Application 생성
        Application application = new Application();
        application.setAppliedAt(java.time.LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);
        application.setPost(post);
        application.setApplicant(applicant);

        applicationRepository.save(application);

        return ApplicationResponseDto.fromEntity(application);
    }
}
