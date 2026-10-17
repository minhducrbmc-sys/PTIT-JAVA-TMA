import api from "@/config/api";
import {
  FETCH_CHAT_BY_PROJECT_FAILURE,
  FETCH_CHAT_BY_PROJECT_REQUEST,
  FETCH_CHAT_BY_PROJECT_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILURE,
  FETCH_CHAT_MESSAGES_REQUEST,
  FETCH_CHAT_MESSAGES_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
} from "./ActionTypes";

// Send a message
export const sendMessage = (messageData) => async (dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try {
    const response = await api.post("/api/messages/send", messageData);
    console.log("Sent message:", response.data);
    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      message: response.data,
      payload: response.data,
    });
  } catch (error) {
    console.log("Error sending message:", error);
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      error: error.message,
    });
  }
};

// Fetch chat by Project ID (Uses /api/project/{projectId}/chat)
export const fetchChatByProject = (projectId) => async (dispatch) => {
  dispatch({ type: FETCH_CHAT_BY_PROJECT_REQUEST });
  try {
    const { data } = await api.get(`/api/project/${projectId}/chat`);
    console.log("Fetched chat: ", data);
    dispatch({ type: FETCH_CHAT_BY_PROJECT_SUCCESS, chat: data });
  } catch (error) {
    console.error("Error fetching chat by project: ", error);
    dispatch({ type: FETCH_CHAT_BY_PROJECT_FAILURE, error: error.message });
  }
};

// Fetch all messages in a specific chat
export const fetchChatMessages = (chatId) => async (dispatch) => {
  dispatch({ type: FETCH_CHAT_MESSAGES_REQUEST });
  try {
    const { data } = await api.get(`/api/messages/chat/${chatId}`);
    console.log("Fetched messages: ", data);
    dispatch({ type: FETCH_CHAT_MESSAGES_SUCCESS, chatId, messages: data });
  } catch (error) {
    console.error("Error fetching messages: ", error);
    dispatch({ type: FETCH_CHAT_MESSAGES_FAILURE, error: error.message });
  }
};