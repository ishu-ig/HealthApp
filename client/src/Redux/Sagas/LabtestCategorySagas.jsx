import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LABTESTCATEGORY, CREATE_LABTESTCATEGORY_RED, DELETE_LABTESTCATEGORY, DELETE_LABTESTCATEGORY_RED, GET_LABTESTCATEGORY, GET_LABTESTCATEGORY_RED, UPDATE_LABTESTCATEGORY, UPDATE_LABTESTCATEGORY_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("labtestCategory", action.payload)
    let response = yield createMultiPartRecord("labtestCategory", action.payload)
    yield put({ type: CREATE_LABTESTCATEGORY_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("labtestCategory")
    yield put({ type: GET_LABTESTCATEGORY_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("labtestCategory", action.payload)
    // yield put({ type: UPDATE_LABTESTCATEGORY_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("labtestCategory", action.payload)
    yield put({ type: UPDATE_LABTESTCATEGORY_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("labtestCategory", action.payload)
    yield put({ type: DELETE_LABTESTCATEGORY_RED, payload: action.payload })
}
export default function* labtestCategorySaga() {
    yield takeEvery(CREATE_LABTESTCATEGORY, createSaga)
    yield takeEvery(GET_LABTESTCATEGORY, getSaga)
    yield takeEvery(UPDATE_LABTESTCATEGORY, updateSaga)
    yield takeEvery(DELETE_LABTESTCATEGORY, deleteSaga)
}