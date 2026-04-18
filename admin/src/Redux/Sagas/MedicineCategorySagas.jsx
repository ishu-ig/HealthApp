import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MEDICINECATEGORY, CREATE_MEDICINECATEGORY_RED, DELETE_MEDICINECATEGORY, DELETE_MEDICINECATEGORY_RED, GET_MEDICINECATEGORY, GET_MEDICINECATEGORY_RED, UPDATE_MEDICINECATEGORY, UPDATE_MEDICINECATEGORY_RED } from "../Constants";
// import { createRecord, deleteRecord, getRecord,  updateRecord } from "./Services/ApiCallingService";
import { createMultiPartRecord, deleteRecord, getRecord, updateMultiPartRecord } from "./Services/ApiCallingService";

function* createSaga(action) {
    // let response = yield createRecord("medicineCategory", action.payload)
    let response = yield createMultiPartRecord("medicineCategory", action.payload)
    yield put({ type: CREATE_MEDICINECATEGORY_RED, payload: response.data })
}

function* getSaga(action) {
    let response = yield getRecord("medicineCategory")
    yield put({ type: GET_MEDICINECATEGORY_RED, payload: response.data })
}

function* updateSaga(action) {
    // yield updateRecord("medicineCategory", action.payload)
    // yield put({ type: UPDATE_MEDICINECATEGORY_RED, payload: action.payload })
    let response = yield updateMultiPartRecord("medicineCategory", action.payload)
    yield put({ type: UPDATE_MEDICINECATEGORY_RED, payload: response.data })
}
function* deleteSaga(action) {
    yield deleteRecord("medicineCategory", action.payload)
    yield put({ type: DELETE_MEDICINECATEGORY_RED, payload: action.payload })
}
export default function* medicineCategorySaga() {
    yield takeEvery(CREATE_MEDICINECATEGORY, createSaga)
    yield takeEvery(GET_MEDICINECATEGORY, getSaga)
    yield takeEvery(UPDATE_MEDICINECATEGORY, updateSaga)
    yield takeEvery(DELETE_MEDICINECATEGORY, deleteSaga)
}