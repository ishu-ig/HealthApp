import { put, takeEvery } from "redux-saga/effects";
import {
    CREATE_DOCTORAPPOINTMENT, CREATE_DOCTORAPPOINTMENT_RED,
    DELETE_DOCTORAPPOINTMENT, DELETE_DOCTORAPPOINTMENT_RED,
    GET_DOCTORAPPOINTMENT,    GET_DOCTORAPPOINTMENT_RED,
    UPDATE_DOCTORAPPOINTMENT, UPDATE_DOCTORAPPOINTMENT_RED
} from "../Constants";
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"; // ✅ Fix: use createRecord not createMultiPartRecord — appointment has no file upload

function* createSaga(action) {
    let response = yield createRecord("doctorAppointment", action.payload) // ✅ Fix: was createMultiPartRecord — sends wrong Content-Type, breaks JSON body
    yield put({ type: CREATE_DOCTORAPPOINTMENT_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("doctorAppointment")
    yield put({ type: GET_DOCTORAPPOINTMENT_RED, payload: response.data })
}

function* updateSaga(action) {
    let response = yield updateRecord("doctorAppointment", action.payload) // ✅ Fix: was updateMultiPartRecord — no files in appointment update
    yield put({ type: UPDATE_DOCTORAPPOINTMENT_RED, payload: response.data })
}

function* deleteSaga(action) {
    yield deleteRecord("doctorAppointment", action.payload)
    yield put({ type: DELETE_DOCTORAPPOINTMENT_RED, payload: action.payload })
}

export default function* doctorAppointmentSaga() {
    yield takeEvery(CREATE_DOCTORAPPOINTMENT, createSaga)
    yield takeEvery(GET_DOCTORAPPOINTMENT,    getSaga)
    yield takeEvery(UPDATE_DOCTORAPPOINTMENT, updateSaga)
    yield takeEvery(DELETE_DOCTORAPPOINTMENT, deleteSaga)
}