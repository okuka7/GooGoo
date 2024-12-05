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

    public static ApplicationResponseDto fromEntity(Application application) {
        ApplicationResponseDto response = new ApplicationResponseDto();
        response.setId(application.getId());
        response.setApplicantNickname(application.getApplicant().getNickname());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }
}

