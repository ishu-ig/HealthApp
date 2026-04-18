import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LABTEST, CREATE_LABTEST_RED, DELETE_LABTEST, DELETE_LABTEST_RED, GET_LABTEST, GET_LABTEST_RED, UPDATE_LABTEST, UPDATE_LABTEST_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("labtest", action.payload)
    let response = yield createMultiPartRecord("labtest", action.payload)
    yield put({ type: CREATE_LABTEST_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("labtest")
    yield put({ type: GET_LABTEST_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("labtest", action.payload)
    // yield put({ type: UPDATE_LABTEST_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("labtest", action.payload)
    yield put({ type: UPDATE_LABTEST_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("labtest", action.payload)
    yield put({ type: DELETE_LABTEST_RED, payload: action.payload })
}
export default function* labtestSaga() {
    yield takeEvery(CREATE_LABTEST, createSaga)
    yield takeEvery(GET_LABTEST, getSaga)
    yield takeEvery(UPDATE_LABTEST, updateSaga)
    yield takeEvery(DELETE_LABTEST, deleteSaga)
}