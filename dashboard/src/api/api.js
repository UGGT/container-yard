import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const fetchCheckins = async () => {
  const res = await API.get("/checkins");
  return res.data;
};

export default API;