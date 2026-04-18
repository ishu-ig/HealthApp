import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LAB, CREATE_LAB_RED, DELETE_LAB, DELETE_LAB_RED, GET_LAB, GET_LAB_RED, UPDATE_LAB, UPDATE_LAB_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("lab", action.payload)
    let response = yield createMultiPartRecord("lab", action.payload)
    yield put({ type: CREATE_LAB_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("lab")
    yield put({ type: GET_LAB_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("lab", action.payload)
    // yield put({ type: UPDATE_LAB_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("lab", action.payload)
    yield put({ type: UPDATE_LAB_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("lab", action.payload)
    yield put({ type: DELETE_LAB_RED, payload: action.payload })
}
export default function* labSaga() {
    yield takeEvery(CREATE_LAB, createSaga)
    yield takeEvery(GET_LAB, getSaga)
    yield takeEvery(UPDATE_LAB, updateSaga)
    yield takeEvery(DELETE_LAB, deleteSaga)
}