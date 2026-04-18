import { put, takeEvery } from "redux-saga/effects";
import { CREATE_SPECIALIZATION, CREATE_SPECIALIZATION_RED, DELETE_SPECIALIZATION, DELETE_SPECIALIZATION_RED, GET_SPECIALIZATION, GET_SPECIALIZATION_RED, UPDATE_SPECIALIZATION, UPDATE_SPECIALIZATION_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("specialization", action.payload)
    let response = yield createMultiPartRecord("specialization", action.payload)
    yield put({ type: CREATE_SPECIALIZATION_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("specialization")
    yield put({ type: GET_SPECIALIZATION_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("specialization", action.payload)
    // yield put({ type: UPDATE_SPECIALIZATION_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("specialization", action.payload)
    yield put({ type: UPDATE_SPECIALIZATION_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("specialization", action.payload)
    yield put({ type: DELETE_SPECIALIZATION_RED, payload: action.payload })
}
export default function* specializationSaga() {
    yield takeEvery(CREATE_SPECIALIZATION, createSaga)
    yield takeEvery(GET_SPECIALIZATION, getSaga)
    yield takeEvery(UPDATE_SPECIALIZATION, updateSaga)
    yield takeEvery(DELETE_SPECIALIZATION, deleteSaga)
}