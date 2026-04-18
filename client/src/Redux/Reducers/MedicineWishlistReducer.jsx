import { CREATE_MEDICINEWISHLIST_RED, DELETE_MEDICINEWISHLIST_RED, GET_MEDICINEWISHLIST_RED, UPDATE_MEDICINEWISHLIST_RED } from "../Constants"
export default function MedicineWishlistReducer(state=[], action) {
    switch (action.type) {
        case CREATE_MEDICINEWISHLIST_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_MEDICINEWISHLIST_RED:
            return action.payload

        case UPDATE_MEDICINEWISHLIST_RED:
            return state

        case DELETE_MEDICINEWISHLIST_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
