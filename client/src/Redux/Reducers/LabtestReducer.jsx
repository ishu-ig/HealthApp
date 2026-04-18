import {
  CREATE_LABTEST_RED,
  DELETE_LABTEST_RED,
  GET_LABTEST_RED,
  UPDATE_LABTEST_RED,
} from "../Constants";

export default function LabtestReducer(state = [], action) {
  switch (action.type) {
    case CREATE_LABTEST_RED:
      let newState = [...state];
      newState.push(action.payload);
      return newState;

    case GET_LABTEST_RED:
      return action.payload;

    case UPDATE_LABTEST_RED:
      let index = state.findIndex((x) => x._id === action.payload._id);

      state[index].name = action.payload.name;
      state[index].labtestCategory = action.payload.labtestCategory;
      state[index].lab = action.payload.lab;
      state[index].basePrice = action.payload.basePrice;
      state[index].discount = action.payload.discount;
      state[index].finalPrice = action.payload.finalPrice;
      state[index].description = action.payload.description;
      state[index].sampleRequired = action.payload.sampleRequired;
      state[index].preperation = action.payload.preperation;
      state[index].reportTime = action.payload.reportTime;
      state[index].pic = action.payload.pic;
      state[index].active = action.payload.active;

      return state;
    case DELETE_LABTEST_RED:
      return state.filter((x) => x._id !== action.payload._id);

    default:
      return state;
  }
}
