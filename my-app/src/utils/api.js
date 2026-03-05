import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// Problems
export const getProblems = () => API.get("/problems");
export const getProblem = (id) => API.get(`/problems/${id}`);
export const createProblem = (data) => API.post("/problems", data);
export const updateProblem = (id, data) => API.put(`/problems/${id}`, data);
export const deleteProblem = (id) => API.delete(`/problems/${id}`);

// Submissions
export const submitCode = (data) => API.post("/submissions", data);
export const getSubmissionById = (id) => API.get(`/submissions/${id}`);
export const updateSubmission = (id, data) => API.put(`/submissions/${id}`, data);
export const getAllSubmissions = () => API.get("/submissions");
