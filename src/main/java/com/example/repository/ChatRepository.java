package com.example.repository;

import com.example.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat,Long> {
}
