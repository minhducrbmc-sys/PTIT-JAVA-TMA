package com.example.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class IssueRequest {
    private String title;
    private String description;
    private String status;
    private Long projectId;
    private String priority;
    private LocalDate dueDate; // Receives "YYYY-MM-DD" from the HTML5 date picker
}