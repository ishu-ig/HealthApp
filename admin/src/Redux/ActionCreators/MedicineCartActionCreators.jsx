import { CREATE_MEDICINECART, DELETE_MEDICINECART, GET_MEDICINECART, UPDATE_MEDICINECART } from "../Constants"

export function createMedicineCart(data) {
    return {
        type: CREATE_MEDICINECART,
        payload: data
    }
}

export function getMedicineCart() {
    return {
        type: GET_MEDICINECART
    }
}

export function updateMedicineCart(data) {
    return {
        type: UPDATE_MEDICINECART,
        payload: data
    }
}

export function deleteMedicineCart(data) {
    return {
        type: DELETE_MEDICINECART,
        payload: data
    }
}