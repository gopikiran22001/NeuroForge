package com.stdace.neuroforge.service.milestone;

import com.stdace.neuroforge.enums.MilestoneStatus;
import com.stdace.neuroforge.models.Milestone;
import com.stdace.neuroforge.models.Project;
import com.stdace.neuroforge.common.PageResponse;
import com.stdace.neuroforge.dto.milestone.MilestoneRequest;
import com.stdace.neuroforge.dto.milestone.MilestoneResponse;
import com.stdace.neuroforge.exception.ResourceNotFoundException;
import com.stdace.neuroforge.mapper.MilestoneMapper;
import com.stdace.neuroforge.repository.MilestoneRepository;
import com.stdace.neuroforge.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MilestoneServiceImpl implements MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneMapper milestoneMapper;

    @Override
    public MilestoneResponse create(MilestoneRequest request) {
        Project project = getProject(request.getProjectId());
        Milestone milestone = milestoneMapper.toEntity(request, project);
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    @Override
    @Transactional(readOnly = true)
    public MilestoneResponse getById(UUID id) {
        return milestoneRepository.findById(id).map(milestoneMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MilestoneResponse> search(String search, MilestoneStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MilestoneResponse> mapped = milestoneRepository.findAll(pageable).map(milestoneMapper::toResponse);
        return PageResponse.from(mapped);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MilestoneResponse> search(String search, UUID projectId, MilestoneStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MilestoneResponse> mapped = milestoneRepository.findByProjectId(projectId,pageable).map(milestoneMapper::toResponse);
        return PageResponse.from(mapped);
    }

    @Override
    public MilestoneResponse update(UUID id, MilestoneRequest request) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + id));
        Project project = getProject(request.getProjectId());
        milestoneMapper.updateEntity(milestone, request, project);
        return milestoneMapper.toResponse(milestoneRepository.save(milestone));
    }

    @Override
    public void delete(UUID id) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + id));
        milestone.setStatus(MilestoneStatus.CANCELLED);
        milestoneRepository.save(milestone);
    }

    private Project getProject(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
    }

    public boolean isTeamLeadForMilestoneProject(UUID milestoneId,UUID userId) {
        return milestoneRepository.isTeamLeadForMilestoneProject(milestoneId, userId);
    }

}
