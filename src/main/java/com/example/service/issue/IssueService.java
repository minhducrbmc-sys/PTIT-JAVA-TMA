package com.example.service.issue;
import com.example.model.Issue;
import com.example.model.User;
import com.example.request.IssueRequest;

import java.util.List;
import java.util.Optional;

public interface IssueService {

    Issue getIssueById(Long issueId) throws Exception;

    List<Issue> getIssueByProjectId(Long projectId) throws Exception;

    Issue createIssue(IssueRequest issueRequest, User user) throws Exception;

    void deleteIssue(Long issueId, Long userId) throws Exception;

    Issue addUserToIssue(Long issueId, Long userId, Long requestingUserId) throws Exception;

    Issue updateStatus(Long issueId, String status, Long requestingUserId) throws Exception;
}