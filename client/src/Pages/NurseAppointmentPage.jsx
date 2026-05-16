import React, { useEffect } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getNurseAppointment } from '../Redux/ActionCreators/NurseAppointmentActionCreators'
import Order from '../Components/Order'

export default function NurseAppointmentPage() {
    let NurseAppointmentStateData = useSelector(state => state.NurseAppointmentStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getNurseAppointment())
    }, [NurseAppointmentStateData.length])

    return (
        <>
            <HeroSection title="Nurse Appointments" />
            <Order title="NurseAppointment" data={NurseAppointmentStateData} />
        </>
    )
}