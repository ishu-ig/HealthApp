import { CREATE_MEDICINECART_RED, DELETE_MEDICINECART_RED, GET_MEDICINECART_RED, UPDATE_MEDICINECART_RED } from "../Constants"
export default function MedicineCartReducer(state=[], action) {
    switch (action.type) {
        case CREATE_MEDICINECART_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_MEDICINECART_RED:
            return action.payload

        case UPDATE_MEDICINECART_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].qty = action.payload.qty
            state[index].total = action.payload.total
            return state

        case DELETE_MEDICINECART_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
