import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api", // Your Express backend
});

export const fetchCheckins = async () => {
  const res = await API.get("/checkins");
  return res.data;
};

export default API;