package com.example.controller;

import com.example.model.Issue;
import com.example.model.User;
import com.example.request.IssueRequest;
import com.example.service.email.EmailService;
import com.example.service.issue.IssueService;
import com.example.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // Resolves GET /api/issues/project/{projectId}
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssueByProjectId(@PathVariable Long projectId) throws Exception {
        List<Issue> issues = issueService.getIssueByProjectId(projectId);
        return ResponseEntity.ok(issues);
    }

    // GET /api/issues/{issueId}
    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long issueId) throws Exception {
        Issue issue = issueService.getIssueById(issueId);
        return ResponseEntity.ok(issue);
    }

    // POST /api/issues
    @PostMapping
    public ResponseEntity<Issue> createIssue(
            @RequestBody IssueRequest issueRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Issue createdIssue = issueService.createIssue(issueRequest, user);
        return ResponseEntity.ok(createdIssue);
    }

    // DELETE /api/issues/{issueId}
    @DeleteMapping("/{issueId}")
    public ResponseEntity<?> deleteIssue(
            @PathVariable Long issueId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        issueService.deleteIssue(issueId, user.getId());
        return ResponseEntity.ok(Collections.singletonMap("message", "Issue deleted successfully"));
    }

    // PUT /api/issues/{issueId}/assignee/{userId}
    @PutMapping("/{issueId}/assignee/{userId}")
    public ResponseEntity<Issue> addUserToIssue(
            @PathVariable Long issueId,
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User requester = userService.findUserProfileByJwt(jwt);
        Issue issue = issueService.addUserToIssue(issueId, userId, requester.getId());
        return ResponseEntity.ok(issue);
    }

    // PUT /api/issues/{issueId}/status/{status}
    @PutMapping("/{issueId}/status/{status}")
    public ResponseEntity<Issue> updateIssueStatus(
            @PathVariable Long issueId,
            @PathVariable String status,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User requester = userService.findUserProfileByJwt(jwt);
        Issue issue = issueService.updateStatus(issueId, status, requester.getId());
        return ResponseEntity.ok(issue);
    }

    // POST /api/issues/{issueId}/submit-file
    @PostMapping(value = "/{issueId}/submit-file", consumes = "multipart/form-data")
    public ResponseEntity<?> submitFileToCreator(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "message", required = false) String message,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User sender = userService.findUserProfileByJwt(jwt);
        Issue issue = issueService.getIssueById(issueId);

        User creator = issue.getCreator();
        if (creator == null || creator.getEmail() == null) {
            throw new Exception("The task issuer has no valid email address.");
        }

        emailService.sendIssueFileSubmission(
                creator.getEmail(),
                sender.getFullName(),
                issue.getTitle(),
                message,
                file
        );

        return ResponseEntity.ok(Collections.singletonMap("message", "File sent to issuer successfully."));
    }
}