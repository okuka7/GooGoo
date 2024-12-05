package com.server.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtils {

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 비밀번호를 암호화합니다.
     *
     * @param rawPassword 원본 비밀번호
     * @return 암호화된 비밀번호
     */
    public static String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 입력된 비밀번호와 암호화된 비밀번호를 비교합니다.
     *
     * @param rawPassword      원본 비밀번호
     * @param encodedPassword  암호화된 비밀번호
     * @return 비밀번호가 일치하면 true, 아니면 false
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
