package com.example.controller;

import com.example.model.Chat;
import com.example.model.Invitation;
import com.example.model.Project;
import com.example.model.User;
import com.example.request.InviteRequest;
import com.example.response.MessageResponse;
import com.example.service.invitation.InvitationService;
import com.example.service.project.ProjectService;
import com.example.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private InvitationService invitationService;



    @GetMapping
    public ResponseEntity<List<Project>>getProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestHeader("Authorization") String jwt
    ) throws Exception{
        User user = userService.findUserProfileByJwt(jwt);
        List<Project> projects = projectService.getProjectByTeam(user,category,tag);
        return new ResponseEntity<>(projects,HttpStatus.OK);
    }


    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Project project = projectService.getProjectById(projectId);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Project project
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Project createdProject = projectService.createProject(project,user);
        return new ResponseEntity<>(createdProject, HttpStatus.OK);
    }

    @PatchMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project project,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Project updatedProject = projectService.updateProject(project, projectId, user.getId());
        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<MessageResponse> deleteProject(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        projectService.deleteProject(projectId, user.getId());
        MessageResponse res = new MessageResponse("Project deleted successfully!");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
            @RequestParam(required = false) String keyword,
            @RequestHeader("Authorization") String jwt

    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Project> projects = projectService.searchProjects(keyword,user);
        return new ResponseEntity<>(projects,HttpStatus.OK);
    }

    @GetMapping("/{projectId}/chat")
    public ResponseEntity<Chat> getChatByProjectId(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Chat chat = projectService.getChatByProjectId(projectId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }
    @DeleteMapping("/{projectId}/user/{userId}")
    public ResponseEntity<MessageResponse> removeUserFromProject(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        projectService.removeUserFromProject(projectId, userId);

        MessageResponse res = new MessageResponse("User removed from project successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
    @PostMapping("/invite")
    public ResponseEntity<MessageResponse> inviteProject(
            @RequestBody InviteRequest request,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        MessageResponse res = new MessageResponse("Invitation sent!");
        invitationService.sendInvitation(request.getEmail(), request.getProjectId());
        return new ResponseEntity<>(res,HttpStatus.OK);
    }

    @GetMapping("/accept_invitation")
    public ResponseEntity<Invitation> acceptInviteProject(
            @RequestParam String token,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Invitation invitation = invitationService.acceptInvitation(token,user.getId());
        projectService.addUserToProject(invitation.getProjectId(),user.getId());
        invitationService.deleteToken(token);
        return new ResponseEntity<>(invitation,HttpStatus.ACCEPTED);
    }

}
