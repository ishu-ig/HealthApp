import { CREATE_HOSPITAL, DELETE_HOSPITAL, GET_HOSPITAL, UPDATE_HOSPITAL } from "../Constants";

export function createHospital(data) {
    return {
        type: CREATE_HOSPITAL,
        payload: data
    }
}

export function getHospital(data) {
    return {
        type: GET_HOSPITAL
    }
}

export function updateHospital(data) {
    return {
        type: UPDATE_HOSPITAL,
        payload: data
    }
}

export function deleteHospital(data) {
    return {
        type: DELETE_HOSPITAL,
        payload: data
    }
}