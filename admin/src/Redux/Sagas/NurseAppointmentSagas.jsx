import { put, takeEvery } from "redux-saga/effects";
import {
    CREATE_NURSEAPPOINTMENT, CREATE_NURSEAPPOINTMENT_RED,
    DELETE_NURSEAPPOINTMENT, DELETE_NURSEAPPOINTMENT_RED,
    GET_NURSEAPPOINTMENT,    GET_NURSEAPPOINTMENT_RED,
    UPDATE_NURSEAPPOINTMENT, UPDATE_NURSEAPPOINTMENT_RED
} from "../Constants";
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"; // ✅ Fix: use createRecord not createMultiPartRecord — appointment has no file upload

function* createSaga(action) {
    let response = yield createRecord("nurseAppointment", action.payload) // ✅ Fix: was createMultiPartRecord — sends wrong Content-Type, breaks JSON body
    yield put({ type: CREATE_NURSEAPPOINTMENT_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("nurseAppointment")
    yield put({ type: GET_NURSEAPPOINTMENT_RED, payload: response.data })
}

function* updateSaga(action) {
    let response = yield updateRecord("nurseAppointment", action.payload) // ✅ Fix: was updateMultiPartRecord — no files in appointment update
    yield put({ type: UPDATE_NURSEAPPOINTMENT_RED, payload: response.data })
}

function* deleteSaga(action) {
    yield deleteRecord("nurseAppointment", action.payload)
    yield put({ type: DELETE_NURSEAPPOINTMENT_RED, payload: action.payload })
}

export default function* nurseAppointmentSaga() {
    yield takeEvery(CREATE_NURSEAPPOINTMENT, createSaga)
    yield takeEvery(GET_NURSEAPPOINTMENT,    getSaga)
    yield takeEvery(UPDATE_NURSEAPPOINTMENT, updateSaga)
    yield takeEvery(DELETE_NURSEAPPOINTMENT, deleteSaga)
}