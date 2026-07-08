import api from "./api";

export const getTeams = (params) => {
    return api.get("/teams", { params });
};

export const getTeamById = (id) => {
    return api.get(`/teams/${id}`);
};

export const createTeam = (data) => {
    return api.post("/teams", data);
};

export const updateTeam = (id, data) => {
    return api.put(`/teams/${id}`, data);
};

export const deleteTeam = (id) => {
    return api.delete(`/teams/${id}`);
};
