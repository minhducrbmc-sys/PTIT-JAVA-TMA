package com.example.controller;


import com.example.model.Comment;
import com.example.model.User;
import com.example.request.CreateCommentRequest;
import com.example.response.MessageResponse;
import com.example.service.comment.CommentService;
import com.example.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Comment> createComment(
            @RequestBody CreateCommentRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Comment createdComment = commentService.createComment(
                req.getIssueId(),
                user.getId(),
                req.getContent()
        );
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // 1. Extract the user sending the DELETE request from their JWT
        User requestingUser = userService.findUserProfileByJwt(jwt);

        // 2. Pass the requesting user's ID
        commentService.deleteComment(commentId, requestingUser.getId());

        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully"));
    }

    @GetMapping("/{issueId}")
    public ResponseEntity<List<Comment>> getCommentsByIssueId(
            @PathVariable Long issueId
    ) {
        List<Comment> comments = commentService.findCommentByIssueId(issueId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}