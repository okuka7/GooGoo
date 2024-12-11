package com.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationDto {

    @NotBlank(message = "아이디를 입력하세요.")
    private String username;

    @NotBlank(message = "닉네임을 입력하세요.")
    private String nickname;

    @NotBlank(message = "비밀번호를 입력하세요.")
    private String password;
}
