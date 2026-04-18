import { put, takeEvery } from "redux-saga/effects";
import { CREATE_NURSE, CREATE_NURSE_RED, DELETE_NURSE, DELETE_NURSE_RED, GET_NURSE, GET_NURSE_RED, UPDATE_NURSE, UPDATE_NURSE_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("nurse", action.payload)
    let response = yield createMultiPartRecord("nurse", action.payload)
    yield put({ type: CREATE_NURSE_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("nurse")
    yield put({ type: GET_NURSE_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("nurse", action.payload)
    // yield put({ type: UPDATE_NURSE_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("nurse", action.payload)
    yield put({ type: UPDATE_NURSE_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("nurse", action.payload)
    yield put({ type: DELETE_NURSE_RED, payload: action.payload })
}
export default function* nurseSaga() {
    yield takeEvery(CREATE_NURSE, createSaga)
    yield takeEvery(GET_NURSE, getSaga)
    yield takeEvery(UPDATE_NURSE, updateSaga)
    yield takeEvery(DELETE_NURSE, deleteSaga)
}