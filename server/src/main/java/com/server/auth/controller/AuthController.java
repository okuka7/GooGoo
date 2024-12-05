package com.server.auth.controller;

import com.server.auth.dto.UserRegistrationDto;
import com.server.auth.service.UserService;
import com.server.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<JwtResponse> registerUser(@Valid @RequestBody UserRegistrationDto form) throws Exception {
        log.debug("회원 가입 요청: {}", form.getUsername());
        var user = userService.registerUser(form);
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @Getter
    @AllArgsConstructor
    static class JwtResponse {
        private String token;
    }
}
