import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // Ensure cookies are sent
});

export default api;
