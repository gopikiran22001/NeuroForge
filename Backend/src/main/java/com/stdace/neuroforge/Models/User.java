package com.stdace.neuroforge.Models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.stdace.neuroforge.Enums.UserRole;
import com.stdace.neuroforge.Enums.UserStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseModel {

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 8)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Override
    protected void onCreate() {
        status = UserStatus.ACTIVE;
    }

    //    @Builder.Default
//    @Column(nullable = false)
//    private boolean emailVerified = false;
//
//    private Instant lastLogin;
}