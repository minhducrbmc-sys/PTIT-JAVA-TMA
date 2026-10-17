package com.example.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data //Của Lombok, sinh getter setter toString equals hashCode
@JsonPropertyOrder({ "id", "fullName", "email", "password", "projectSize" })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Sinh id tăng dần
    private Long id;

    //Tên email và password
    private String fullName;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


    @JsonIgnore
    @OneToMany(mappedBy = "assigned", cascade = CascadeType.ALL)
    //Quan hệ 1-nhiều (1 người dùng nhiều vấn đề)
    //cascadeType.all: Mọi thao tác thêm sửa xóa tác động tới Issue liên quan.
    private List<Issue> assignedIssues = new ArrayList<>();

    private int projectSize; //Số lượng project 1 người tạo

    private String verificationCode;
    private Boolean isVerified = false; // defaults to false
}