import { CREATE_MEDICINECHECKOUT_RED, DELETE_MEDICINECHECKOUT_RED, GET_MEDICINECHECKOUT_RED, UPDATE_MEDICINECHECKOUT_RED } from "../Constants"
export default function MedicineCheckoutReducer(state=[], action) {
    switch (action.type) {
        case CREATE_MEDICINECHECKOUT_RED:
            let newState = [...state]
            newState.unshift(action.payload)
            return newState

        case GET_MEDICINECHECKOUT_RED:
            return action.payload

        case UPDATE_MEDICINECHECKOUT_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].orderStatus = action.payload.orderStatus
            state[index].paymentMode = action.payload.paymentMode
            state[index].paymentStatus = action.payload.paymentStatus
            state[index].rppid = action.payload.rppid
            return state

        case DELETE_MEDICINECHECKOUT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}   
