package com.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 설문지를 작성하지 않은 사용자가 분양 신청을 시도할 때 발생하는 예외.
 */
public class SurveyNotCompletedException extends CustomException {
    public SurveyNotCompletedException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
