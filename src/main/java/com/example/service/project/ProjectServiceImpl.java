package com.example.service.project;

import com.example.model.Chat;
import com.example.model.Project;
import com.example.model.User;
import com.example.repository.ProjectRepository;
import com.example.repository.UserRepository;
import com.example.service.user.UserService;
import com.example.service.chat.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

    @Override
    public Project createProject(Project project, User user) throws Exception {
        // Tạo project mới
        Project createdProject = new Project();
        createdProject.setOwner(user);

        // Read from the incoming parameter 'project'
        createdProject.setName(project.getName());
        createdProject.setDescription(project.getDescription());
        createdProject.setCategory(project.getCategory());
        createdProject.setTags(project.getTags());

        createdProject.getTeam().add(user);

        Project savedProject = projectRepository.save(createdProject);

        user.setProjectSize(user.getProjectSize() + 1);
        userRepository.save(user);


        // Tạo chat mới cho project
        Chat chat = new Chat();
        chat.setProject(savedProject);
        Chat projectChat = chatService.createChat(chat);
        savedProject.setChat(projectChat);

        return savedProject;
    }

    @Override
    public List<Project> getProjectByTeam(User user, String category, String tag) throws Exception {
        List<Project> projects = projectRepository.findByTeamContainingOrOwner(user,user);

        if(category!=null){
            projects = projects.stream().filter(project -> project.getCategory().equals(category))
                    .collect(Collectors.toList());
        }
        if(tag!=null){
            projects = projects.stream().filter(project -> project.getTags().contains(tag))
                    .collect(Collectors.toList());
        }

        return projects;
    }

    @Override
    public Project getProjectById(Long ProjectId) throws Exception {
        Optional<Project> optionalProject = projectRepository.findById(ProjectId);
        if(optionalProject.isEmpty()) throw new Exception("Project not found");
        return optionalProject.get();
    }

    @Override
    public void deleteProject(Long projectID, Long userID) throws Exception {

        Project project = getProjectById(projectID);
        User user = userService.findUserbyID(userID);

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new Exception("Unauthorized: Only the project owner can delete this project!");
        }

        if (user.getProjectSize() > 0) {
            user.setProjectSize(user.getProjectSize() - 1);
            userRepository.save(user);
        }

        projectRepository.deleteById(projectID);
    }

    @Override
    public Project updateProject(Project updatedProject, Long id, Long userId) throws Exception {
        Project project = getProjectById(id);
        User user = userService.findUserbyID(userId);

        if (updatedProject.getStatus() != null && !updatedProject.getStatus().isEmpty()) {
            if (!project.getOwner().getId().equals(user.getId())) {
                throw new Exception("Unauthorized: Only the project creator can change the project status!");
            }
            project.setStatus(updatedProject.getStatus());
        }

        if (updatedProject.getName() != null && !updatedProject.getName().isEmpty()) {
            project.setName(updatedProject.getName());
        }
        if (updatedProject.getDescription() != null && !updatedProject.getDescription().isEmpty()) {
            project.setDescription(updatedProject.getDescription());
        }
        if (updatedProject.getTags() != null && !updatedProject.getTags().isEmpty()) {
            project.setTags(updatedProject.getTags());
        }
        if (updatedProject.getCategory() != null && !updatedProject.getCategory().isEmpty()) {
            project.setCategory(updatedProject.getCategory());
        }

        return projectRepository.save(project);
    }

    @Override
    public void addUserToProject(Long projectID, Long userID) throws Exception {
        Project project = getProjectById(projectID);
        User user = userService.findUserbyID(userID);
        if(!project.getTeam().contains(user)){
            project.getChat().getUsers().add(user);
            project.getTeam().add(user);
        }
        projectRepository.save(project);
    }

    @Override
    public void removeUserFromProject(Long projectID, Long userID) throws Exception {
        Project project = getProjectById(projectID);
        User user = userService.findUserbyID(userID);
        if(project.getTeam().contains(user)){
            project.getChat().getUsers().remove(user);
            project.getTeam().remove(user);
        }
        projectRepository.save(project);
    }

    @Override
    public Chat getChatByProjectId(Long projectID) throws Exception {
        Project project = getProjectById(projectID);
        return project.getChat();
    }

    @Override
    public List<Project> searchProjects(String keyword, User user) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return projectRepository.findByTeamContainingOrOwner(user, user);
        }
        return projectRepository.findByNameAndUserMembership(keyword.trim(), user);
    }


}
