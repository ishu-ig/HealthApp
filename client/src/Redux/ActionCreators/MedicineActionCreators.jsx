import { CREATE_MEDICINE, DELETE_MEDICINE, GET_MEDICINE, UPDATE_MEDICINE } from "../Constants";

export function createMedicine(data) {
    return {
        type: CREATE_MEDICINE,
        payload: data
    }
}

export function getMedicine() {
    return {
        type: GET_MEDICINE
    }
}

export function updateMedicine(data) {
    return {
        type: UPDATE_MEDICINE,
        payload: data
    }
}

export function deleteMedicine(data) {
    return {
        type: DELETE_MEDICINE,
        payload: data
    }
}