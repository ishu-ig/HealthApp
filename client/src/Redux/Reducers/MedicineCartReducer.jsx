import {
    CREATE_MEDICINECART_RED,
    DELETE_MEDICINECART_RED,
    GET_MEDICINECART_RED,
    UPDATE_MEDICINECART_RED,
} from "../Constants";

export default function MedicineCartReducer(state = [], action) {
    switch (action.type) {
        case CREATE_MEDICINECART_RED:
            // Prepend new item — spread to avoid mutation
            return [action.payload, ...state];

        case GET_MEDICINECART_RED:
            // Replace state entirely with fresh API response
            return Array.isArray(action.payload) ? action.payload : [];

        case UPDATE_MEDICINECART_RED: {
            // FIX: was directly mutating state[index].qty and state[index].total
            // then returning the same reference — React sees no change and skips re-render
            const index = state.findIndex(x => x._id === action.payload._id);
            if (index === -1) return state;
            const updated = [...state];
            updated[index] = {
                ...updated[index],
                qty:   action.payload.qty,
                total: action.payload.total,
            };
            return updated;
        }

        case DELETE_MEDICINECART_RED:
            return state.filter(x => x._id !== action.payload._id);

        default:
            return state;
    }
}