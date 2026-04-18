import { CREATE_MANUFACTURER, DELETE_MANUFACTURER, GET_MANUFACTURER, UPDATE_MANUFACTURER } from "../Constants";

export function createManufacturer(data) {
    return {
        type: CREATE_MANUFACTURER,
        payload: data
    }
}

export function getManufacturer() {
    return {
        type: GET_MANUFACTURER
    }
}

export function updateManufacturer(data) {
    return {
        type: UPDATE_MANUFACTURER,
        payload: data
    }
}

export function deleteManufacturer(data) {
    return {
        type: DELETE_MANUFACTURER,
        payload: data
    }
}