import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AdminNavbar from "./Components/Navbar";
import AdminSidebar from "./Components/Sidebar";
import Footer from "./Components/Footer";
import AdminCreateSpecialization from "./pages/specialization/AdminCreateSpecialization";
import AdminUpdateSpecialization from "./pages/specialization/AdminUpdateSpecialization";
import AdminSpecialization from "./pages/specialization/AdminSpecialization";
import AdminDoctor from "./pages/doctor/AdminDoctor";
import AdminCreateDoctor from "./pages/doctor/AdminCreateDoctor";
import AdminUpdateDoctor from "./pages/doctor/AdminUpdateDoctor";
import AdminHospital from "./pages/hospital/AdminHospital";
import AdminCreateHospital from "./pages/hospital/AdminCreateHospital";
import AdminUpdateHospital from "./pages/hospital/AdminUpdateHospital";
import AdminNurse from "./pages/nurse/AdminNurse";
import AdminCreateNurse from "./pages/nurse/AdminCreateNurse";
import AdminUpdateNurse from "./pages/nurse/AdminUpdateNurse";
import AdminMedicineCategory from "./pages/medicineCategory/AdminMedicineCategory";
import AdminCreateMedicineCategory from "./pages/medicineCategory/AdminCreateMedicineCategory";
import AdminUpdateMedicineCategory from "./pages/medicineCategory/AdminUpdateMedicineCategory";
import AdminLabtestCategory from "./pages/labtestCategory/AdminLabtestCategory";
import AdminCreateLabtestCategory from "./pages/labtestCategory/AdminCreatelabtestCategory";
import AdminUpdateLabtestCategory from "./pages/labtestCategory/AdminUpdateLabtestCategory";
import AdminManufacturer from "./pages/manufacturer/AdminManufacturer";
import AdminCreateManufacturer from "./pages/manufacturer/AdminCreateManufacturer";
import AdminUpdateManufacturer from "./pages/manufacturer/AdminUpdateManufacturer";
import AdminMedicine from "./pages/medicine/AdminMedicine";
import AdminCreateMedicine from "./pages/medicine/AdminCreateMedicine";
import AdminUpdateMedicine from "./pages/medicine/AdminUpdateMedicine";
import AdminLabtest from "./pages/labtest/AdminLabtest";
import AdminCreateLabtest from "./pages/labtest/AdminCreateLabtest";
import AdminUpdateLabtest from "./pages/labtest/AdminUpdateLabtest";
import AdminLab from "./pages/lab/AdmimLab";
import AdminCreateLab from "./pages/lab/AdminCreateLab";
import AdminUpdateLab from "./pages/lab/AdminUpdateLab";
import AdminDoctorAppointment from "./pages/doctorAppointment/AdminDoctorAppointment";
import AdminShowDoctorAppointment from "./pages/doctorAppointment/AdminShowDoctorAppointment";
import AdminShowNurseAppointment from "./pages/nurseAppointment/AdminShowNurseAppointment";
import AdminNurseAppointment from "./pages/nurseAppointment/AdminNurseAppointment";
import AdminContactUs from "./pages/contactUs/AdminContactUs";
import AdminContactUsShow from "./pages/contactUs/AdminShowContactUs";
import AdminCreateUser from "./pages/user/AdminCreateUser";
import AdminUpdateUser from "./pages/user/AdminUpdateUser";
import AdminUser from "./pages/user/AdminUser";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ForgetPasswordPage1 from "./pages/ForgetPasswordPage1";
import ForgetPasswordPage2 from "./pages/ForgetPasswordPage2";
import ForgetPasswordPage3 from "./pages/ForgetPasswordPage3";
import LoginPage from "./pages/LoginPage";
import AdminTestimonial from "./pages/testimonial/AdminTestimonial";
import AdminCreateTestimonial from "./pages/testimonial/AdminCreateTestimonial";
import AdminUpdateTestimonial from "./pages/testimonial/AdminUpdateTestimonial";

export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    window.innerWidth > 992,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarExpanded(window.innerWidth > 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <MainContent
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded((prev) => !prev)}
      />
    </BrowserRouter>
  );
}

