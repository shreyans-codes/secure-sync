import axios from "axios";
import { IS_PROD } from "../variables/modifiers";

export const BASE_AUTH_URL = IS_PROD
  ? "/api/auth"
  : "http://localhost:8080/auth";
export const BASE_APPLICATION_URL = IS_PROD
  ? "/api/todo"
  : "http://localhost:8080/todo";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_AUTH_URL}/register`, {
      email: userData.email,
      password: userData.password,
      mfaEnabled: userData.mfaEnabled,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const loginToAccount = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_AUTH_URL}/login`,
      {
        email: userData.email,
        password: userData.password,
        application: "Just Do",
      },
      {
        params: {
          "g-recaptcha-response": userData.recaptchaValue,
        },
      }
    );
    const jwt_token = response.data["jwt"];
    let mfaEnabled = false;
    if (jwt_token === "") mfaEnabled = true;
    else {
      localStorage.setItem("token", jwt_token);
    }
    return [response.data, mfaEnabled];
  } catch (error) {
    throw new Error(error);
  }
};


export const fetchAccount = async () => {
  try {
    const response = await axios.get(`${BASE_APPLICATION_URL}/userDetails`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
};

export const verifyCode = async (userData) => {
  const response = await axios.post(`${BASE_AUTH_URL}/verify`, {
    email: userData.email,
    password: userData.password,
    code: userData.code,
  });
  const jwt_token = response.data.body["jwt"];
  localStorage.setItem("token", jwt_token);
  return response;
};
