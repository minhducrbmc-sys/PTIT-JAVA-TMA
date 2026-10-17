package com.example.controller;

import com.example.config.JwtProvider;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.request.LoginRequest;
import com.example.request.SignupRequest;
import com.example.response.AuthResponse;
import com.example.service.CustomUserDetailsImpl;
import com.example.service.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsImpl customUserDetails;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) throws Exception {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return new ResponseEntity<>("Email is required.", HttpStatus.BAD_REQUEST);
        }

        // Do not issue OTP if the email already belongs to an existing user
        User isUserExist = userRepository.findByEmail(email);
        if (isUserExist != null) {
            return new ResponseEntity<>("This email account is already in use.", HttpStatus.BAD_REQUEST);
        }

        emailService.sendOtpEmail(email);
        return new ResponseEntity<>("OTP sent successfully.", HttpStatus.OK);
    }

    @PostMapping("/signup") // Code cho đăng ký
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest req) throws Exception {

        // 1. Xác thực mã OTP trước khi tạo tài khoản
        boolean isValidOtp = emailService.verifyOtp(req.getEmail(), req.getOtp());
        if (!isValidOtp) {
            throw new BadCredentialsException("Invalid or expired OTP");
        }

        // 2. Kiểm tra email tồn tại ko
        User isUserExist = userRepository.findByEmail(req.getEmail());
        if (isUserExist != null) {
            throw new Exception("This email account is already in use.");
        }

        // 3. Tạo user mới
        User createdUser = new User();
        createdUser.setPassword(passwordEncoder.encode(req.getPassword())); // Password encode
        createdUser.setEmail(req.getEmail());
        createdUser.setFullName(req.getFullName());

        // Lưu vào repository
        User savedUser = userRepository.save(createdUser);

        // 4. Tạo xác thực, lưu vào Spring SecurityContext
        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Sinh token jwt từ thông tin authentication
        String jwt = JwtProvider.generateToken(authentication);

        // In thông báo đăng ký tk thành công
        AuthResponse res = new AuthResponse();
        res.setMessage("Sign Up Success!");
        res.setJwt(jwt);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            Authentication authentication = authenticate(username, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = JwtProvider.generateToken(authentication);

            AuthResponse res = new AuthResponse();
            res.setMessage("Sign In Success!");
            res.setJwt(jwt);

            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Email or password is wrong", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private Authentication authenticate(String username, String password) {
        // Trường hợp sai username
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid Username");
        }
        // Trường hợp sai mật khẩu
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }
        // Nếu đúng cả hai thì trả lại xác thực hợp lệ + danh sách quyền hạng
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}