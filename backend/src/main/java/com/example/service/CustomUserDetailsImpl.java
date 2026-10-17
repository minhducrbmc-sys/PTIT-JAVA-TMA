package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// Đăng ký Bean với Spring, giúp thay thế tài khoản và mật khẩu mặc định của Spring Security
@Service
public class CustomUserDetailsImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository; // Dùng để truy vấn bảng User trong MySQL

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Tìm tài khoản trong database theo email (email đóng vai trò là username)
        User user = userRepository.findByEmail(username);

        // 2. Nếu không tìm thấy, báo lỗi xác thực thất bại
        if (user == null) {
            throw new UsernameNotFoundException("Unable to find account associated with email " + username);
        }

        // 3. Danh sách quyền/vai trò (hiện tại để trống vì chưa phân quyền phức tạp)
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 4. Trả về đối tượng UserDetails chuẩn của Spring Security (email, password băm, quyền)
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}