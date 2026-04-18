import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import { getNurseAppointment } from '../../Redux/ActionCreators/NurseAppointmentActionCreators';

export default function AdminNurseAppointment() {
    const NurseAppointmentStateData = useSelector((state) => state.NurseAppointmentStateData);
    const dispatch = useDispatch();
    const tableInitialized = useRef(false);

    // Fetch once on mount
    useEffect(() => {
        dispatch(getNurseAppointment());
    }, [dispatch]);

    // Reinitialize DataTable whenever data changes
    useEffect(() => {
        if (NurseAppointmentStateData.length === 0) return;

        const timer = setTimeout(() => {
            if ($.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable().destroy();
                tableInitialized.current = false;
            }
            if (!tableInitialized.current) {
                $("#DataTable").DataTable();
                tableInitialized.current = true;
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [NurseAppointmentStateData]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if ($.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable().destroy();
                tableInitialized.current = false;
            }
        };
    }, []);

    return (
        <>
            <div className="container-fluid">
                <h5 className="bg-primary text-light text-center p-2">Nurse Appointments</h5>
                <div className="table-responsive">
                    <table id="DataTable" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nurse</th>
                                <th>Hospital</th>
                                <th>Patient</th>
                                <th>Service Type</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th>Duration (hrs)</th>
                                <th>Fees</th>
                                <th>Status</th>
                                <th>Payment Status</th>
                                <th>Payment Mode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NurseAppointmentStateData?.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.nurse?.name}</td>
                                    <td>{item.hospital?.name || "N/A"}</td>
                                    <td>{item.user?.name}</td>
                                    <td>{item.serviceType}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.appointmentTime || "N/A"}</td>
                                    <td>{item.duration ?? "N/A"}</td>
                                    <td>₹{item.fees}</td>
                                    <td>
                                        <span className={`badge fs-6 ${
                                            item.status === "Completed"   ? "text-success"   :
                                            item.status === "Cancelled"   ? "text-danger"    :
                                            item.status === "Accepted"    ? "text-primary"   :
                                            item.status === "In Progress" ? "text-warning"   :
                                            "text-secondary"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge fs-6 ${
                                            item.paymentStatus === "Pending" ? "text-danger"  :
                                            item.paymentStatus === "Failed"  ? "text-warning" :
                                            "text-success"
                                        }`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{item.paymentMode}</td>
                                    <td>
                                        <Link
                                            to={`/nurseAppointment/view/${item._id}`}
                                            className="btn btn-primary text-light"
                                            style={{ borderRadius: 8 }}
                                        >
                                            <i className="fa fa-eye fs-5 pt-1"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}