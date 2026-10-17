package com.example.repository;

import com.example.model.Project;
import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p " +
            "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND (:user MEMBER OF p.team OR p.owner = :user)")
    List<Project> findByNameAndUserMembership(
            @Param("keyword") String keyword,
            @Param("user") User user
    );

    List<Project> findByTeamContainingOrOwner(User user, User owner);
}