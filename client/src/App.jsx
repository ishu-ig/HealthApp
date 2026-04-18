import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'
import ServicePage from './Pages/ServicePage'
import ContactUsPage from './Pages/ContactUsPage'
import FeaturePage from './Pages/FeaturePage'
import DoctorsPage from './Pages/DoctorsPage'
import TestimonialPage from './Pages/TestimonialPage'
import MedicinePage from './Pages/MedicinePage'
import LabtestPage from './Pages/LabtestPage'
import NursePage from './Pages/NursePage'
import MedicineShopPage from './Pages/MedicineShopPage'
import LabtestShopPage from './Pages/LabtestShopPage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import MedicineDetailPage from './Pages/MedicineDetailPage'
import LabtestDetailPage from './Pages/LabtestDetailPage'
import DoctorDetailPage from './Pages/DoctorDetailPage'
import ProfilePage from './Pages/ProfilePage'
import UpdateProfilePage from './Pages/UpdateProfilePage'
import NurseDetailPage from './Pages/NurseDetailPage'
import AppointmentPage from './Pages/AppointmentPage'
import MedicineCartPage from './Pages/MedicineCartPage'
import LabtestCartPage from './Pages/LabtestCartPage'
import CheckoutPage from './Pages/CheckoutPage'
import ConfirmationPage from './Pages/ConfirmationPage'
import CartPage from './Pages/CartPage'
import OrderPage from './Pages/OrderPage'
import BookingOrderPage from './Pages/BookingOrderPage'
import ForgetPasswordPage1 from './Pages/ForgetPasswordPage1'
import ForgetPasswordPage2 from './Pages/ForgetPasswordPage2'
import ForgetPasswordPage3 from './Pages/ForgetPasswordPage3'
import MedicineWishlistPage from './Pages/MedicineWishlistPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/'            element={<HomePage />} />
        <Route path='/about'       element={<AboutPage />} />
        <Route path='/services'    element={<ServicePage />} />
        <Route path='/features'    element={<FeaturePage />} />
        <Route path='/testimonials' element={<TestimonialPage />} />
        <Route path='/contactus'   element={<ContactUsPage />} />
        <Route path='/appointment' element={<AppointmentPage />} />
        <Route path='/profile'     element={<ProfilePage />} />
        <Route path='/update-profile' element={<UpdateProfilePage />} />
        <Route path='/signup'      element={<SignupPage />} />
        <Route path='/login'       element={<LoginPage />} />
        <Route path='/confirmation' element={<ConfirmationPage />} />
        <Route path='/cart'        element={<CartPage />} />
        <Route path='/order'       element={<OrderPage />} />

        {/* Doctors */}
        <Route path='/doctors'     element={<DoctorsPage />} />
        <Route path='/doctors/:_id' element={<DoctorDetailPage />} />

        {/* Nurse */}
        <Route path='/nurse'       element={<NursePage />} />
        <Route path='/nurse/:_id'  element={<NurseDetailPage />} />

        {/* Medicine — IMPORTANT: specific routes (/cart, /shop) MUST come before /:_id */}
        <Route path='/medicine'         element={<MedicinePage />} />
        <Route path='/medicine/shop'    element={<MedicineShopPage />} />
        <Route path='/medicine/cart'    element={<MedicineCartPage />} />
        <Route path='/medicine/:_id'    element={<MedicineDetailPage />} />
        <Route path='/medicine/wishlist' element={MedicineWishlistPage} />

        {/* Labtest — same rule: /cart and /shop before /:_id */}
        <Route path='/labtest'          element={<LabtestPage />} />
        <Route path='/labtest/shop'     element={<LabtestShopPage />} />
        <Route path='/labtest/cart'     element={<LabtestCartPage />} />
        <Route path='/labtest/:_id'     element={<LabtestDetailPage />} />

        {/* Checkout — single route, no duplicate */}
        <Route path='/checkout/:category' element={<CheckoutPage />} />

        {/* Orders */}
        <Route path='/order/:category' element={<BookingOrderPage />} />

        {/* Forget password */}
        <Route path='/forgetPassword-1' element={<ForgetPasswordPage1 />} />
        <Route path='/forgetPassword-2' element={<ForgetPasswordPage2 />} />
        <Route path='/forgetPassword-3' element={<ForgetPasswordPage3 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}