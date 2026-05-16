import React, { useEffect } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators'
import Order from '../Components/Order'

export default function DoctorAppointmentPage() {
    let DoctorAppointmentStateData = useSelector(state => state.DoctorAppointmentStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getDoctorAppointment())
    }, [DoctorAppointmentStateData.length])

    return (
        <>
            <HeroSection title="Doctor Appointments" />
            <Order title="DoctorAppointment" data={DoctorAppointmentStateData} />
        </>
    )
}