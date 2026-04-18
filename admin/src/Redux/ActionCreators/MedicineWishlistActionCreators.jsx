import { CREATE_MEDICINEWISHLIST, DELETE_MEDICINEWISHLIST, GET_MEDICINEWISHLIST, UPDATE_MEDICINEWISHLIST } from "../Constants"

export function createMedicineWishlist(data) {
    return {
        type: CREATE_MEDICINEWISHLIST,
        payload: data
    }
}

export function getMedicineWishlist() {
    return {
        type: GET_MEDICINEWISHLIST
    }
}

export function updateMedicineWishlist(data) {
    return {
        type: UPDATE_MEDICINEWISHLIST,
        payload: data
    }
}

export function deleteMedicineWishlist(data) {
    return {
        type: DELETE_MEDICINEWISHLIST,
        payload: data
    }
}