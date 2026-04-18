import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    deleteContactUs,
    getContactUs,
    updateContactUs,
} from "../../Redux/ActionCreators/ContactUsActionCreators";

export default function AdminContactUsShow() {
    const { _id } = useParams();
    const ContactUsStateData = useSelector((state) => state.ContactUsStateData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({});

    function deleteRecord() {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteContactUs({ _id }));
            navigate("/admin/contactus");
        }
    }

    // FIX 1: Don't accept _id as a parameter — use the one from useParams via `data`
    // FIX 2: Removed direct state mutation (ContactUsStateData[index].active = ...)
    // FIX 3: Removed flag/setFlag hack — let Redux + useEffect sync the local state
    function updateRecord() {
        if (window.confirm("Are you sure you want to update the status?")) {
            dispatch(updateContactUs({ ...data, active: !data.active }));
        }
    }

    useEffect(() => {
        dispatch(getContactUs());
    }, [dispatch]);

    // FIX 4: Separate useEffect to sync local `data` state from Redux store
    // This re-runs whenever the Redux store updates (e.g. after updateRecord dispatches)
    useEffect(() => {
        if (ContactUsStateData.length > 0) {
            const item = ContactUsStateData.find((x) => x._id === _id);
            if (item) {
                setData({ ...item });
            } else {
                alert("Invalid Contact Us ID");
                navigate("/admin/contactus");
            }
        }
    }, [ContactUsStateData, _id]);

    // FIX 5: phone is a number, not a date — removed incorrect new Date() conversion
    return (
        <>
            <div className="container-fluid">
                <div className="card shadow-lg border-primary">
                    <div className="card-header bg-primary text-light">
                        <h5 className="mb-0 text-light text-center">
                            Customer Query
                            <Link to="/admin/contactus">
                                <i className="fa fa-arrow-left text-light float-end"></i>
                            </Link>
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Id</th>
                                        <td>{data._id}</td>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <td>{data.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{data.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{data.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Subject</th>
                                        <td>{data.subject}</td>
                                    </tr>
                                    <tr>
                                        <th>Message</th>
                                        <td>{data.message}</td>
                                    </tr>
                                    <tr>
                                        <th>Active</th>
                                        <td
                                            className={
                                                data.active
                                                    ? "text-success fw-bold"
                                                    : "text-danger fw-bold"
                                            }
                                        >
                                            {data.active ? "Yes" : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            {data.active ? (
                                                // FIX 1 (applied): onClick calls updateRecord with no args
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={updateRecord}
                                                >
                                                    Update Status
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-danger w-100"
                                                    onClick={deleteRecord}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}