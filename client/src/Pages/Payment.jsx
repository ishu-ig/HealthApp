import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getCheckout }            from "../Redux/ActionCreators/CheckoutActionCreators";
import { getLabtestCheckout }     from "../Redux/ActionCreators/LabtestCheckoutActionCreators";
import { getMedicineCheckout }    from "../Redux/ActionCreators/MedicineCheckoutActionCreators";
import { getDoctorAppointment }   from "../Redux/ActionCreators/DoctorAppointmentActionCreators";
import { getNurseAppointment }    from "../Redux/ActionCreators/NurseAppointmentActionCreators";

import HeroSection from "../Components/HeroSection";

// ─── Per-type config ────────────────────────────────────────────────────────
// Centralised so adding a new type only requires one entry here.
const TYPE_CONFIG = {
    checkout: {
        getter:        getCheckout,
        stateKey:      "CheckoutStateData",
        amountField:   "total",
        orderURL:      "/api/checkout/order",
        verifyURL:     "/api/checkout/verify",
        confirmRoute:  "/confirmation/checkout",
    },
    labtestCheckout: {
        getter:        getLabtestCheckout,
        stateKey:      "LabtestCheckoutStateData",
        amountField:   "total",
        orderURL:      "/api/labtestCheckout/order",
        verifyURL:     "/api/labtestCheckout/verify",
        confirmRoute:  "/confirmation/labtestCheckout",
    },
    medicineCheckout: {
        getter:        getMedicineCheckout,
        stateKey:      "MedicineCheckoutStateData",
        amountField:   "total",
        orderURL:      "/api/medicineCheckout/order",
        verifyURL:     "/api/medicineCheckout/verify",
        confirmRoute:  "/confirmation/medicineCheckout",
    },
    doctorAppointment: {
        getter:        getDoctorAppointment,
        stateKey:      "DoctorAppointmentStateData",
        amountField:   "fees",
        orderURL:      "/api/doctorAppointment/order",
        verifyURL:     "/api/doctorAppointment/verify",
        confirmRoute:  "/confirmation/doctorAppointment",
    },
    nurseAppointment: {
        getter:        getNurseAppointment,
        stateKey:      "NurseAppointmentStateData",
        amountField:   "fees",
        orderURL:      "/api/nurseAppointment/order",
        verifyURL:     "/api/nurseAppointment/verify",
        confirmRoute:  "/confirmation/nurseAppointment",
    },
};

// ─── Friendly labels for the UI ─────────────────────────────────────────────
const TYPE_LABEL = {
    checkout:          "Product Order",
    labtestCheckout:   "Lab Test Booking",
    medicineCheckout:  "Medicine Order",
    doctorAppointment: "Doctor Appointment",
    nurseAppointment:  "Nurse Appointment",
};

export default function Payment() {
    const [data, setData] = useState(null);

    const { Razorpay } = useRazorpay();
    const navigate     = useNavigate();
    const { type, _id } = useParams();
    const dispatch     = useDispatch();

    // Pull all relevant slices — only the one matching `type` will actually be used
    const CheckoutStateData          = useSelector((s) => s.CheckoutStateData);
    const LabtestCheckoutStateData   = useSelector((s) => s.LabtestCheckoutStateData);
    const MedicineCheckoutStateData  = useSelector((s) => s.MedicineCheckoutStateData);
    const DoctorAppointmentStateData = useSelector((s) => s.DoctorAppointmentStateData);
    const NurseAppointmentStateData  = useSelector((s) => s.NurseAppointmentStateData);

    // Map state key → slice so we can look up dynamically
    const stateMap = {
        CheckoutStateData,
        LabtestCheckoutStateData,
        MedicineCheckoutStateData,
        DoctorAppointmentStateData,
        NurseAppointmentStateData,
    };

    const config = TYPE_CONFIG[type];

    // Fetch the correct slice on mount
    useEffect(() => {
        if (!config) return;
        dispatch(config.getter());
    }, [type, dispatch]);

    // Sync local `data` whenever the matching Redux slice updates
    useEffect(() => {
        if (!config) return;

        const slice = stateMap[config.stateKey];
        if (!slice?.length) return;

        const record = _id === "-1"
            ? slice[0]
            : slice.find((item) => item._id === _id);

        if (record) {
            setData(record);
        }
    }, [
        CheckoutStateData,
        LabtestCheckoutStateData,
        MedicineCheckoutStateData,
        DoctorAppointmentStateData,
        NurseAppointmentStateData,
        _id,
        type,
    ]);

    // ── Razorpay payment init ──────────────────────────────────────────────
    const initPayment = (paymentData) => {
        const options = {
            key:       "rzp_test_hPWsSLPsp2DADQ",
            amount:    paymentData.amount,
            currency:  "INR",
            order_id:  paymentData._id,
            prefill: {
                name:    data?.user?.name,
                email:   data?.user?.email,
                contact: data?.user?.phone,
            },
            handler: async (response) => {
                try {
                    const payload = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        checkid: data._id,
                    };

                    let res = await fetch(
                        `${process.env.REACT_APP_BACKEND_SERVER}${config.verifyURL}`,
                        {
                            method:  "POST",
                            headers: {
                                "Content-Type":  "application/json",
                                authorization:   localStorage.getItem("token"),
                            },
                            body: JSON.stringify(payload),
                        }
                    );
                    res = await res.json();

                    if (res.result === "Done") {
                        dispatch(config.getter());
                        navigate(config.confirmRoute);
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                }
            },
            theme: { color: "#3399cc" },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    };

    // ── Create Razorpay order then open checkout ───────────────────────────
    const handlePayment = async () => {
        try {
            const amount = data?.[config.amountField];

            let res = await fetch(
                `${process.env.REACT_APP_BACKEND_SERVER}${config.orderURL}`,
                {
                    method:  "POST",
                    headers: {
                        "Content-Type":  "application/json",
                        authorization:   localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ amount }),
                }
            );
            res = await res.json();
            initPayment(res.data);
        } catch (error) {
            console.error("Order creation error:", error);
        }
    };

    // ── Unknown type guard ─────────────────────────────────────────────────
    if (!config) {
        return (
            <div className="container my-5 text-center text-danger">
                <h5>Invalid payment type: <code>{type}</code></h5>
            </div>
        );
    }

    const amount = data?.[config.amountField];

    return (
        <>
            <HeroSection title="Online Payment" />

            <div className="container my-5 d-flex justify-content-center align-items-center">
                <div
                    className="card shadow-lg p-4 text-center"
                    style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}
                >
                    <h4 className="fw-bold text-primary mb-1">Complete Your Payment</h4>
                    <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                        {TYPE_LABEL[type]}
                    </p>

                    {data ? (
                        <>
                            <p className="text-muted">
                                Amount Due:{" "}
                                <span className="fw-bold text-dark">₹{amount}</span>
                            </p>
                            <button
                                onClick={handlePayment}
                                className="btn btn-success w-100 py-2 fw-bold"
                            >
                                <i className="fas fa-credit-card me-2"></i>Pay Now
                            </button>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ height: "100px" }}></div>
        </>
    );
}