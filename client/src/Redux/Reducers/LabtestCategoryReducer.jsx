import { CREATE_LABTESTCATEGORY_RED, DELETE_LABTESTCATEGORY_RED, GET_LABTESTCATEGORY_RED, UPDATE_LABTESTCATEGORY_RED } from "../Constants";

export default function LabtestCategoryReducer(state=[], action) {
    switch (action.type) {
        case CREATE_LABTESTCATEGORY_RED:
            let newstate = [...state]
            newstate.push(action.payload)
            return newstate

        case GET_LABTESTCATEGORY_RED:
            return action.payload

        case UPDATE_LABTESTCATEGORY_RED:
            let index = state.findIndex(x => x._id === action.payload._id)
            state[index].name = action.payload.name
            state[index].pic = action.payload.pic
            state[index].active = action.payload.active
            return state

        case DELETE_LABTESTCATEGORY_RED:
            return state.filter(x => x._id !== action.payload._id)

        default:
            return state
    }
}
