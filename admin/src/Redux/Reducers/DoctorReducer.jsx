import { CREATE_DOCTOR_RED, DELETE_DOCTOR_RED, GET_DOCTOR_RED, UPDATE_DOCTOR_RED } from "../Constants";

export default function DoctorReducer(state = [], action) {
    switch (action.type) {
        case CREATE_DOCTOR_RED:
            let newState = [...state]
            newState.push(action.payload)
            return newState

        case GET_DOCTOR_RED:
            return action.payload

        case UPDATE_DOCTOR_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].email = action.payload.email
            state[index].phone = action.payload.phone
            state[index].gender = action.payload.gender
            state[index].dob = action.payload.dob
            state[index].specialization = action.payload.specialization
            state[index].availableDays = action.payload.availableDays
            state[index].specialization = action.payload.specialization
            state[index].bio= action.payload.bio
            state[index].qualification= action.payload.qualification
            state[index].experience= action.payload.experience
            state[index].availableTiming= action.payload.availableTiming
            state[index].fees= action.payload.fees
            state[index].address = action.payload.address
            state[index].city = action.payload.city
            state[index].state = action.payload.state
            state[index].pinCode = action.payload.pinCode
            state[index].active = action.payload.active
            return state

        case DELETE_DOCTOR_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}