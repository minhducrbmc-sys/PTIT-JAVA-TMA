package com.example.controller;
import com.example.model.Chat;
import com.example.model.Message;
import com.example.model.User;
import com.example.request.CreateMessageRequest;
import com.example.service.message.MessageService;
import com.example.service.project.ProjectService;
import com.example.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody CreateMessageRequest request) throws Exception {
        User user = userService.findUserbyID(request.getSenderId());

        Chat chat = projectService.getProjectById(request.getProjectId()).getChat();
        if (chat == null) {
            throw new Exception("Can not find chat");
        }

        Message sentMessage = messageService.sendMessage(
                request.getSenderId(),
                request.getProjectId(),
                request.getContent()
        );

        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/chat/{projectId}")
    public ResponseEntity<List<Message>> getMessagesByChatId(@PathVariable Long projectId) throws Exception {
        List<Message> messages = messageService.getMessagesByProjectId(projectId);
        return ResponseEntity.ok(messages);
    }
}