import { CREATE_LABTEST, DELETE_LABTEST, GET_LABTEST, UPDATE_LABTEST } from "../Constants";

export function createLabtest(data) {
    return {
        type: CREATE_LABTEST,
        payload: data
    }
}

export function getLabtest() {
    return {
        type: GET_LABTEST
    }
}

export function updateLabtest(data) {
    return {
        type: UPDATE_LABTEST,
        payload: data
    }
}

export function deleteLabtest(data) {
    return {
        type: DELETE_LABTEST,
        payload: data
    }
}