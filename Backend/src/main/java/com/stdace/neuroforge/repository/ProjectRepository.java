package com.stdace.neuroforge.repository;

import com.stdace.neuroforge.enums.ProjectStatus;
import com.stdace.neuroforge.models.Project;
import com.stdace.neuroforge.models.Team;
import com.stdace.neuroforge.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    boolean existsByCodeIgnoreCase(String code);

    Optional<Project> findByCodeIgnoreCase(String code);

    List<Project> findByProjectManager(User projectManager);

    List<Project> findByProjectManagerAndStatus(User projectManager, ProjectStatus status);

    List<Project> findByTeamsContaining(Team team);

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String name, String code);
}
