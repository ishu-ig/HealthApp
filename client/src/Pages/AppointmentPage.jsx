import React from 'react'
import Appointment from '../Components/Appointment'
import HeroSection from '../Components/HeroSection'

export default function AppointmentPage() {
  return (
    <>
    <HeroSection title="Book Appointment" />
      <div className="container my-3">
        {/* Specialization Selector */}
        <div className="mb-3 d-flex justify-content-end">
          <label htmlFor="specialization-select" className="me-2 fw-semibold align-self-center">Booking:</label>
          <select
            id="specialization-select"
            className="form-select border-primary rounded"
            style={{ width: '200px' }}
            // onChange={handleSelection}
            defaultValue=""
          >
            <option value="" disabled>Select Specialization</option>
            <option value="/medicine/cart">Doctor</option>
            <option value="/labtest/cart">Nurse</option>
          </select>
        </div>
        <Appointment />
      </div>
    </>
  )
}
