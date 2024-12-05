package com.server.common.exception;

import org.springframework.http.HttpStatus;

public class AlreadyAppliedException extends CustomException {
    public AlreadyAppliedException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
