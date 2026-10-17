package com.example.config;

import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.Nullable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * @Configuration: Đánh dấu class này chứa các cấu hình Bean cho ứng dụng Spring Boot.
 * @EnableWebSecurity: Kích hoạt tính năng bảo mật web của Spring Security.
 */
@Configuration
@EnableWebSecurity
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Quản lý Session: Chuyển sang chế độ STATELESS vì hệ thống dùng JWT.
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 2. Phân quyền Request:
                .authorizeHttpRequests(authorize -> authorize
                        // Mọi request bắt đầu bằng "/api/**" đều phải được xác thực (cần có JWT hợp lệ).
                        .requestMatchers("/api/**").authenticated()
                        // Cho phép truy cập tự do vào các endpoint auth và còn lại
                        .anyRequest().permitAll())

                // 3. Đăng ký Filter: Chèn JwtTokenValidator vào TRƯỚC BasicAuthenticationFilter.
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)

                // 4. Tắt CSRF: Dùng REST API xác thực qua JWT (Stateless).
                .csrf(csrf -> csrf.disable())

                // 5. Cấu hình CORS:
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public @Nullable CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();

                // Cho phép localhost lẫn dải IP mạng nội bộ (LAN 192.168.x.x) với mọi port
                cfg.setAllowedOriginPatterns(Arrays.asList(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "http://192.168.*:*",
                        "http://10.170.*:*",
                        "http://172.16.*:*",
                        "http://10.97.*:*",
                        "http://172.17.*:*",
                        "http://26.*:*"
                ));

                // Cho phép tất cả các HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS,...)
                cfg.setAllowedMethods(Collections.singletonList("*"));

                // Cho phép gửi kèm cookie/credentials/headers
                cfg.setAllowCredentials(true);

                // Cho phép tất cả các request header
                cfg.setAllowedHeaders(Collections.singletonList("*"));

                // Cho phép client đọc header 'Authorization'
                cfg.setExposedHeaders(Arrays.asList("Authorization"));

                // Cache kết quả preflight (OPTIONS) trong 1 giờ
                cfg.setMaxAge(3600L);

                return cfg;
            }
        };
    }

    /**
     * Bean PasswordEncoder sử dụng thuật toán băm BCrypt.
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}