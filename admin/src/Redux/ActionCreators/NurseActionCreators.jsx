import { CREATE_NURSE, DELETE_NURSE, GET_NURSE, UPDATE_NURSE } from "../Constants";

export function createNurse(data) {
    return {
        type: CREATE_NURSE,
        payload: data
    }
}

export function getNurse(data) {
    return {
        type: GET_NURSE
    }
}

export function updateNurse(data) {
    return {
        type: UPDATE_NURSE,
        payload: data
    }
}

export function deleteNurse(data) {
    return {
        type: DELETE_NURSE,
        payload: data
    }
}