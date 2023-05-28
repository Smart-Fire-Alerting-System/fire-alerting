// import dayjs from "dayjs";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
//   if (localStorage.getItem("user")) {
//     req.headers.Authorization = `Bearer ${
//       JSON.parse(localStorage.getItem("user")).token
//     }`;
// //   }
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDVmNmMwYjBlYTcyNmQ5ZDMyZDQ1OGQiLCJpYXQiOjE2ODM5Nzc4NDcsImV4cCI6MTY4NjU2OTg0N30.T0Ou5IBN5Tg22uUzMA32b678tl1cfOwYo-6qvWrYNJQ"
//   req.headers.Authorization = `Bearer ${token}`;
  req.headers["Content-Type"] = "application/json";
  return req;
});

export const loginUser = (dataForm) => API.post("/api/user/login", dataForm);

export const getTemperature = () => API.get("/api/data/currentTemperature");

export const getHumidity = () => API.get("/api/data/currentHumid");

export const setFan = (value) => API.post("/api/data/setFan", value);

export const setLight = (value) => API.post("/api/data/toggleLed", value);

export const getFan = () => API.get("/api/data/lastFan");

export const getLed = () => API.get("/api/data/lastLed");

export const getWarnings = () => API.get("/api/data/todayWarnings");

export const getLast7DaysTemperatures = () => API.get("/api/data/weektemperatures");
export const getLast7DaysHumidity = () => API.get("/api/data/weekhumids");

