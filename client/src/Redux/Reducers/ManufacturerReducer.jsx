import {
  CREATE_MANUFACTURER_RED,
  DELETE_MANUFACTURER_RED,
  GET_MANUFACTURER_RED,
  UPDATE_MANUFACTURER_RED,
} from "../Constants";

export default function ManufacturerReducer(state = [], action) {
  switch (action.type) {
    case CREATE_MANUFACTURER_RED:
      let newState = [...state];
      newState.push(action.payload);
      return newState;

    case GET_MANUFACTURER_RED:
      return action.payload;

    case UPDATE_MANUFACTURER_RED:
      let index = state.findIndex((x) => x._id === action.payload._id);
        
        state[index].name = action.payload.name;
        state[index].email = action.payload.email;
        state[index].phone = action.payload.phone;
        state[index].companyName = action.payload.companyName;
        state[index].licenseNumber = action.payload.licenseNumber;
        state[index].gstNumber = action.payload.gstNumber;
        state[index].establishedYear = action.payload.establishedYear;
        state[index].website = action.payload.website;
        state[index].certifications = action.payload.certifications;
        state[index].address = action.payload.address;
        state[index].city = action.payload.city;
        state[index].state = action.payload.state;
        state[index].pincode = action.payload.pincode;
        state[index].country = action.payload.country;
        state[index].active = action.payload.active;
      return state;

    case DELETE_MANUFACTURER_RED:
      return state.filter((x) => x._id !== action.payload._id);

    default:
      return state;
  }
}