function MainContent({ isSidebarExpanded, toggleSidebar }) {
  return (
    <div
      className={`app-container ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}
    >
      <AdminSidebar isExpanded={isSidebarExpanded} />
      <AdminNavbar toggleSidebar={toggleSidebar} />

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgetPassword-1" element={<ForgetPasswordPage1 />} />
          <Route path="/forgetPassword-2" element={<ForgetPasswordPage2 />} />
          <Route path="/forgetPassword-3" element={<ForgetPasswordPage3 />} />
          <Route path="/" element={<Home />} />

          <Route path="/specialization" element={<AdminSpecialization />} />
          <Route
            path="/specialization/create"
            element={<AdminCreateSpecialization />}
          />
          <Route
            path="/specialization/update/:_id"
            element={<AdminUpdateSpecialization />}
          />

          <Route path="/doctor" element={<AdminDoctor />} />
          <Route path="/doctor/create" element={<AdminCreateDoctor />} />
          <Route path="/doctor/update/:_id" element={<AdminUpdateDoctor />} />

          <Route path="/hospital" element={<AdminHospital />} />
          <Route path="/hospital/create" element={<AdminCreateHospital />} />
          <Route
            path="/hospital/update/:_id"
            element={<AdminUpdateHospital />}
          />

          <Route path="/nurse" element={<AdminNurse />} />
          <Route path="/nurse/create" element={<AdminCreateNurse />} />
          <Route path="/nurse/update/:_id" element={<AdminUpdateNurse />} />

          <Route path="/medicineCategory" element={<AdminMedicineCategory />} />
          <Route
            path="/medicineCategory/create"
            element={<AdminCreateMedicineCategory />}
          />
          <Route
            path="/medicineCategory/update/:_id"
            element={<AdminUpdateMedicineCategory />}
          />

          <Route path="/medicine" element={<AdminMedicine />} />
          <Route path="/medicine/create" element={<AdminCreateMedicine />} />
          <Route
            path="/medicine/update/:_id"
            element={<AdminUpdateMedicine />}
          />

          <Route path="/labtestCategory" element={<AdminLabtestCategory />} />
          <Route
            path="/labtestCategory/create"
            element={<AdminCreateLabtestCategory />}
          />
          <Route
            path="/labtestCategory/update/:_id"
            element={<AdminUpdateLabtestCategory />}
          />

          <Route path="/manufacturer" element={<AdminManufacturer />} />
          <Route
            path="/manufacturer/create"
            element={<AdminCreateManufacturer />}
          />
          <Route
            path="/manufacturer/update/:_id"
            element={<AdminUpdateManufacturer />}
          />

          <Route path="/lab" element={<AdminLab />} />
          <Route path="/lab/create" element={<AdminCreateLab />} />
          <Route path="/lab/update/:_id" element={<AdminUpdateLab />} />

          <Route path="/labtest" element={<AdminLabtest />} />
          <Route path="/labtest/create" element={<AdminCreateLabtest />} />
          <Route path="/labtest/update/:_id" element={<AdminUpdateLabtest />} />

          <Route path="/testimonial" element={<AdminTestimonial />} />
                    <Route path="/testimonial/create" element={<AdminCreateTestimonial />} />
                    <Route path="/testimonial/update/:_id" element={<AdminUpdateTestimonial />} />

          <Route
            path="/doctorAppointment"
            element={<AdminDoctorAppointment />}
          />
          <Route
            path="/doctorAppointment/view/:_id"
            element={<AdminShowDoctorAppointment />}
          />

          <Route path="/nurseAppointment" element={<AdminNurseAppointment />} />
          <Route
            path="/nurseAppointment/view/:_id"
            element={<AdminShowNurseAppointment />}
          />

          {/* ContactUS Routes */}
          <Route path="/contactus" element={<AdminContactUs />} />
          <Route path="/contactus/view/:_id" element={<AdminContactUsShow />} />

          <Route path="/user" element={<AdminUser />} />
          <Route path="/user/create" element={<AdminCreateUser />} />
          <Route path="/user/update/:_id" element={<AdminUpdateUser />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
}
