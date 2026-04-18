import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getNurseAppointment,
    updateNurseAppointment,
} from "../../Redux/ActionCreators/NurseAppointmentActionCreators";

export default function AdminShowNurseAppointment() {
    const { _id } = useParams();
    const NurseAppointmentStateData = useSelector((state) => state.NurseAppointmentStateData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [paymentStatus, setPaymentStatus] = useState("");
    const [status, setStatus] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [duration, setDuration] = useState(1);

    // Fetch once on mount
    useEffect(() => {
        dispatch(getNurseAppointment());
    }, [dispatch]);

    // Sync local state from Redux store whenever store updates
    useEffect(() => {
        if (NurseAppointmentStateData.length > 0) {
            const item = NurseAppointmentStateData.find((x) => x._id === _id);
            if (item) {
                setData({ ...item });
                setPaymentStatus(item.paymentStatus);
                setStatus(item.status);
                setAppointmentTime(item.appointmentTime || "");
                setDuration(item.duration ?? 1);
            } else {
                alert("Invalid Appointment ID");
                navigate("/admin/nurseAppointment");
            }
        }
    }, [NurseAppointmentStateData, _id]);

    function updateRecord() {
        if (window.confirm("Are you sure you want to update this appointment?")) {
            const updated = {
                ...data,
                paymentStatus,
                status,
                appointmentTime,
                duration,
            };
            dispatch(updateNurseAppointment(updated));
        }
    }

    // Editing is allowed only when appointment is not yet Completed or Cancelled
    const canEdit = data.status !== "Completed" && data.status !== "Cancelled";

    return (
        <>
            <div className="container-fluid">

                {/* Appointment Details */}
                <div className="card shadow-lg border-primary">
                    <div className="card-header bg-primary text-light">
                        <h5 className="mb-0 text-light text-center">
                            Nurse Appointment Details
                            <Link to="/admin/nurseAppointment">
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
                                        <th>Nurse</th>
                                        <td>{data.nurse?.name}</td>
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

                                    {/* Appointment Time — editable */}
                                    <tr>
                                        <th>Appointment Time</th>
                                        <td>
                                            {canEdit ? (
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={appointmentTime}
                                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                                />
                                            ) : (
                                                appointmentTime || "N/A"
                                            )}
                                        </td>
                                    </tr>

                                    {/* Duration — editable */}
                                    <tr>
                                        <th>Duration (hrs)</th>
                                        <td>
                                            {canEdit ? (
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min={1}
                                                    value={duration}
                                                    onChange={(e) => setDuration(Number(e.target.value))}
                                                />
                                            ) : (
                                                duration ?? "N/A"
                                            )}
                                        </td>
                                    </tr>

                                    {/* Address from user profile */}
                                    <tr>
                                        <th>Service Address</th>
                                        <td>{data.address || "N/A"}</td>
                                    </tr>

                                    <tr>
                                        <th>Fees</th>
                                        <td>₹{data.fees}</td>
                                    </tr>

                                    {/* Appointment Status — editable */}
                                    <tr>
                                        <th>Appointment Status</th>
                                        <td className={`fw-bold ${
                                            status === "Completed"   ? "text-success"   :
                                            status === "Cancelled"   ? "text-danger"    :
                                            status === "Accepted"    ? "text-primary"   :
                                            status === "In Progress" ? "text-warning"   :
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

                                    {/* Payment Mode — read only (Cash / Net Banking per schema) */}
                                    <tr>
                                        <th>Payment Mode</th>
                                        <td>{data.paymentMode}</td>
                                    </tr>

                                    {/* Payment Status — editable until Done */}
                                    <tr>
                                        <th>Payment Status</th>
                                        <td className={`fw-bold ${
                                            paymentStatus === "Pending" ? "text-danger"  :
                                            paymentStatus === "Failed"  ? "text-warning" :
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
                                                paymentStatus
                                            )}
                                        </td>
                                    </tr>

                                    {/* Razorpay Payment ID — shown only if present */}
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