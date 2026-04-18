import { CREATE_MEDICINECHECKOUT, DELETE_MEDICINECHECKOUT, GET_MEDICINECHECKOUT, UPDATE_MEDICINECHECKOUT } from "../Constants";

export function createMedicineCheckout(data) {
    return {
        type: CREATE_MEDICINECHECKOUT,
        payload: data
    }
}

export function getMedicineCheckout() {
    return {
        type: GET_MEDICINECHECKOUT
    }
}

export function updateMedicineCheckout(data) {
    return {
        type: UPDATE_MEDICINECHECKOUT,
        payload: data
    }
}

export function deleteMedicineCheckout(data) {
    return {
        type: DELETE_MEDICINECHECKOUT,
        payload: data
    }
}