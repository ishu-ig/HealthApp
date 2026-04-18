import { CREATE_MEDICINECATEGORY_RED, DELETE_MEDICINECATEGORY_RED, GET_MEDICINECATEGORY_RED, UPDATE_MEDICINECATEGORY_RED } from "../Constants";

export default function MedicineCategoryReducer(state=[], action) {
    switch (action.type) {
        case CREATE_MEDICINECATEGORY_RED:
            let newstate = [...state]
            newstate.push(action.payload)
            return newstate

        case GET_MEDICINECATEGORY_RED:
            return action.payload

        case UPDATE_MEDICINECATEGORY_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].active = action.payload.active
            return state

        case DELETE_MEDICINECATEGORY_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}
