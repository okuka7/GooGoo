package com.server.common.exception;

import org.springframework.http.HttpStatus;

public class PostNotFoundException extends CustomException {
    public PostNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
