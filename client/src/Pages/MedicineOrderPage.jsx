import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicineCheckout } from '../Redux/ActionCreators/MedicineCheckoutActionCreators'
import { getLabtestCheckout } from '../Redux/ActionCreators/LabtestCheckoutActionCreators'
import { getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators'
import { getNurseAppointment } from '../Redux/ActionCreators/NurseAppointmentActionCreators'
import Order from '../Components/Order'

const TABS = [
    { key: 'MedicineOrder',      label: 'Medicine Orders',      icon: 'fa-pills' },
    { key: 'LabtestOrder',       label: 'Lab Test Bookings',    icon: 'fa-flask' },
    { key: 'DoctorAppointment',  label: 'Doctor Appointments',  icon: 'fa-user-md' },
    { key: 'NurseAppointment',   label: 'Nurse Appointments',   icon: 'fa-user-nurse' },
]

export default function OrderPage() {
    let [activeTab, setActiveTab] = useState('MedicineOrder')

    let MedicineCheckoutStateData  = useSelector(state => state.MedicineCheckoutStateData)
    let LabtestCheckoutStateData   = useSelector(state => state.LabtestCheckoutStateData)
    let DoctorAppointmentStateData = useSelector(state => state.DoctorAppointmentStateData)
    let NurseAppointmentStateData  = useSelector(state => state.NurseAppointmentStateData)

    let dispatch = useDispatch()

    useEffect(() => { dispatch(getMedicineCheckout()) },  [MedicineCheckoutStateData.length])
    useEffect(() => { dispatch(getLabtestCheckout()) },   [LabtestCheckoutStateData.length])
    useEffect(() => { dispatch(getDoctorAppointment()) }, [DoctorAppointmentStateData.length])
    useEffect(() => { dispatch(getNurseAppointment()) },  [NurseAppointmentStateData.length])

    const dataMap = {
        MedicineOrder:     MedicineCheckoutStateData,
        LabtestOrder:      LabtestCheckoutStateData,
        DoctorAppointment: DoctorAppointmentStateData,
        NurseAppointment:  NurseAppointmentStateData,
    }

    return (
        <>
            <HeroSection title="My Orders" />

            {/* Tab Bar */}
            <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: '14px 20px',
                                    border: 'none',
                                    borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
                                    background: 'none',
                                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--gray)',
                                    fontWeight: activeTab === tab.key ? 700 : 500,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    transition: 'color 0.2s',
                                }}
                            >
                                <i className={`fa ${tab.icon}`} style={{ fontSize: '0.8rem' }} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Tab Content */}
            <Order title={activeTab} data={dataMap[activeTab]} />
        </>
    )
}