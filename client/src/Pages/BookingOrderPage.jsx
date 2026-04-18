import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
// import Profile from '../Components/Profile';
import { getMedicineCheckout } from '../Redux/ActionCreators/MedicineCheckoutActionCreators';
import { getLabtestCheckout } from '../Redux/ActionCreators/LabtestCheckoutActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Order from '../Components/Order';
import { getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import { getNurseAppointment } from '../Redux/ActionCreators/NurseAppointmentActionCreators';

export default function BookingOrderPage() {
    const { category } = useParams(); // fixed: destructure properly
    const dispatch = useDispatch();

    const CheckoutStateData = useSelector(state => state.CheckoutStateData);
    const LabtestCheckoutStateData = useSelector(state => state.LabtestCheckoutStateData);
    const DoctorAppointmentStateData = useSelector(state => state.DoctorAppointmentStateData);
    const NurseAppointmentStateData = useSelector(state => state.NurseAppointmentStateData);

    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getMedicineCheckout());
        dispatch(getLabtestCheckout());
        dispatch(getDoctorAppointment());
        dispatch(getNurseAppointment());
    }, [dispatch]);

   useEffect(() => {
    const userid = localStorage.getItem("userid");

    if (category === "medicine" && CheckoutStateData?.length > 0) {
        const filtered = CheckoutStateData.filter(x => x.user === userid);
        setOrder(filtered);
    } else if (category === "labtest" && LabtestCheckoutStateData?.length > 0) {
        const filtered = LabtestCheckoutStateData.filter(x => x.user === userid);
        setOrder(filtered);
    } else if (category === "doctor" && DoctorAppointmentStateData?.length > 0) {
        const filtered = DoctorAppointmentStateData.filter(x => x.user === userid);
        setOrder(filtered);
    } else if (category === "nurse" && NurseAppointmentStateData?.length > 0) {
        const filtered = NurseAppointmentStateData.filter(x => x.user === userid);
        setOrder(filtered);
    }

    setLoading(false);
}, [CheckoutStateData, LabtestCheckoutStateData, DoctorAppointmentStateData, NurseAppointmentStateData, category]);


    return (
        <>
            <HeroSection title={(category === "medicine" || category === "labtest") ? "Orders" : "Bookings"} />
            <div className="container-fluid">
                <div className="container-fluid card p-5" style={{ backgroundColor: '#F8F8F8' }}>
                    <div className="row">

                        {loading ? (
                            <div className="text-center py-5">
                                <h4>Loading your order...</h4>
                            </div>
                        ) : (
                            category === "medicine" ?
                                <Order title="medicine" data={order} /> : category === "labtest" ?
                                    <Order title="labtest" data={order} /> : category === "doctor" ?
                                        <Order title="doctor" data={order} /> : <Order title="nurse" data={order} />
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
