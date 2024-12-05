package com.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 분양 신청을 찾을 수 없을 때 발생하는 예외.
 */
public class ApplicationNotFoundException extends CustomException {
    public ApplicationNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
