import api from "./api";

export const getSprints = (params) => {
    return api.get("/sprints", { params });
};

export const getSprintById = (id) => {
    return api.get(`/sprints/${id}`);
};

export const createSprint = (data) => {
    return api.post("/sprints", data);
};

export const updateSprint = (id, data) => {
    return api.put(`/sprints/${id}`, data);
};

export const deleteSprint = (id) => {
    return api.delete(`/sprints/${id}`);
};
