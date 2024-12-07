// src/main/java/com/server/application/dto/ApplicationResponseDto.java

package com.server.application.dto;

import com.server.application.model.Application;
import com.server.application.model.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponseDto {

    private Long id;
    private String applicantNickname;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private Long userId; // 추가된 필드

    public static ApplicationResponseDto fromEntity(Application application) {
        ApplicationResponseDto response = new ApplicationResponseDto();
        response.setId(application.getId());
        response.setApplicantNickname(application.getApplicant().getNickname());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        response.setUserId(application.getApplicant().getId()); // userId 설정
        return response;
    }
}

