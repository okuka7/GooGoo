package com.server.application.dto;

import com.server.application.model.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateStatusRequestDto {
    private ApplicationStatus status;
}
