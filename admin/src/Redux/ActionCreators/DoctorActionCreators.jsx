import { CREATE_DOCTOR, DELETE_DOCTOR, GET_DOCTOR, UPDATE_DOCTOR } from "../Constants";

export function createDoctor(data) {
    return {
        type: CREATE_DOCTOR,
        payload: data
    }
}

export function getDoctor() {
    return {
        type: GET_DOCTOR
    }
}

export function updateDoctor(data) {
    return {
        type: UPDATE_DOCTOR,
        payload: data
    }
}

export function deleteDoctor(data) {
    return {
        type: DELETE_DOCTOR,
        payload: data
    }
}