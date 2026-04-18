import { put, takeEvery } from "redux-saga/effects";
import { CREATE_LABTESTWISHLIST, CREATE_LABTESTWISHLIST_RED, DELETE_LABTESTWISHLIST, DELETE_LABTESTWISHLIST_RED, GET_LABTESTWISHLIST, GET_LABTESTWISHLIST_RED, UPDATE_LABTESTWISHLIST, UPDATE_LABTESTWISHLIST_RED } from "../Constants"
import { createRecord, deleteRecord, getRecord, updateRecord } from "./Services/ApiCallingService"
// import { createMultipartRecord, deleteRecord, getRecord, updateMultipartRecord } from "./Service/ApiCallingService"


function* createSaga(action) {                          //worker saga or executer saga
    let response = yield createRecord("labtestWishlist", action.payload)
    // let response = yield createMultipartRecord("labtestWishlist", action.payload)
    yield put({ type: CREATE_LABTESTWISHLIST_RED, payload: response.data })
}

function* getSaga(action) {                             //worker saga or executer saga
    let response = yield getRecord("labtestWishlist")
    yield put({ type: GET_LABTESTWISHLIST_RED, payload: response.data })
}

function* updateSaga(action) {                          //worker saga or executer saga
    yield updateRecord("labtestWishlist", action.payload)
    // yield updateMultipartRecord("labtestWishlist", action.payload)
    yield put({ type: UPDATE_LABTESTWISHLIST_RED, payload: action.payload })
}

function* deleteSaga(action) {                          //worker saga or executer saga
    yield deleteRecord("labtestWishlist", action.payload)
    yield put({ type: DELETE_LABTESTWISHLIST_RED, payload: action.payload })
}


export default function* labtestWishlistSagas() {      
    yield takeEvery(CREATE_LABTESTWISHLIST, createSaga)    //watcher saga
    yield takeEvery(GET_LABTESTWISHLIST, getSaga)          //watcher saga
    yield takeEvery(UPDATE_LABTESTWISHLIST, updateSaga)    //watcher saga
    yield takeEvery(DELETE_LABTESTWISHLIST, deleteSaga)    //watcher saga
}