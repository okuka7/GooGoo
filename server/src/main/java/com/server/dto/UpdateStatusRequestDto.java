package com.server.dto;

import com.server.model.ApplicationStatus;
import lombok.Data;

@Data
public class UpdateStatusRequestDto {
    private ApplicationStatus status;
}
