package com.stdace.neuroforge.repository;

import com.stdace.neuroforge.enums.SprintStatus;
import com.stdace.neuroforge.models.Milestone;
import com.stdace.neuroforge.models.Project;
import com.stdace.neuroforge.models.Sprint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SprintRepository extends JpaRepository<Sprint, UUID> {

    boolean existsByProjectAndStatus(Project project, SprintStatus status);

    Optional<Sprint> findByProjectAndStatus(Project project, SprintStatus status);

    List<Sprint> findByProject(Project project);

    List<Sprint> findByStatus(SprintStatus status);

    List<Sprint> findByNameContainingIgnoreCase(String name);

    Page<Sprint> findByProjectId(UUID projectId, Pageable pageable);

}
