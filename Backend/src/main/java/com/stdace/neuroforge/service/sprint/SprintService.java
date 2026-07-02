package com.stdace.neuroforge.service.sprint;

import com.stdace.neuroforge.enums.SprintStatus;
import com.stdace.neuroforge.common.PageResponse;
import com.stdace.neuroforge.dto.sprint.SprintRequest;
import com.stdace.neuroforge.dto.sprint.SprintResponse;

import java.util.UUID;

public interface SprintService {

    SprintResponse create(SprintRequest request);

    SprintResponse getById(UUID id);

    PageResponse<SprintResponse> search(String search, SprintStatus status, int page, int size);

    PageResponse<SprintResponse> search(String search, UUID projectId, SprintStatus status, int page, int size);

    SprintResponse update(UUID id, SprintRequest request);

    void delete(UUID id);
}
