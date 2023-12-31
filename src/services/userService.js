import http from "./httpService";
// import { apiUrl } from "../config.json";

// const apiEndpoint = apiUrl + "/users";
const apiEndpoint = "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}

export function getUser() {
  return http.get(`${apiEndpoint}/me`);
}
