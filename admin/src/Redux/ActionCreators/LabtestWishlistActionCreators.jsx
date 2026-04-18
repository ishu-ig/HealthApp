import {
  CREATE_LABTESTWISHLIST,
  GET_LABTESTWISHLIST,
  UPDATE_LABTESTWISHLIST,
  DELETE_LABTESTWISHLIST
} from "../Constants";

// ➕ Create
export function createLabtestWishlist(data) {
  return {
    type: CREATE_LABTESTWISHLIST,
    payload: data
  };
}

// 📥 Get
export function getLabtestWishlist() {
  return {
    type: GET_LABTESTWISHLIST
  };
}

// ✏️ Update
export function updateLabtestWishlist(data) {
  return {
    type: UPDATE_LABTESTWISHLIST,
    payload: data
  };
}

// ❌ Delete
export function deleteLabtestWishlist(data) {
  return {
    type: DELETE_LABTESTWISHLIST,
    payload: data
  };
}