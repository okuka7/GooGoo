package com.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 권한이 없을 때 발생하는 예외.
 */
public class UnauthorizedAccessException extends CustomException {
    public UnauthorizedAccessException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
