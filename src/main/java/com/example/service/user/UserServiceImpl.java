package com.example.service.user;

import com.example.config.JwtProvider;
import com.example.model.Project;
import com.example.model.User;
import com.example.repository.ProjectRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String email = JwtProvider.getEmailFromToken(jwt);
        return findUserByEmail(email);
    }

    @Override //Tìm người dùng với email
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if(user==null) throw new Exception("Can not find user with the specified Email");
        return user;
    }

    @Override //Tìm người dùng với ID
    public User findUserbyID(Long userID) throws Exception {
        Optional<User> optionalUser = userRepository.findById(userID);
        if(optionalUser.isEmpty()) throw new Exception("Can not find user with the specified ID");
        return optionalUser.get();
    }

    @Override //Người dùng có bao nhiêu project
    public User updateUserProjectSize(User user, int number) {
        user.setProjectSize(user.getProjectSize()+number);
        return userRepository.save(user);
    }

    @Override
    public List<Project> searchProject(String keyword, User user) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return projectRepository.findByTeamContainingOrOwner(user, user);
        }
        return projectRepository.findByNameAndUserMembership(keyword.trim(), user);
    }
}
