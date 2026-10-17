package com.example.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Lấy chuỗi JWT từ Request Header (thường là "Authorization")
        String authHeader = request.getHeader(JwtConstant.JWT_HEADER);

        // 2. Kiểm tra chuỗi có hợp lệ và bắt đầu bằng "Bearer " hay không
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            try {
                // 3. Tạo SecretKey và giải mã Token lấy Claims
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes(StandardCharsets.UTF_8));

                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                // 4. Trích xuất thông tin
                String email = String.valueOf(claims.get("email"));
                String authorities = String.valueOf(claims.get("authorities"));

                // 5. Chuyển roles/authorities
                List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                // 6. Lưu vào SecurityContext
                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // Token lỗi/hết hạn -> trả về 401 JSON rõ ràng, ngăn chặn 500 error
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"status\": 401, \"message\": \"Invalid or expired token\"}");
                return; // Dừng filter chain tại đây, không cho đi tiếp
            }
        }

        // 7. Cho phép request đi tiếp nếu không có token hoặc token hợp lệ
        filterChain.doFilter(request, response);
    }
}