import { CREATE_DOCTORAPPOINTMENT, DELETE_DOCTORAPPOINTMENT, GET_DOCTORAPPOINTMENT, UPDATE_DOCTORAPPOINTMENT } from "../Constants";

export function createDoctorAppointment(data) {
    return {
        type: CREATE_DOCTORAPPOINTMENT,
        payload: data
    }
}

export function getDoctorAppointment() {
    return {
        type: GET_DOCTORAPPOINTMENT
    }
}

export function updateDoctorAppointment(data) {
    return {
        type: UPDATE_DOCTORAPPOINTMENT,
        payload: data
    }
}

export function deleteDoctorAppointment(data) {
    return {
        type: DELETE_DOCTORAPPOINTMENT,
        payload: data
    }
}