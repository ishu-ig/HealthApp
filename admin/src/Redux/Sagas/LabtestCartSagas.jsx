import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LABTESTCART, CREATE_LABTESTCART_RED, DELETE_LABTESTCART, DELETE_LABTESTCART_RED, GET_LABTESTCART, GET_LABTESTCART_RED, UPDATE_LABTESTCART, UPDATE_LABTESTCART_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("labtestCart", action.payload)
    // let response = yield createMultipartRecord("labtestCart", action.payload)
    yield put({ type: CREATE_LABTESTCART_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("labtestCart")
    yield put({ type: GET_LABTESTCART_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("labtestCart", action.payload)
    // yield updateMultipartRecord("labtestCart", action.payload)
    yield put({ type: UPDATE_LABTESTCART_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("labtestCart", action.payload)
    yield put({ type: DELETE_LABTESTCART_RED, payload: action.payload })
}


export default function* labtestCartSagas() {      
    yield takeEvery(CREATE_LABTESTCART, createSaga)    //watcher saga
    yield takeEvery(GET_LABTESTCART, getSaga)          //watcher saga
    yield takeEvery(UPDATE_LABTESTCART, updateSaga)    //watcher saga
    yield takeEvery(DELETE_LABTESTCART, deleteSaga)    //watcher saga
}