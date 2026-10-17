import api from "@/config/api";
import {
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  FETCH_COMMENTS_FAILURE,
  FETCH_COMMENTS_REQUEST,
  FETCH_COMMENTS_SUCCESS,
} from "./ActionTypes";

// Create a new comment on an issue
export const createComment = (commentData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const { data } = await api.post("/api/comments", commentData);
    console.log("Created comment: ", data);
    dispatch({ type: CREATE_COMMENT_SUCCESS, comment: data });
  } catch (error) {
    console.error("Error creating comment: ", error);
    dispatch({ type: CREATE_COMMENT_FAILURE, error: error.message });
  }
};

// Delete a comment by ID
export const deleteComment = (commentId) => async (dispatch) => {
  dispatch({ type: DELETE_COMMENT_REQUEST });
  try {
    await api.delete(`/api/comments/${commentId}`);
    console.log("Deleted comment ID: ", commentId);
    dispatch({ type: DELETE_COMMENT_SUCCESS, commentId });
  } catch (error) {
    console.error("Error deleting comment: ", error);
    dispatch({ type: DELETE_COMMENT_FAILURE, error: error.message });
  }
};

// Fetch all comments for a specific issue
export const fetchComments = (issueId) => async (dispatch) => {
  dispatch({ type: FETCH_COMMENTS_REQUEST });
  try {
    const { data } = await api.get(`/api/comments/${issueId}`);
    console.log("Fetched comments: ", data);
    dispatch({ type: FETCH_COMMENTS_SUCCESS, comments: data });
  } catch (error) {
    console.error("Error fetching comments: ", error);
    dispatch({ type: FETCH_COMMENTS_FAILURE, error: error.message });
  }
};