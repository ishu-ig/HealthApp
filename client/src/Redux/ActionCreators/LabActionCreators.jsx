import { CREATE_LAB, DELETE_LAB, GET_LAB, UPDATE_LAB } from "../Constants";

export function createLab(data) {
    return {
        type: CREATE_LAB,
        payload: data
    }
}

export function getLab() {
    return {
        type: GET_LAB
    }
}

export function updateLab(data) {
    return {
        type: UPDATE_LAB,
        payload: data
    }
}

export function deleteLab(data) {
    return {
        type: DELETE_LAB,
        payload: data
    }
}