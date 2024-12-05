package com.server.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String username = authentication.getName();
        String token = jwtUtil.generateToken(username);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", token);

        String jsonResponse = objectMapper.writeValueAsString(tokenMap);
        response.getWriter().write(jsonResponse);
    }
}
