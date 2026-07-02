package com.stdace.neuroforge.repository;

import com.stdace.neuroforge.enums.TeamStatus;
import com.stdace.neuroforge.models.Team;
import com.stdace.neuroforge.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Team> findByTeamLeaderAndStatus(User teamLeader, TeamStatus status);

    List<Team> findByMembersContainingAndStatus(User member, TeamStatus status);

    List<Team> findByStatus(TeamStatus status);

    List<Team> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

}
