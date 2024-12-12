package com.server.config;

import com.server.service.CustomUserDetailsService;
import com.server.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {
        String token = null;

        if (request instanceof org.springframework.http.server.ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
            String authorizationHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
                System.out.println("Extracted Bearer token from Authorization header: " + token);
            } else {
                token = httpServletRequest.getParameter("token");
                System.out.println("Extracted token from request parameter: " + token);
            }
        }

        if (token != null) {
            try {
                if (jwtUtil.validateJwtToken(token)) {
                    String username = jwtUtil.getUsernameFromJwt(token);
                    System.out.println("Token validated successfully. Username: " + username);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );

                    attributes.put("user", authentication);
                    System.out.println("Authentication object stored in attributes.");
                    return true;
                } else {
                    System.out.println("Token validation failed.");
                }
            } catch (Exception e) {
                System.out.println("Exception during token validation: " + e.getMessage());
            }
        } else {
            System.out.println("No token provided in WebSocket handshake.");
        }

        if (response instanceof org.springframework.http.server.ServletServerHttpResponse serverHttpResponse) {
            serverHttpResponse.getServletResponse().setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            System.out.println("Handshake unauthorized. Responded with 401.");
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // no-op
    }
}
