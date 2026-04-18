import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MEDICINE, CREATE_MEDICINE_RED, DELETE_MEDICINE, DELETE_MEDICINE_RED, GET_MEDICINE, GET_MEDICINE_RED, UPDATE_MEDICINE, UPDATE_MEDICINE_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("medicine", action.payload)
    let response = yield createMultiPartRecord("medicine", action.payload)
    yield put({ type: CREATE_MEDICINE_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("medicine")
    yield put({ type: GET_MEDICINE_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("medicine", action.payload)
    // yield put({ type: UPDATE_MEDICINE_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("medicine", action.payload)
    yield put({ type: UPDATE_MEDICINE_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("medicine", action.payload)
    yield put({ type: DELETE_MEDICINE_RED, payload: action.payload })
}
export default function* medicineSaga() {
    yield takeEvery(CREATE_MEDICINE, createSaga)
    yield takeEvery(GET_MEDICINE, getSaga)
    yield takeEvery(UPDATE_MEDICINE, updateSaga)
    yield takeEvery(DELETE_MEDICINE, deleteSaga)
}