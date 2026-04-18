import { CREATE_LABTESTWISHLIST_RED, DELETE_LABTESTWISHLIST_RED, GET_LABTESTWISHLIST_RED, UPDATE_LABTESTWISHLIST_RED } from "../Constants"
export default function LabtestWishlistReducer(state=[], action) {
    switch (action.type) {
        case CREATE_LABTESTWISHLIST_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_LABTESTWISHLIST_RED:
            return action.payload

        case UPDATE_LABTESTWISHLIST_RED:
            return state

        case DELETE_LABTESTWISHLIST_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
