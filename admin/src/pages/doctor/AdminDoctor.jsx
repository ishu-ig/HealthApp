import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteDoctor, getDoctor } from "../../Redux/ActionCreators/DoctorActionCreators";

export default function AdminDoctor() {
    let DoctorStateData = useSelector(state => state.DoctorStateData);
    let dispatch = useDispatch();
    let [flag ,setFlag] = useState(false)

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteDoctor({ _id: _id }));
            getAPIData();
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getDoctor());
        let time = setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable();
            }
        }, 500);
        return time;
    }

    useEffect(() => {
        let time = getAPIData();
        return () => {
            clearTimeout(time);
            if ($.fn.DataTable.isDataTable('#DataTable')) {
                $('#DataTable').DataTable().destroy();
            }
        };
    }, [DoctorStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">Doctor <Link to="/Doctor/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link></h5>
                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Specialization</th>
                                <th>Hospital</th>
                                <th>Available days</th>
                                <th>Pic</th>
                                <th>Active</th>
                                <th>Update</th>
                                {/* {localStorage.getItem("role")==="Super Admin" ? <th>Delete</th>:""} */}
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DoctorStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                   <td>
                                         {Array.isArray(item.specialization)
                                          ? item.specialization.map(s => s.name).join(", ")
                                             : item.specialization?.name || "N/A"}
                                     </td>

                                     <td>
                                         {Array.isArray(item.hospital)
                                          ? item.hospital.map(s => s.name).join(", ")
                                             : item.hospital?.name || "N/A"}
                                     </td>
                                    <td>
                                      <ul className="mb-0">
                                        {Array.isArray(item.availableDays) ? (
                                          item.availableDays.map((d, index) => (
                                            <li key={index}>{d}</li>
                                          ))
                                        ) : (
                                          <li>No AvailableDays</li>
                                        )}
                                      </ul>
                                    </td>
                                    <td>
                                        <Link to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} target='_blank' rel='noreferrer'>
                                            <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`} height={50} width={80} className="rounded shadow-sm" alt="" />
                                        </Link>
                                    </td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/Doctor/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit fs-5"></i>
                                        </Link>
                                    </td>
                                    {/* {
                                        localStorage.getItem("role")==="Super Admin" ?
                                        <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash fs-5"></i>
                                        </button>
                                    </td>:""
                                    } */}
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash fs-5"></i>
                                        </button>
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

