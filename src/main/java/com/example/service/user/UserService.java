package com.example.service.user;

import com.example.model.Project;
import com.example.model.User;

import java.util.List;

public interface UserService {
    User findUserProfileByJwt(String jwt)throws Exception;

    User findUserByEmail(String email)throws Exception;

    User findUserbyID(Long userID) throws Exception;

    User updateUserProjectSize(User user, int number);

    List<Project> searchProject(String keyword, User user) throws Exception;
}
