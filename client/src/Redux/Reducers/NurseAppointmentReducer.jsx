import { CREATE_NURSEAPPOINTMENT_RED, DELETE_NURSEAPPOINTMENT_RED, GET_NURSEAPPOINTMENT_RED, UPDATE_NURSEAPPOINTMENT_RED } from "../Constants";

export default function NurseAppointmentReducer(state = [], action) {
    switch (action.type) {
        case CREATE_NURSEAPPOINTMENT_RED:
            let newState = [...state]
            newState.push(action.payload)
            return newState

        case GET_NURSEAPPOINTMENT_RED:
            return action.payload

        case UPDATE_NURSEAPPOINTMENT_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            
            return state

        case DELETE_NURSEAPPOINTMENT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}