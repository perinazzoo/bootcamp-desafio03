import axios from "axios";

const api = axios.create({
  baseURL: "http://172.29.124.1:3333",
});

export default api;
