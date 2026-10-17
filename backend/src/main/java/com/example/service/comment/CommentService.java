package com.example.service.comment;

import com.example.model.Comment;
import jdk.jshell.spi.ExecutionControl;

import java.util.List;

public interface CommentService {
    Comment createComment(Long issueId, long userId, String comment) throws Exception;

    void deleteComment(Long commentId,Long userId) throws Exception;

    List<Comment> findCommentByIssueId(Long issueId);
}
