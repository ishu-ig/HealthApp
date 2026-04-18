import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MANUFACTURER, CREATE_MANUFACTURER_RED, DELETE_MANUFACTURER, DELETE_MANUFACTURER_RED, GET_MANUFACTURER, GET_MANUFACTURER_RED, UPDATE_MANUFACTURER, UPDATE_MANUFACTURER_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("manufacturer", action.payload)
    // let response = yield createMultipartRecord("manufacturer", action.payload)
    yield put({ type: CREATE_MANUFACTURER_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("manufacturer")
    yield put({ type: GET_MANUFACTURER_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("manufacturer", action.payload)
    // yield updateMultipartRecord("manufacturer", action.payload)
    yield put({ type: UPDATE_MANUFACTURER_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("manufacturer", action.payload)
    yield put({ type: DELETE_MANUFACTURER_RED, payload: action.payload })
}


export default function* manufacturerSagas() {      
    yield takeEvery(CREATE_MANUFACTURER, createSaga)    //watcher saga
    yield takeEvery(GET_MANUFACTURER, getSaga)          //watcher saga
    yield takeEvery(UPDATE_MANUFACTURER, updateSaga)    //watcher saga
    yield takeEvery(DELETE_MANUFACTURER, deleteSaga)    //watcher saga
}