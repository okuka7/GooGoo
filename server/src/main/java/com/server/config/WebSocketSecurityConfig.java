// src/main/java/com/server/config/WebSocketSecurityConfig.java

package com.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

/**
 * WebSocket security configuration.
 */
@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                // CONNECT, DISCONNECT, HEARTBEAT 등은 인증 없이 허용
                .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.DISCONNECT, SimpMessageType.HEARTBEAT).permitAll()

                // 실제 앱 메시지(/app/**)에만 인증 필요
                .simpDestMatchers("/app/**").authenticated()

                // /topic/** 구독은 모두 허용
                .simpDestMatchers("/topic/**").permitAll()

                .anyMessage().denyAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
}
