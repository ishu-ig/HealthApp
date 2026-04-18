import { CREATE_HOSPITAL_RED, DELETE_HOSPITAL_RED, GET_HOSPITAL_RED, UPDATE_HOSPITAL_RED } from "../Constants";

export default function HospitalReducer(state = [], action) {
    switch (action.type) {
        case CREATE_HOSPITAL_RED:
            let newState = [...state]
            newState.push(action.payload)
            return newState

        case GET_HOSPITAL_RED:
            return action.payload

        case UPDATE_HOSPITAL_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].email = action.payload.email
            state[index].phone = action.payload.phone
            state[index].address = action.payload.address
            state[index].city = action.payload.city
            state[index].state = action.payload.state
            state[index].pinCode = action.payload.pinCode
            state[index].department = action.payload.department
            state[index].emergencyContact= action.payload.emergencyContact
            state[index].establishYear= action.payload.establishYear
            state[index].accreditation= action.payload.accreditation
            state[index].active = action.payload.active
            return state

        case DELETE_HOSPITAL_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}