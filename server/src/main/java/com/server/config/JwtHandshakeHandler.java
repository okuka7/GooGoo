package com.server.config;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.Map;

public class JwtHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(org.springframework.http.server.ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        Authentication authentication = (Authentication) attributes.get("user");
        if (authentication != null) {
            System.out.println("JwtHandshakeHandler: Authentication is not null. Principal: " + authentication.getName());
            return authentication;
        }
        System.out.println("JwtHandshakeHandler: Authentication is null.");
        return null;
    }
}
