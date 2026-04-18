import { CREATE_NURSEAPPOINTMENT, DELETE_NURSEAPPOINTMENT, GET_NURSEAPPOINTMENT, UPDATE_NURSEAPPOINTMENT } from "../Constants";

export function createNurseAppointment(data) {
    return {
        type: CREATE_NURSEAPPOINTMENT,
        payload: data
    }
}

export function getNurseAppointment() {
    return {
        type: GET_NURSEAPPOINTMENT
    }
}

export function updateNurseAppointment(data) {
    return {
        type: UPDATE_NURSEAPPOINTMENT,
        payload: data
    }
}

export function deleteNurseAppointment(data) {
    return {
        type: DELETE_NURSEAPPOINTMENT,
        payload: data
    }
}