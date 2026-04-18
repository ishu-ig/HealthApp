import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
    getDoctorAppointment,
    updateDoctorAppointment,
} from "../../Redux/ActionCreators/DoctorAppointmentActionCreators";

export default function AdminShowDoctorAppointment() {
    let { _id } = useParams();
    let DoctorAppointmentStateData = useSelector((state) => state.DoctorAppointmentStateData);
    let dispatch = useDispatch();

    let [data, setData] = useState({});
    let [paymentStatus, setPaymentStatus] = useState("");
    let [status, setStatus] = useState("");
    let [reportingTime, setReportingTime] = useState("");
    let [flag, setFlag] = useState(false);

    useEffect(() => {
        (async () => {
            dispatch(getDoctorAppointment());
            if (DoctorAppointmentStateData.length) {
                let item = DoctorAppointmentStateData.find((x) => x._id === _id);
                if (item) {
                    setData({ ...item });
                    setPaymentStatus(item.paymentStatus);
                    setStatus(item.status);
                    setReportingTime(item.reportingTime || "");
                } else {
                    alert("Invalid Appointment ID");
                }
            }
        })();
    }, [DoctorAppointmentStateData.length]);

    function updateRecord() {
        if (window.confirm("Are you sure you want to update this appointment?")) {
            const updated = {
                ...data,
                paymentStatus,
                status,
                reportingTime,
            };
            dispatch(updateDoctorAppointment(updated));
            setFlag(!flag);
        }
    }

    // Show update controls only when appointment is not yet Completed or Cancelled
    const canEdit = data.status !== "Completed" && data.status !== "Cancelled";

    return (
        <>
            <div className="container-fluid">
                {/* Appointment Details */}
                <div className="card shadow-lg border-primary">
                    <div className="card-header bg-primary text-light">
                        <h5 className="mb-0 text-light text-center">
                            Appointment Details
                            <Link to="/doctor-appointment">
                                <i className="fa fa-arrow-left text-light float-end"></i>
                            </Link>
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Appointment ID</th>
                                        <td>{data._id}</td>
                                    </tr>
                                    <tr>
                                        <th>Doctor</th>
                                        <td>{data.doctor?.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Hospital</th>
                                        <td>{data.hospital?.name || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Service Type</th>
                                        <td>{data.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <th>Appointment Date</th>
                                        <td>{data.date ? new Date(data.date).toLocaleDateString() : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Appointment Time</th>
                                        <td>{data.appointmentTime || "N/A"}</td>
                                    </tr>

                                    {/* Reporting Time */}
                                    <tr>
                                        <th>Reporting Time</th>
                                        <td>
                                            {canEdit ? (
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={reportingTime}
                                                    onChange={(e) => setReportingTime(e.target.value)}
                                                />
                                            ) : (
                                                reportingTime || "N/A"
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Appointment Mode</th>
                                        <td>{data.appointmentMode}</td>
                                    </tr>
                                    <tr>
                                        <th>Fees</th>
                                        <td>₹{data.fees}</td>
                                    </tr>

                                    {/* Appointment Status */}
                                    <tr>
                                        <th>Appointment Status</th>
                                        <td className={`fw-bold ${
                                            status === "Completed" ? "text-success" :
                                            status === "Cancelled" ? "text-danger" :
                                            status === "Accepted" ? "text-primary" :
                                            status === "In Progress" ? "text-warning" :
                                            "text-secondary"
                                        }`}>
                                            {canEdit ? (
                                                <select
                                                    className="form-select"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            ) : (
                                                status
                                            )}
                                        </td>
                                    </tr>

                                    {/* Payment Mode */}
                                    <tr>
                                        <th>Payment Mode</th>
                                        <td>{data.paymentMode}</td>
                                    </tr>

                                    {/* Payment Status */}
                                    <tr>
                                        <th>Payment Status</th>
                                        <td className={`fw-bold ${
                                            data.paymentStatus === "Pending" ? "text-danger" :
                                            data.paymentStatus === "Failed" ? "text-warning" :
                                            "text-success"
                                        }`}>
                                            {canEdit && data.paymentStatus !== "Done" ? (
                                                <select
                                                    className="form-select mt-2"
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Done">Done</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            ) : (
                                                data.paymentStatus
                                            )}
                                        </td>
                                    </tr>

                                    {/* Razorpay Payment ID */}
                                    {data.rppid && (
                                        <tr>
                                            <th>Razorpay Payment ID</th>
                                            <td>{data.rppid}</td>
                                        </tr>
                                    )}

                                    <tr>
                                        <th>Created At</th>
                                        <td>{data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}</td>
                                    </tr>

                                    {canEdit && (
                                        <tr>
                                            <td colSpan={2}>
                                                <button
                                                    className="btn btn-primary w-100 text-light"
                                                    onClick={updateRecord}
                                                >
                                                    Update Appointment
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Patient Details */}
                <div className="card shadow-lg mt-4 border-secondary">
                    <div className="card-header bg-primary text-light">
                        <h5 className="text-center text-light">Patient Details</h5>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{data.user?.name}</td>
                                </tr>
                                <tr>
                                    <th>Contact No</th>
                                    <td>{data.user?.phone}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>
                                        {data.user?.city} / {data.user?.state} / {data.user?.pin}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}