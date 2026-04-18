import { CREATE_NURSE_RED, DELETE_NURSE_RED, GET_NURSE_RED, UPDATE_NURSE_RED } from "../Constants";

export default function NurseReducer(state=[], action) {
    switch (action.type) {
        case CREATE_NURSE_RED:
            let newstate = [...state]
            newstate.push(action.payload)
            return newstate

        case GET_NURSE_RED:
            return action.payload

        case UPDATE_NURSE_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].email = action.payload.email
            state[index].phone = action.payload.phone
            state[index].gender = action.payload.gender
            state[index].dob = action.payload.dob
            state[index].departments = action.payload.departments
            state[index].availableDays = action.payload.availableDays
            state[index].availableTime = action.payload.availableTime
            state[index].qualification = action.payload.qualification
            state[index].experience= action.payload.experience
            state[index].fees= action.payload.fees
            state[index].bio= action.payload.bio
            state[index].address= action.payload.address
            state[index].city= action.payload.city
            state[index].state= action.payload.state
            state[index].pincode= action.payload.pincode
            state[index].active = action.payload.active
            return state

        case DELETE_NURSE_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}
