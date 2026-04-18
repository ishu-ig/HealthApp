import { CREATE_LABTESTCATEGORY, DELETE_LABTESTCATEGORY, GET_LABTESTCATEGORY, UPDATE_LABTESTCATEGORY } from "../Constants";

export function createLabtestCategory(data) {
    return {
        type: CREATE_LABTESTCATEGORY,
        payload: data
    }
}

export function getLabtestCategory() {
    return {
        type: GET_LABTESTCATEGORY
    }
}

export function updateLabtestCategory(data) {
    return {
        type: UPDATE_LABTESTCATEGORY,
        payload: data
    }
}

export function deleteLabtestCategory(data) {
    return {
        type: DELETE_LABTESTCATEGORY,
        payload: data
    }
}