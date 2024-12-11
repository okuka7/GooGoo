package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.common.exception.CustomException;
import com.server.model.User;
import com.server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserRegistrationDto validUserDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        validUserDto = new UserRegistrationDto();
        validUserDto.setUsername("testuser");
        validUserDto.setNickname("tester");
        validUserDto.setPassword("password123");
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.findByUsername(validUserDto.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(validUserDto.getPassword())).thenReturn("encodedPassword");

        User savedUser = User.builder()
                .id(1L)
                .username(validUserDto.getUsername())
                .nickname(validUserDto.getNickname())
                .password("encodedPassword")
                .roles(Collections.singleton("ROLE_USER"))
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.registerUser(validUserDto);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("tester", result.getNickname());
        assertEquals("encodedPassword", result.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_DuplicateUsername() {
        when(userRepository.findByUsername(validUserDto.getUsername()))
                .thenReturn(Optional.of(new User()));

        CustomException exception = assertThrows(CustomException.class, () -> {
            userService.registerUser(validUserDto);
        });

        assertEquals("이미 존재하는 아이디입니다.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
