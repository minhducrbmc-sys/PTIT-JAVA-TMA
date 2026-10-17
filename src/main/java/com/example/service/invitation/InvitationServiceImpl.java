package com.example.service.invitation;

import com.example.model.Invitation;
import com.example.model.Project;
import com.example.repository.InvitationRepository;
import com.example.service.email.EmailService;
import com.example.service.project.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InvitationServiceImpl implements InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProjectService projectService;

    @Value("${app.frontend.url:http://26.116.21.8:5173}")
    private String frontendBaseUrl;

    @Override
    public void sendInvitation(String email, Long projectId) throws Exception {
        Project project = projectService.getProjectById(projectId);
        if (project == null) {
            throw new Exception("Project not found with id: " + projectId);
        }

        String invitationToken = UUID.randomUUID().toString();

        Invitation invitation = new Invitation();
        invitation.setEmail(email);
        invitation.setProjectId(projectId);
        invitation.setToken(invitationToken);

        invitationRepository.save(invitation);

        // Dynamically constructed from configured frontend URL
        String invitationLink = frontendBaseUrl + "/accept_invitation?token=" + invitationToken;

        String ownerName = (project.getOwner() != null) ? project.getOwner().getFullName() : "Project Owner";

        emailService.sendProjectInvitationEmail(
                email,
                ownerName,
                project.getName(),
                project.getDescription(),
                invitationLink
        );
    }

    @Override
    public Invitation acceptInvitation(String token, Long userId) throws Exception {
        Invitation invitation = invitationRepository.findByToken(token);
        if (invitation == null) {
            throw new Exception("Invalid invitation token");
        }
        return invitation;
    }

    @Override
    public String getTokenByUserMail(String userEmail) {
        Invitation invitation = invitationRepository.findByEmail(userEmail);
        return invitation != null ? invitation.getToken() : null;
    }

    @Override
    public void deleteToken(String token) {
        Invitation invitation = invitationRepository.findByToken(token);
        if (invitation != null) {
            invitationRepository.delete(invitation);
        }
    }
}