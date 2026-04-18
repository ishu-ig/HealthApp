import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteHospital, getHospital } from "../../Redux/ActionCreators/HospitalActionCreators";

export default function AdminHospital() {
    let HospitalStateData = useSelector(state => state.HospitalStateData);
    let dispatch = useDispatch();
    let [flag ,setFlag] = useState(false)

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteHospital({ _id: _id }));
            getAPIData();
            setFlag(!flag)
        }
    }

    function getAPIData() {
        dispatch(getHospital());
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
    }, [HospitalStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">Hospital <Link to="/Hospital/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link></h5>
                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Accreditation</th>
                                <th>Address</th>
                                <th>Departments</th>
                                <th>Pic</th>
                                <th>Active</th>
                                <th>Update</th>
                                {/* {localStorage.getItem("role")==="Super Admin" ? <th>Delete</th>:""} */}
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {HospitalStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.accreditation}</td>
                                    <td>{item.address},{item.city},{item.state}</td>
                                    <td>
                                      <ul className="mb-0">
                                        {Array.isArray(item.departments) ? (
                                          item.departments.map((d, index) => (
                                            <li key={index}>{d}</li>
                                          ))
                                        ) : (
                                          <li>No Departments</li>
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
                                        <Link to={`/hospital/update/${item._id}`} className="btn btn-primary text-light btn-sm">
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

