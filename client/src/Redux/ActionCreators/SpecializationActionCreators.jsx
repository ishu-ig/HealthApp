import { CREATE_SPECIALIZATION, DELETE_SPECIALIZATION, GET_SPECIALIZATION, UPDATE_SPECIALIZATION } from "../Constants";

export function createSpecialization(data) {
    return {
        type: CREATE_SPECIALIZATION,
        payload: data
    }
}

export function getSpecialization() {
    return {
        type: GET_SPECIALIZATION
    }
}

export function updateSpecialization(data) {
    return {
        type: UPDATE_SPECIALIZATION,
        payload: data
    }
}

export function deleteSpecialization(data) {
    return {
        type: DELETE_SPECIALIZATION,
        payload: data
    }
}