import { CREATE_LABTESTCART, DELETE_LABTESTCART, GET_LABTESTCART, UPDATE_LABTESTCART } from "../Constants"

export function createLabtestCart(data) {
    return {
        type: CREATE_LABTESTCART,
        payload: data
    }
}

export function getLabtestCart() {
    return {
        type: GET_LABTESTCART
    }
}

export function updateLabtestCart(data) {
    return {
        type: UPDATE_LABTESTCART,
        payload: data
    }
}

export function deleteLabtestCart(data) {
    return {
        type: DELETE_LABTESTCART,
        payload: data
    }
}