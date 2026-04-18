import { put, takeEvery } from "redux-saga/effects";
import { CREATE_DOCTOR, CREATE_DOCTOR_RED, DELETE_DOCTOR, DELETE_DOCTOR_RED, GET_DOCTOR, GET_DOCTOR_RED, UPDATE_DOCTOR, UPDATE_DOCTOR_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("doctor", action.payload)
    let response = yield createMultiPartRecord("doctor", action.payload)
    yield put({ type: CREATE_DOCTOR_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("doctor")
    yield put({ type: GET_DOCTOR_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("doctor", action.payload)
    // yield put({ type: UPDATE_DOCTOR_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("doctor", action.payload)
    yield put({ type: UPDATE_DOCTOR_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("doctor", action.payload)
    yield put({ type: DELETE_DOCTOR_RED, payload: action.payload })
}
export default function* doctorSaga() {
    yield takeEvery(CREATE_DOCTOR, createSaga)
    yield takeEvery(GET_DOCTOR, getSaga)
    yield takeEvery(UPDATE_DOCTOR, updateSaga)
    yield takeEvery(DELETE_DOCTOR, deleteSaga)
}