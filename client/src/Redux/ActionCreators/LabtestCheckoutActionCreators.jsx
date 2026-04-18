import { CREATE_LABTESTCHECKOUT, DELETE_LABTESTCHECKOUT, GET_LABTESTCHECKOUT, UPDATE_LABTESTCHECKOUT } from "../Constants";

export function createLabtestCheckout(data) {
    return {
        type: CREATE_LABTESTCHECKOUT,
        payload: data
    }
}

export function getLabtestCheckout() {
    return {
        type: GET_LABTESTCHECKOUT
    }
}

export function updateLabtestCheckout(data) {
    return {
        type: UPDATE_LABTESTCHECKOUT,
        payload: data
    }
}

export function deleteLabtestCheckout(data) {
    return {
        type: DELETE_LABTESTCHECKOUT,
        payload: data
    }
}