import {
    CREATE_MEDICINECHECKOUT_RED,
    DELETE_MEDICINECHECKOUT_RED,
    GET_MEDICINECHECKOUT_RED,
    UPDATE_MEDICINECHECKOUT_RED,
} from "../Constants";

export default function MedicineCheckoutReducer(state = [], action) {
    switch (action.type) {
        case CREATE_MEDICINECHECKOUT_RED:
            return [action.payload, ...state];

        case GET_MEDICINECHECKOUT_RED:
            return Array.isArray(action.payload) ? action.payload : [];

        case UPDATE_MEDICINECHECKOUT_RED: {
            // FIX: was directly mutating state[index].* fields then returning
            // the same array reference — React won't re-render on mutation
            const index = state.findIndex(x => x._id === action.payload._id);
            if (index === -1) return state;
            const updated = [...state];
            updated[index] = {
                ...updated[index],
                orderStatus:   action.payload.orderStatus,
                paymentMode:   action.payload.paymentMode,
                paymentStatus: action.payload.paymentStatus,
                rppid:         action.payload.rppid,
            };
            return updated;
        }

        case DELETE_MEDICINECHECKOUT_RED:
            return state.filter(x => x._id !== action.payload._id);

        default:
            return state;
    }
}