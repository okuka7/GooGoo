package com.server.service;

import com.server.dto.UserRegistrationDto;
import com.server.common.exception.UsernameAlreadyExistsException;
import com.server.common.exception.UserNotFoundException;
import com.server.model.User;
import com.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(UserRegistrationDto userRegistrationDto) {
        log.debug("회원 가입 서비스 호출: {}", userRegistrationDto.getUsername());

        if (userRepository.existsByUsername(userRegistrationDto.getUsername())) {
            log.warn("이미 존재하는 아이디 시도: {}", userRegistrationDto.getUsername());
            throw new UsernameAlreadyExistsException("이미 존재하는 아이디입니다.");
        }

        User user = new User();
        user.setUsername(userRegistrationDto.getUsername());
        user.setNickname(userRegistrationDto.getNickname());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setRoles(Set.of("ROLE_USER"));

        User savedUser = userRepository.save(user);
        log.info("회원 가입 성공: 사용자ID={}", savedUser.getId());
        return savedUser;
    }

    public User findByUsername(String username) {
        log.debug("사용자 조회: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
