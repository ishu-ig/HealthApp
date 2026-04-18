import { combineReducers } from "@reduxjs/toolkit";
import SpecializationReducer from "./SpecializationReducer";
import DoctorReducer from "./DoctorReducer";
import HospitalReducer from "./HospitalReducer";
import NurseReducer from "./NurseReducer";
import MedicineCategoryReducer from "./MedicineCategoryReducer";
import LabtestCategoryReducer from "./LabtestCategoryReducer";
import ManufacturerReducer from "./ManufacturerReducer";
import MedicineReducer from "./MedicineReducer";
import LabtestReducer from "./LabtestReducer";
import LabReducer from "./LabReducer";
import DoctorAppointmentReducer from "./DoctorAppointmentReducer";
import NurseAppointmentReducer from "./NurseAppointmentReducer";
import MedicineCartReducer from "./MedicineCartReducer";
import LabtestCartReducer from "./LabtestCartReducer";
import ContactUsReducer from "./ContactUsReducer";
import MedicineCheckoutReducer from "./MedicineCheckoutReducer";
import LabtestCheckoutReducer from "./LabtestCheckoutReducer";
import MedicineWishlistReducer from "./MedicineWishlistReducer";
import LabtestWishlistReducer from "./LabtestWishlistReducer";
import TestimonialReducer from "./TestimonialReducer";

export default combineReducers({
    SpecializationStateData : SpecializationReducer,
    DoctorStateData : DoctorReducer,
    HospitalStateData : HospitalReducer,
    NurseStateData : NurseReducer,
    MedicineCategoryStateData:MedicineCategoryReducer,
    LabtestCategoryStateData:LabtestCategoryReducer,
    ManufacturerStateData : ManufacturerReducer,
    MedicineStateData : MedicineReducer,
    LabtestStateData : LabtestReducer,
    LabStateData : LabReducer,
    DoctorAppointmentStateData : DoctorAppointmentReducer,
    NurseAppointmentStateData : NurseAppointmentReducer,
    MedicineCartStateData : MedicineCartReducer,
    LabtestCartStateData : LabtestCartReducer,
    ContactUsStateData : ContactUsReducer,
    MedicineCheckoutStateData : MedicineCheckoutReducer,
    LabtestCheckoutStateData : LabtestCheckoutReducer,
    MedicineWishlistStateData : MedicineWishlistReducer,
    LabtestWishlistStateData : LabtestWishlistReducer,
    TestimonialStateData : TestimonialReducer,
    
})