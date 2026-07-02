package com.stdace.neuroforge.repository;

import com.stdace.neuroforge.enums.MilestoneStatus;
import com.stdace.neuroforge.models.Milestone;
import com.stdace.neuroforge.models.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    List<Milestone> findByProject(Project project);

    Page<Milestone> findByProjectId(UUID projectId, Pageable pageable);

    List<Milestone> findByProjectAndStatus(Project project, MilestoneStatus status);

    boolean existsByProjectAndStatus(Project project, MilestoneStatus status);

    List<Milestone> findByStatus(MilestoneStatus status);

    List<Milestone> findByNameContainingIgnoreCase(String name);

    @Query("""
        SELECT COUNT(t) > 0
        FROM Milestone m
        JOIN m.project p
        JOIN p.teams t
        WHERE m.id = :milestoneId
          AND t.teamLeader.id = :userId
    """)
    boolean isTeamLeadForMilestoneProject(
            @Param("milestoneId") UUID milestoneId,
            @Param("userId") UUID userId
    );
}
