import { all } from "redux-saga/effects";
import specializationSaga  from "./SpecializationSagas";
import doctorSaga from "./DoctorSagas";
import hospitalSaga from "./HospitalSagas";
import nurseSaga from "./NurseSagas";
import medicineCategorySaga from "./MedicineCategorySagas";
import labtestCategorySaga from "./LabtestCategorySagas";
import manufacturerSaga from "./ManufacturerSagas";
import medicineSaga from "./MedicineSagas";
import labtestSaga from "./LabtestSagas";
import labSaga from "./LabSagas";
import doctorAppointmentSaga from "./DoctorAppointmentSagas";
import nurseAppointmentSaga from "./NurseAppointmentSagas";
import labtestCartSagas from "./LabtestCartSagas";
import medicineCartSagas from "./MedicineCartSagas";
import contactUsSagas from "./ContactUsSagas";
import medicineCheckoutSagas from "./MedicineCheckoutSagas";
import labtestCheckoutSagas from "./LabtestCheckoutSagas";
import labtestWishlistSagas from "./LabtestWishlistSagas";
import medicineWishlistSagas from "./MedicineWishlistSagas";
import testimonialSaga from "./TestimonialSagas";

export default function* RootSaga() {
    yield all([
        specializationSaga(),
        doctorSaga(),
        hospitalSaga(),
        nurseSaga(),
        medicineCategorySaga(),
        labtestCategorySaga(),
        manufacturerSaga(),
        medicineSaga(),
        labtestSaga(),
        labSaga(),
        doctorAppointmentSaga(),
        nurseAppointmentSaga(),
        medicineCartSagas(),
        labtestCartSagas(),
        contactUsSagas(),
        medicineCheckoutSagas(),
        labtestCheckoutSagas(),
        labtestWishlistSagas(),
        medicineWishlistSagas(),
        testimonialSaga()
        
        
    ])
}