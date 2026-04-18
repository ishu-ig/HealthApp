import {
  CREATE_MEDICINE_RED,
  DELETE_MEDICINE_RED,
  GET_MEDICINE_RED,
  UPDATE_MEDICINE_RED,
} from "../Constants";

export default function MedicineReducer(state = [], action) {
  switch (action.type) {
    case CREATE_MEDICINE_RED:
      let newState = [...state];
      newState.push(action.payload);
      return newState;

    case GET_MEDICINE_RED:
      return action.payload;

    case UPDATE_MEDICINE_RED:
      let index = state.findIndex((x) => x._id === action.payload._id);
      state[index].name = action.payload.name;
      state[index].medicineCategory = action.payload.medicineCategory;
      state[index].pic = action.payload.pic;
      state[index].description = action.payload.description;
      state[index].basePrice = action.payload.basePrice;
      state[index].discount = action.payload.discount;
      state[index].finalPrice = action.payload.finalPrice;
      state[index].stock = action.payload.stock;
      state[index].stockQuantity = action.payload.stockQuantity;
      state[index].expireDate = action.payload.expireDate;
      state[index].manufacturer = action.payload.manufacturer;
      state[index].active = action.payload.active;
      return state;

    case DELETE_MEDICINE_RED:
      return state.filter((x) => x._id !== action.payload._id);

    default:
      return state;
  }
}
