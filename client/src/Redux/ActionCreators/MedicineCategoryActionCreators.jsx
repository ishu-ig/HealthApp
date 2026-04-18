import { CREATE_MEDICINECATEGORY, DELETE_MEDICINECATEGORY, GET_MEDICINECATEGORY, UPDATE_MEDICINECATEGORY } from "../Constants";

export function createMedicineCategory(data) {
    return {
        type: CREATE_MEDICINECATEGORY,
        payload: data
    }
}

export function getMedicineCategory() {
    return {
        type: GET_MEDICINECATEGORY
    }
}

export function updateMedicineCategory(data) {
    return {
        type: UPDATE_MEDICINECATEGORY,
        payload: data
    }
}

export function deleteMedicineCategory(data) {
    return {
        type: DELETE_MEDICINECATEGORY,
        payload: data
    }
}