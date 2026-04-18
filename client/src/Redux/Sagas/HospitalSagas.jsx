import { put, takeEvery } from "redux-saga/effects";
import { CREATE_HOSPITAL, CREATE_HOSPITAL_RED, DELETE_HOSPITAL, DELETE_HOSPITAL_RED, GET_HOSPITAL, GET_HOSPITAL_RED, UPDATE_HOSPITAL, UPDATE_HOSPITAL_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("hospital", action.payload)
    let response = yield createMultiPartRecord("hospital", action.payload)
    yield put({ type: CREATE_HOSPITAL_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("hospital")
    yield put({ type: GET_HOSPITAL_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("hospital", action.payload)
    // yield put({ type: UPDATE_HOSPITAL_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("hospital", action.payload)
    yield put({ type: UPDATE_HOSPITAL_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("hospital", action.payload)
    yield put({ type: DELETE_HOSPITAL_RED, payload: action.payload })
}
export default function* hospitalSaga() {
    yield takeEvery(CREATE_HOSPITAL, createSaga)
    yield takeEvery(GET_HOSPITAL, getSaga)
    yield takeEvery(UPDATE_HOSPITAL, updateSaga)
    yield takeEvery(DELETE_HOSPITAL, deleteSaga)
}