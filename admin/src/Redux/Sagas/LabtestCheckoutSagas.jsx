import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LABTESTCHECKOUT, CREATE_LABTESTCHECKOUT_RED, DELETE_LABTESTCHECKOUT, DELETE_LABTESTCHECKOUT_RED, GET_LABTESTCHECKOUT, GET_LABTESTCHECKOUT_RED, UPDATE_LABTESTCHECKOUT, UPDATE_LABTESTCHECKOUT_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("labtestCheckout", action.payload)
    // let response = yield createMultipartRecord("labtestCheckout", action.payload)
    yield put({ type: CREATE_LABTESTCHECKOUT_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("labtestCheckout")
    yield put({ type: GET_LABTESTCHECKOUT_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("labtestCheckout", action.payload)
    // yield updateMultipartRecord("labtestCheckout", action.payload)
    yield put({ type: UPDATE_LABTESTCHECKOUT_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("labtestCheckout", action.payload)
    yield put({ type: DELETE_LABTESTCHECKOUT_RED, payload: action.payload })
}


export default function* labtestCheckoutSagas() {      
    yield takeEvery(CREATE_LABTESTCHECKOUT, createSaga)    //watcher saga
    yield takeEvery(GET_LABTESTCHECKOUT, getSaga)          //watcher saga
    yield takeEvery(UPDATE_LABTESTCHECKOUT, updateSaga)    //watcher saga
    yield takeEvery(DELETE_LABTESTCHECKOUT, deleteSaga)    //watcher saga
}