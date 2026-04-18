import {
  CREATE_LAB_RED,
  DELETE_LAB_RED,
  GET_LAB_RED,
  UPDATE_LAB_RED,
} from "../Constants";

export default function LabReducer(state = [], action) {
  switch (action.type) {
    case CREATE_LAB_RED:
      let newState = [...state];
      newState.push(action.payload);
      return newState;

    case GET_LAB_RED:
      return action.payload;

    case UPDATE_LAB_RED:
      let index = state.findIndex((x) => x._id === action.payload._id);

      state[index].name = action.payload.name;
      state[index].pic = action.payload.pic;
      state[index].availableDays = action.payload.availableDays;
      state[index].openingTime = action.payload.openingTime;
      state[index].closingTime = action.payload.closingTime;
      state[index].address = action.payload.address;
      state[index].pin = action.payload.pin;
      state[index].city = action.payload.city;
      state[index].state = action.payload.state;
      state[index].active = action.payload.active;

      return state;
    case DELETE_LAB_RED:
      return state.filter((x) => x._id !== action.payload._id);

    default:
      return state;
  }
}
