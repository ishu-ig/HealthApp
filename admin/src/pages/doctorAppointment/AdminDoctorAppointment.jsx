import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import { getDoctorAppointment} from '../../Redux/ActionCreators/DoctorAppointmentActionCreators';

export default function AdminDoctorAppointment() {
    let DoctorAppointmentStateData = useSelector((state) => state.DoctorAppointmentStateData);
    let dispatch = useDispatch();

    function getAPIData() {
        dispatch(getDoctorAppointment());

        setTimeout(() => {
            if (!$.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable();
            }
        }, 500);
    }

    useEffect(() => {
        getAPIData();
        return () => {
            if ($.fn.dataTable.isDataTable("#DataTable")) {
                $("#DataTable").DataTable().destroy();
            }
        };
    }, [DoctorAppointmentStateData.length]);

    return (
        <>
            <div className="container-fluid">
                <h5 className="bg-primary text-light text-center p-2">Doctor Appointments</h5>
                <div className="table-responsive">
                    <table id="DataTable" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Doctor</th>
                                <th>Hospital</th>
                                <th>Patient</th>
                                <th>Service Type</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th>Reporting Time</th>
                                <th>Mode</th>
                                <th>Fees</th>
                                <th>Status</th>
                                <th>Payment Status</th>
                                <th>Payment Mode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DoctorAppointmentStateData?.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.doctor?.name}</td>
                                    <td>{item.hospital?.name || "N/A"}</td>
                                    <td>{item.user?.name}</td>
                                    <td>{item.serviceType}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.appointmentTime || "N/A"}</td>
                                    <td>{item.reportingTime || "N/A"}</td>
                                    <td>{item.appointmentMode}</td>
                                    <td>₹{item.fees}</td>
                                    <td>
                                        <span className={`badge fs-6 ${
                                            item.status === "Completed" ? "text-success" :
                                            item.status === "Cancelled" ? "text-danger" :
                                            item.status === "Accepted" ? "text-primary" :
                                            item.status === "In Progress" ? "text-warning" :
                                            "text-secondary"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge fs-6 ${item.paymentStatus === "Pending" ? "text-danger" : item.paymentStatus === "Failed" ? "text-warning" : "text-success"}`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{item.paymentMode}</td>
                                    <td>
                                        <Link
                                            to={`/doctorAppointment/view/${item._id}`}
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