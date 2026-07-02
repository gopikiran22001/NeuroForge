package com.stdace.neuroforge.service.milestone;

import com.stdace.neuroforge.enums.MilestoneStatus;
import com.stdace.neuroforge.common.PageResponse;
import com.stdace.neuroforge.dto.milestone.MilestoneRequest;
import com.stdace.neuroforge.dto.milestone.MilestoneResponse;

import java.util.UUID;

public interface MilestoneService {

    MilestoneResponse create(MilestoneRequest request);

    MilestoneResponse getById(UUID id);

    PageResponse<MilestoneResponse> search(String search, MilestoneStatus status, int page, int size);

    PageResponse<MilestoneResponse> search(String search, UUID projectId, MilestoneStatus status, int page, int size);

    MilestoneResponse update(UUID id, MilestoneRequest request);

    void delete(UUID id);

    boolean isTeamLeadForMilestoneProject(UUID id, UUID currentUserId);
}
