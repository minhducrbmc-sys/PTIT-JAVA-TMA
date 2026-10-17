import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
} from "./ActionTypes";

// Register
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: REGISTER_SUCCESS, jwt: data.jwt });
    }
    console.log("Register success:", data);
  } catch (error) {
    console.error("Register error:", error);
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const sendOtp = (email) => async () => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
    return { success: true, message: data };
  } catch (error) {
    const errorMsg = error.response?.data || "Failed to send OTP";
    return { success: false, message: errorMsg };
  }
};

// Login
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
      dispatch({ type: LOGIN_SUCCESS, jwt: data.jwt });
    }
    console.log("Login success:", data);
  } catch (error) {
    console.error("Login error:", error);
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get User Profile
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_USER_SUCCESS, payload: data });
    console.log("User profile:", data);
  } catch (error) {
    console.error("Get user error:", error);
    dispatch({
      type: GET_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  localStorage.clear();
  dispatch({ type: LOGOUT });
};