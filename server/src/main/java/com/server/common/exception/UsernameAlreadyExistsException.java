package com.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 사용자 등록 시 이미 존재하는 아이디를 사용할 경우 발생하는 예외.
 */
public class UsernameAlreadyExistsException extends CustomException {
    public UsernameAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
