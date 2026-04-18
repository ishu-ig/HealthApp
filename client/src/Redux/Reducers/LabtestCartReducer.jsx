import { CREATE_LABTESTCART_RED, DELETE_LABTESTCART_RED, GET_LABTESTCART_RED, UPDATE_LABTESTCART_RED } from "../Constants"
export default function LabtestCartReducer(state=[], action) {
    switch (action.type) {
        case CREATE_LABTESTCART_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_LABTESTCART_RED:
            return action.payload

        case UPDATE_LABTESTCART_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].qty = action.payload.qty
            state[index].total = action.payload.total
            return state

        case DELETE_LABTESTCART_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
