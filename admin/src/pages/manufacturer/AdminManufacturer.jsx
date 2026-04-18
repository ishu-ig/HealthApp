import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

import { deleteManufacturer, getManufacturer } from "../../Redux/ActionCreators/ManufacturerActionCreators";

export default function AdminManufacturer() {
    let ManufacturerStateData = useSelector(state => state.ManufacturerStateData);
    let dispatch = useDispatch();
    let [flag, setFlag] = useState(false);

    function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteManufacturer({ _id }));
            getAPIData();
            setFlag(!flag);
        }
    }

    function getAPIData() {
        dispatch(getManufacturer());

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
    }, [ManufacturerStateData.length]);

    return (
        <>
            <div className="container-fluid">

                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">
                    Manufacturer
                    <Link to="/manufacturer/create">
                        <i className="fa fa-plus text-light float-end pt-1"></i>
                    </Link>
                </h5>

                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>License</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Active</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ManufacturerStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.companyName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.licenseNumber}</td>
                                    <td>{item.city}</td>
                                    <td>{item.state}</td>

                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                        {item.active ? "Yes" : "No"}
                                    </td>

                                    <td>
                                        <Link to={`/manufacturer/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                            <i className="fa fa-edit"></i>
                                        </Link>
                                    </td>

                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash"></i>
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