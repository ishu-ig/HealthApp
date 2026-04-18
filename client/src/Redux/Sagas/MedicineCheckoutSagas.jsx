import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MEDICINECHECKOUT, CREATE_MEDICINECHECKOUT_RED, DELETE_MEDICINECHECKOUT, DELETE_MEDICINECHECKOUT_RED, GET_MEDICINECHECKOUT, GET_MEDICINECHECKOUT_RED, UPDATE_MEDICINECHECKOUT, UPDATE_MEDICINECHECKOUT_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("medicineCheckout", action.payload)
    // let response = yield createMultipartRecord("medicineCheckout", action.payload)
    yield put({ type: CREATE_MEDICINECHECKOUT_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("medicineCheckout")
    yield put({ type: GET_MEDICINECHECKOUT_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("medicineCheckout", action.payload)
    // yield updateMultipartRecord("medicineCheckout", action.payload)
    yield put({ type: UPDATE_MEDICINECHECKOUT_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("medicineCheckout", action.payload)
    yield put({ type: DELETE_MEDICINECHECKOUT_RED, payload: action.payload })
}


export default function* medicineCheckoutSagas() {      
    yield takeEvery(CREATE_MEDICINECHECKOUT, createSaga)    //watcher saga
    yield takeEvery(GET_MEDICINECHECKOUT, getSaga)          //watcher saga
    yield takeEvery(UPDATE_MEDICINECHECKOUT, updateSaga)    //watcher saga
    yield takeEvery(DELETE_MEDICINECHECKOUT, deleteSaga)    //watcher saga
}