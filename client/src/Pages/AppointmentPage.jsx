import React from 'react'
import Appointment from '../Components/Appointment'
import HeroSection from '../Components/HeroSection'

export default function AppointmentPage() {
  return (
    <>
    <HeroSection title="Book Appointment" />
      <div>
        <Appointment />
      </div>
    </>
  )
}
