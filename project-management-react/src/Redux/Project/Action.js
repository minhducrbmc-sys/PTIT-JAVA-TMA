import api from "@/config/api";
import {
  ACCEPT_INVITATION_FAILURE,
  ACCEPT_INVITATION_REQUEST,
  ACCEPT_INVITATION_SUCCESS,
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_REQUEST,
  CREATE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAILURE,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_SUCCESS,
  FETCH_PROJECT_BY_ID_FAILURE,
  FETCH_PROJECT_BY_ID_REQUEST,
  FETCH_PROJECT_BY_ID_SUCCESS,
  FETCH_PROJECT_FAILURE,
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECT_SUCCESS,
  INVITE_PROJECT_FAILURE,
  INVITE_PROJECT_REQUEST,
  INVITE_PROJECT_SUCCESS,
  SEARCH_PROJECT_FAILURE,
  SEARCH_PROJECT_REQUEST,
  SEARCH_PROJECT_SUCCESS,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
  UPDATE_PROJECT_FAILURE,
  REMOVE_USER_FROM_PROJECT_REQUEST,
  REMOVE_USER_FROM_PROJECT_SUCCESS,
  REMOVE_USER_FROM_PROJECT_FAILURE,
} from "./ActionTypes";

// Fetch all projects (filtered by category / tag)
export const fetchProject = ({ category, tag } = {}) => async (dispatch) => {
  dispatch({ type: FETCH_PROJECT_REQUEST });
  try {
    const { data } = await api.get("/api/project", {
      params: { category, tag },
    });
    console.log("All projects: ", data);
    dispatch({ type: FETCH_PROJECT_SUCCESS, projects: data });
  } catch (error) {
    console.error("Error fetching projects: ", error);
    dispatch({ type: FETCH_PROJECT_FAILURE, error: error.message });
  }
};

// Fetch a single project by ID
export const fetchProjectById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_PROJECT_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/project/${id}`);
    console.log("Project: ", data);
    dispatch({ type: FETCH_PROJECT_BY_ID_SUCCESS, project: data });
  } catch (error) {
    console.error("Error fetching project by ID: ", error);
    dispatch({ type: FETCH_PROJECT_BY_ID_FAILURE, error: error.message });
  }
};

// Search projects by keyword
export const searchProject = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_PROJECT_REQUEST });
  try {
    const { data } = await api.get(`/api/project/search?keyword=${encodeURIComponent(keyword)}`);
    console.log("Search projects: ", data);
    dispatch({ type: SEARCH_PROJECT_SUCCESS, searchResults: data });
  } catch (error) {
    console.error("Error searching projects: ", error);
    dispatch({ type: SEARCH_PROJECT_FAILURE, error: error.message });
  }
};

// Create a new project
export const createProject = (projectData) => async (dispatch) => {
  dispatch({ type: CREATE_PROJECT_REQUEST });
  try {
    const { data } = await api.post("/api/project", projectData);
    console.log("Created project: ", data);
    dispatch({ type: CREATE_PROJECT_SUCCESS, project: data });
  } catch (error) {
    console.error("Error creating project: ", error);
    dispatch({ type: CREATE_PROJECT_FAILURE, error: error.message });
  }
};

// Delete a project
export const deleteProject = ({ projectId }) => async (dispatch) => {
  dispatch({ type: DELETE_PROJECT_REQUEST });
  try {
    await api.delete(`/api/project/${projectId}`);
    console.log("Deleted project ID: ", projectId);
    dispatch({ type: DELETE_PROJECT_SUCCESS, projectId });
  } catch (error) {
    console.error("Error deleting project: ", error);
    dispatch({ type: DELETE_PROJECT_FAILURE, error: error.message });
  }
};
//remove user from project
export const removeUserFromProject = ({ projectId, userId }) => async (dispatch) => {
  dispatch({ type: REMOVE_USER_FROM_PROJECT_REQUEST });
  try {
    const { data } = await api.delete(`/api/project/${projectId}/user/${userId}`);
    console.log("remove user:", data);
    dispatch({
      type: REMOVE_USER_FROM_PROJECT_SUCCESS,
      userId,
    });
  } catch (error) {
    console.error("remove user error:", error);
    dispatch({
      type: REMOVE_USER_FROM_PROJECT_FAILURE,
      error: error.message,
    });
  }
};

// Invite user to project
export const inviteToProject = ({ email, projectId }) => async (dispatch) => {
  dispatch({ type: INVITE_PROJECT_REQUEST });
  try {
    const { data } = await api.post("/api/project/invite", { email, projectId });
    console.log("Invite response: ", data);
    dispatch({ type: INVITE_PROJECT_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error sending invite: ", error);
    dispatch({ type: INVITE_PROJECT_FAILURE, error: error.message });
  }
};

export const acceptInvitation = ({ token, invitationToken, navigate }) => async (dispatch) => {
  dispatch({ type: ACCEPT_INVITATION_REQUEST });
  
  const tokenValue = token || invitationToken;

  try {
    const { data } = await api.get("/api/project/accept_invitation", {
      params: { token: tokenValue },
    });

    console.log("Accepted invitation: ", data);
    dispatch({ type: ACCEPT_INVITATION_SUCCESS, payload: data });

    // Navigate to the project page
    navigate(`/project/${data.projectId || data.id}`);
  } catch (error) {
    console.error("Error accepting invitation: ", error);
    dispatch({ type: ACCEPT_INVITATION_FAILURE, error: error.message });
  }
};
export const updateProject = ({ projectId, projectData }) => async (dispatch) => {
  dispatch({ type: UPDATE_PROJECT_REQUEST });
  try {
    const { data } = await api.patch(`/api/project/${projectId}`, projectData);
    console.log("Updated Project: ", data);
    dispatch({ type: UPDATE_PROJECT_SUCCESS, project: data });
  } catch (error) {
    console.error("Error updating project: ", error);
    dispatch({ type: UPDATE_PROJECT_FAILURE, error: error.message });
  }
};