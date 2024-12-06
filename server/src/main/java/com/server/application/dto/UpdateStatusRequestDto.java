// src/main/java/com/server/application/dto/UpdateApplicationStatusRequest.java

package com.server.application.dto;

import com.server.application.model.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateApplicationStatusRequest {
    private ApplicationStatus status;
}
