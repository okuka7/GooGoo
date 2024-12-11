package com.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.dto.UserRegistrationDto;
import com.server.common.exception.CustomException;
import com.server.model.User;
import com.server.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserRegistrationDto validUser;

    @BeforeEach
    void setUp() {
        validUser = new UserRegistrationDto();
        validUser.setUsername("testuser");
        validUser.setNickname("tester");
        validUser.setPassword("Password123");
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        // Mocking UserService.registerUser() to return a User object
        User savedUser = User.builder()
                .id(1L)
                .username(validUser.getUsername())
                .nickname(validUser.getNickname())
                .password("encodedPassword123")
                .roles(Collections.singleton("ROLE_USER"))
                .build();

        when(userService.registerUser(any(UserRegistrationDto.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUser))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())) // CSRF 토큰 추가
                .andExpect(status().isOk())
                .andExpect(content().string("회원가입이 완료되었습니다."));
    }

    @Test
    void testRegisterUser_InvalidInput() throws Exception {
        validUser.setUsername(""); // 유효하지 않은 데이터

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUser))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())) // CSRF 토큰 추가
                .andExpect(status().isBadRequest())
                .andExpect(content().string("유효하지 않은 데이터입니다."));
    }

    @Test
    void testRegisterUser_DuplicateUsername() throws Exception {
        // userService.registerUser()가 CustomException을 던지도록 모킹
        doThrow(new CustomException("이미 존재하는 아이디입니다."))
                .when(userService).registerUser(any(UserRegistrationDto.class));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUser))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())) // CSRF 토큰 추가
                .andExpect(status().isBadRequest())
                .andExpect(content().string("이미 존재하는 아이디입니다."));
    }
}
