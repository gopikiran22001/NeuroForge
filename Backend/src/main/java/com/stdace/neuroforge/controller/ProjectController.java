package com.stdace.neuroforge.controller;

import com.stdace.neuroforge.common.ApiResponse;
import com.stdace.neuroforge.common.PageResponse;
import com.stdace.neuroforge.dto.project.ProjectRequest;
import com.stdace.neuroforge.dto.project.ProjectResponse;
import com.stdace.neuroforge.service.project.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectResponse>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", projectService.create(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Project retrieved successfully", projectService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProjectResponse>>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projectService.search(search, null, page, size)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<ProjectResponse>> update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", projectService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        projectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}

