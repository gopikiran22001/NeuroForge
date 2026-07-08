import api from "./api";

export const getMilestones = (params) => {
    return api.get("/milestones", { params });
};

export const getMilestoneById = (id) => {
    return api.get(`/milestones/${id}`);
};

export const createMilestone = (data) => {
    return api.post("/milestones", data);
};

export const updateMilestone = (id, data) => {
    return api.put(`/milestones/${id}`, data);
};

export const deleteMilestone = (id) => {
    return api.delete(`/milestones/${id}`);
};
