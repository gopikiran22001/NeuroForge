package com.stdace.neuroforge.repository;

import com.stdace.neuroforge.enums.UserRole;
import com.stdace.neuroforge.enums.UserStatus;
import com.stdace.neuroforge.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    List<User> findByStatus(UserStatus status);

    List<User> findByRole(UserRole role);

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String firstName,
            String lastName,
            String email
    );
}

