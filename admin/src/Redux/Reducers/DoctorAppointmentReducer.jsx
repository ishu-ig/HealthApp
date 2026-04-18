import {
    CREATE_DOCTORAPPOINTMENT_RED,
    DELETE_DOCTORAPPOINTMENT_RED,
    GET_DOCTORAPPOINTMENT_RED,
    UPDATE_DOCTORAPPOINTMENT_RED
} from "../Constants";

export default function DoctorAppointmentReducer(state = [], action) {
    switch (action.type) {
        case CREATE_DOCTORAPPOINTMENT_RED:
            return [action.payload, ...state] // ✅ Fix: prepend so newest shows first

        case GET_DOCTORAPPOINTMENT_RED:
            return action.payload

        case UPDATE_DOCTORAPPOINTMENT_RED:
            // ✅ Fix: was finding index but never using it — now correctly replaces updated record
            return state.map(x => x._id === action.payload._id ? action.payload : x)

        case DELETE_DOCTORAPPOINTMENT_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}