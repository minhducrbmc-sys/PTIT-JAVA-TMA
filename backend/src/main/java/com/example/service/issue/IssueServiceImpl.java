package com.example.service.issue;

import com.example.model.Issue;
import com.example.model.Project;
import com.example.model.User;
import com.example.repository.IssueRepository;
import com.example.request.IssueRequest;
import com.example.service.project.ProjectService;
import com.example.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Override
    public Issue getIssueById(Long issueId) throws Exception {
        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isPresent()) return issue.get();
        throw new Exception("No issues found with issueId " + issueId);
    }

    @Override
    public List<Issue> getIssueByProjectId(Long projectId) throws Exception {
        return issueRepository.findByProjectId(projectId);
    }

    @Override
    public Issue createIssue(IssueRequest issueRequest, User user) throws Exception {
        Project project = projectService.getProjectById(issueRequest.getProjectId());
        Issue issue = new Issue();
        issue.setTitle(issueRequest.getTitle());
        issue.setDescription(issueRequest.getDescription());
        issue.setStatus(issueRequest.getStatus() != null ? issueRequest.getStatus() : "pending");
        issue.setProjectID(issueRequest.getProjectId());
        issue.setPriority(issueRequest.getPriority() != null ? issueRequest.getPriority() : "Medium");
        issue.setDueDate(issueRequest.getDueDate());

        // 1. Author/Issuer is the creator
        issue.setCreator(user);

        // 2. Clear out both assignee fields so the new task starts UNASSIGNED
        issue.setAssignee(null);
        issue.setAssigned(null);

        issue.setProject(project);

        return issueRepository.save(issue);
    }

    @Override
    public void deleteIssue(Long issueId, Long userId) throws Exception {
        Issue issue = getIssueById(issueId);

        Project project = issue.getProject();
        if (project == null && issue.getProjectID() != null) {
            project = projectService.getProjectById(issue.getProjectID());
        }

        boolean isProjectOwner = project != null
                && project.getOwner() != null
                && project.getOwner().getId().equals(userId);

        boolean isAssignee = issue.getAssignee() != null
                && issue.getAssignee().getId().equals(userId);

        boolean isAssigned = issue.getAssigned() != null
                && issue.getAssigned().getId().equals(userId);

        boolean isCreator = issue.getCreator() != null
                && issue.getCreator().getId().equals(userId);

        if (!isProjectOwner && !isAssignee && !isAssigned && !isCreator) {
            throw new Exception("Unauthorized: You do not have permission to delete this issue.");
        }

        issueRepository.delete(issue);
    }

    @Override
    public Issue addUserToIssue(Long issueId, Long userId, Long requestingUserId) throws Exception {
        Issue issue = getIssueById(issueId);
        User userToAssign = userService.findUserbyID(userId);
        User requester = userService.findUserbyID(requestingUserId);

        Project project = issue.getProject();
        if (project == null && issue.getProjectID() != null) {
            project = projectService.getProjectById(issue.getProjectID());
        }

        // Authorization check: Project owner or task creator
        boolean isProjectOwner = project != null
                && project.getOwner() != null
                && project.getOwner().getId().equals(requester.getId());

        boolean isTaskCreator = issue.getCreator() != null
                && issue.getCreator().getId().equals(requester.getId());

        if (!isProjectOwner && !isTaskCreator) {
            throw new Exception("Unauthorized: Only the project owner or task creator can assign this task.");
        }

        // Validate user belongs to the project team
        if (project != null) {
            boolean isOwner = project.getOwner() != null && project.getOwner().getId().equals(userToAssign.getId());
            boolean isTeamMember = project.getTeam() != null && project.getTeam().stream()
                    .anyMatch(member -> member.getId().equals(userToAssign.getId()));

            if (!isOwner && !isTeamMember) {
                throw new Exception("Cannot assign task to a user who is not a member of the project team.");
            }
        }

        // Set BOTH fields so every reference in the frontend stays in sync
        issue.setAssignee(userToAssign);
        issue.setAssigned(userToAssign);

        return issueRepository.save(issue);
    }

    @Override
    public Issue updateStatus(Long issueId, String status, Long requestingUserId) throws Exception {
        Issue issue = getIssueById(issueId);
        User requester = userService.findUserbyID(requestingUserId);

        Project project = issue.getProject();
        if (project == null && issue.getProjectID() != null) {
            project = projectService.getProjectById(issue.getProjectID());
        }

        // 1. Is the requester the project owner?
        boolean isProjectOwner = project != null
                && project.getOwner() != null
                && project.getOwner().getId().equals(requester.getId());

        // 2. Is the requester the one who created/issued the task?
        boolean isTaskIssuer = issue.getCreator() != null
                && issue.getCreator().getId().equals(requester.getId());

        if (!isProjectOwner && !isTaskIssuer) {
            throw new Exception("Unauthorized: Only the project owner or task issuer can change the task status.");
        }

        issue.setStatus(status);
        return issueRepository.save(issue);
    }
}