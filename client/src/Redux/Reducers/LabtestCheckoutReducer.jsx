import { CREATE_LABTESTCHECKOUT_RED, DELETE_LABTESTCHECKOUT_RED, GET_LABTESTCHECKOUT_RED, UPDATE_LABTESTCHECKOUT_RED } from "../Constants"
export default function LabtestCheckoutReducer(state=[], action) {
    switch (action.type) {
        case CREATE_LABTESTCHECKOUT_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_LABTESTCHECKOUT_RED:
            return action.payload

        case UPDATE_LABTESTCHECKOUT_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].orderStatus = action.payload.orderStatus
            state[index].paymentMode = action.payload.paymentMode
            state[index].paymentStatus = action.payload.paymentStatus
            state[index].rppid = action.payload.rppid
            return state

        case DELETE_LABTESTCHECKOUT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
