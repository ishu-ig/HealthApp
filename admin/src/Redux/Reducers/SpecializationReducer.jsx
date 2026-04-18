import { CREATE_SPECIALIZATION_RED, DELETE_SPECIALIZATION_RED, GET_SPECIALIZATION_RED, UPDATE_SPECIALIZATION_RED } from "../Constants";

export default function SpecializationReducer(state=[], action) {
    switch (action.type) {
        case CREATE_SPECIALIZATION_RED:
            let newstate = [...state]
            newstate.push(action.payload)
            return newstate

        case GET_SPECIALIZATION_RED:
            return action.payload

        case UPDATE_SPECIALIZATION_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].active = action.payload.active
            return state

        case DELETE_SPECIALIZATION_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}
