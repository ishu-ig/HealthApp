import React, { useEffect, useState } from 'react';
import { data, Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

export default function AdminUser() {
    let [UserStateData, setUserStateData] = useState([])
    async function deleteRecord(_id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${_id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            })
            response = await response.json()
            getAPIData();
        }
    }

    async function updateRecord(_id) {
        let item = UserStateData.find(x => x._id === _id);

        if (!item) return;

        if (item.role === "Super Admin") {
            alert("You cannot change the status of a Super Admin.");
            return;
        }

        if (window.confirm("Are you sure you want to update the status?")) {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${_id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem("token")
                },
                body: JSON.stringify({ ...item, active: !item.active })
            });

            response = await response.json();
            getAPIData();
        }
    }

    async function getAPIData() {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
        response = await response.json()
        setUserStateData(response.data)
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
    }, [UserStateData.length]);

    return (
        <>
            <div className="container-fluid">
                {/* Header */}
                <h5 className="text-center text-light bg-primary p-3">User {localStorage.getItem("role") === "Super Admin" ? <Link to="/user/create"><i className="fa fa-plus text-light float-end pt-1"></i></Link> : null}</h5>
                {/* Table */}
                <div className="table-responsive mt-3">
                    <table id="DataTable" className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Active</th>
                                {localStorage.getItem("role") === "Super Admin" ? <th>Update</th> : ""}
                                {localStorage.getItem("role") === "Super Admin" ? <th>Delete</th> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {UserStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.role}</td>
                                    <td className={item.active ? 'text-success fw-bold' : 'text-danger fw-bold'} onClick={() => updateRecord(item._id)} style={{ cursor: "pointer" }}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    {
                                        localStorage.getItem("role") === "Super Admin" ? <td className='text-center'>
                                            {
                                                item.role === "Buyer" ? "N/A" : <Link to={`/user/update/${item._id}`} className="btn btn-primary text-light btn-sm">
                                                    <i className="fa fa-edit fs-5"></i>
                                                </Link>
                                            }
                                        </td> : ""
                                    }
                                    {
                                        localStorage.getItem("role") === "Super Admin" ? <td>
                                            {
                                                item.role === "Buyer" ? "N/A" :
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(item._id)}>
                                                        <i className="fa fa-trash fs-5"></i>
                                                    </button>
                                            }
                                        </td> : ""
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
