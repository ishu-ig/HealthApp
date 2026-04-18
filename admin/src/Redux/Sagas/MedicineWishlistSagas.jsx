import { put, takeEvery } from "redux-saga/effects";
import { CREATE_MEDICINEWISHLIST, CREATE_MEDICINEWISHLIST_RED, DELETE_MEDICINEWISHLIST, DELETE_MEDICINEWISHLIST_RED, GET_MEDICINEWISHLIST, GET_MEDICINEWISHLIST_RED, UPDATE_MEDICINEWISHLIST, UPDATE_MEDICINEWISHLIST_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("medicineWishlist", action.payload)
    // let response = yield createMultipartRecord("medicineWishlist", action.payload)
    yield put({ type: CREATE_MEDICINEWISHLIST_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("medicineWishlist")
    yield put({ type: GET_MEDICINEWISHLIST_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("medicineWishlist", action.payload)
    // yield updateMultipartRecord("medicineWishlist", action.payload)
    yield put({ type: UPDATE_MEDICINEWISHLIST_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("medicineWishlist", action.payload)
    yield put({ type: DELETE_MEDICINEWISHLIST_RED, payload: action.payload })
}


export default function* medicineWishlistSagas() {      
    yield takeEvery(CREATE_MEDICINEWISHLIST, createSaga)    //watcher saga
    yield takeEvery(GET_MEDICINEWISHLIST, getSaga)          //watcher saga
    yield takeEvery(UPDATE_MEDICINEWISHLIST, updateSaga)    //watcher saga
    yield takeEvery(DELETE_MEDICINEWISHLIST, deleteSaga)    //watcher saga
}