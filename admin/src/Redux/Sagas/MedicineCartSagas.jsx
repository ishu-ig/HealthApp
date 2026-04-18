import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MEDICINECART, CREATE_MEDICINECART_RED, DELETE_MEDICINECART, DELETE_MEDICINECART_RED, GET_MEDICINECART, GET_MEDICINECART_RED, UPDATE_MEDICINECART, UPDATE_MEDICINECART_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("medicineCart", action.payload)
    // let response = yield createMultipartRecord("medicineCart", action.payload)
    yield put({ type: CREATE_MEDICINECART_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("medicineCart")
    yield put({ type: GET_MEDICINECART_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("medicineCart", action.payload)
    // yield updateMultipartRecord("medicineCart", action.payload)
    yield put({ type: UPDATE_MEDICINECART_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("medicineCart", action.payload)
    yield put({ type: DELETE_MEDICINECART_RED, payload: action.payload })
}


export default function* medicineCartSagas() {      
    yield takeEvery(CREATE_MEDICINECART, createSaga)    //watcher saga
    yield takeEvery(GET_MEDICINECART, getSaga)          //watcher saga
    yield takeEvery(UPDATE_MEDICINECART, updateSaga)    //watcher saga
    yield takeEvery(DELETE_MEDICINECART, deleteSaga)    //watcher saga
}