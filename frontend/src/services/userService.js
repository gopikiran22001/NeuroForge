import api from "./api";

export const getProfile = () => {
    return api.get("/users/profile");
};

export const getUsers = () => {
    return api.get("/users");
};

export const createUser = (data) => {
    return api.post("/users", data);
};

export const updateUser = (id, data) => {
    return api.put(`/users?id=${id}`, data);
};

export const deleteUser = (id) => {
    return api.delete(`/users?id=${id}`);
};