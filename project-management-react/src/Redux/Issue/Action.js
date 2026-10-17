import api from "@/config/api";
import {
  FETCH_ISSUES_REQUEST,
  FETCH_ISSUES_SUCCESS,
  FETCH_ISSUES_FAILURE,
  FETCH_ISSUE_BY_ID_REQUEST,
  FETCH_ISSUE_BY_ID_SUCCESS,
  FETCH_ISSUE_BY_ID_FAILURE,
  CREATE_ISSUE_REQUEST,
  CREATE_ISSUE_SUCCESS,
  CREATE_ISSUE_FAILURE,
  UPDATE_ISSUE_STATUS_REQUEST,
  UPDATE_ISSUE_STATUS_SUCCESS,
  UPDATE_ISSUE_STATUS_FAILURE,
  DELETE_ISSUE_REQUEST,
  DELETE_ISSUE_SUCCESS,
  DELETE_ISSUE_FAILURE,
  ASSIGNED_ISSUE_TO_USER_REQUEST,
  ASSIGNED_ISSUE_TO_USER_SUCCESS,
  ASSIGNED_ISSUE_TO_USER_FAILURE,
} from "./ActionTypes";

// Fetch issues by project ID
export const fetchIssues = (id) => async (dispatch) => {
  dispatch({ type: FETCH_ISSUES_REQUEST });
  try {
    const { data } = await api.get(`/api/issues/project/${id}`);
    dispatch({ type: FETCH_ISSUES_SUCCESS, issues: data });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_ISSUES_FAILURE,
      error: error.message,
    });
  }
};

// Fetch single issue by ID
export const fetchIssueById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_ISSUE_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/issues/${id}`);
    dispatch({ type: FETCH_ISSUE_BY_ID_SUCCESS, issue: data });
    return data;
  } catch (error) {
    dispatch({
      type: FETCH_ISSUE_BY_ID_FAILURE,
      error: error.message,
    });
  }
};

// Create a new issue
export const createIssue = (issueData) => async (dispatch) => {
  dispatch({ type: CREATE_ISSUE_REQUEST });
  try {
    const { data } = await api.post("/api/issues", issueData);
    dispatch({ type: CREATE_ISSUE_SUCCESS, issue: data });
    return data;
  } catch (error) {
    dispatch({
      type: CREATE_ISSUE_FAILURE,
      error: error.message,
    });
  }
};

// Update issue status
export const updateIssueStatus = ({ id, status }) => async (dispatch) => {
  dispatch({ type: UPDATE_ISSUE_STATUS_REQUEST });
  try {
    const { data } = await api.put(`/api/issues/${id}/status/${status}`);
    dispatch({
      type: UPDATE_ISSUE_STATUS_SUCCESS,
      issue: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_ISSUE_STATUS_FAILURE,
      error: error.message,
    });
    throw error;
  }
};

// Delete issue
export const deleteIssue = (issueId) => async (dispatch) => {
  dispatch({ type: DELETE_ISSUE_REQUEST });
  try {
    await api.delete(`/api/issues/${issueId}`);
    dispatch({ type: DELETE_ISSUE_SUCCESS, issueId });
  } catch (error) {
    dispatch({
      type: DELETE_ISSUE_FAILURE,
      error: error.message,
    });
  }
};

// Assign user to issue
export const assignedUserToIssue = ({ issueId, userId }) => async (dispatch) => {
  dispatch({ type: ASSIGNED_ISSUE_TO_USER_REQUEST });
  try {
    const { data } = await api.put(`/api/issues/${issueId}/assignee/${userId}`);
    dispatch({
      type: ASSIGNED_ISSUE_TO_USER_SUCCESS,
      issue: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: ASSIGNED_ISSUE_TO_USER_FAILURE,
      error: error.message,
    });
  }
};