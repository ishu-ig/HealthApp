import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import { deleteLabtest, getLabtest } from "../../Redux/ActionCreators/LabtestActionCreators";

export default function AdminLabtest() {
    // ✅ Safe fallback to [] prevents _id crash when state is undefined
    let LabtestStateData = useSelector((state) => state.LabtestStateData) || [];
    let dispatch = useDispatch();

    function deleteRecord(_id) {
        if (window.confirm("Are You Sure to Delete that Item?")) {
            dispatch(deleteLabtest({ _id: _id }));
        }
    }

    useEffect(() => {
        dispatch(getLabtest());
    }, [dispatch]);

    // ✅ Initialize DataTable after data loads
    useEffect(() => {
        if (LabtestStateData.length > 0) {
            const table = $("#DataTable").DataTable();
            return () => table.destroy();
        }
    }, [LabtestStateData]);

    return (
        <>
            <div>
                <h5 className="bg-primary text-light text-center p-3">
                    Labtest{" "}
                    <Link to="/labtest/create">
                        <i className="fa fa-plus text-light float-end"></i>
                    </Link>
                </h5>
                <div className="table-responsive">
                    <table
                        id="DataTable"
                        className="table table-striped table-hover table-bordered text-center"
                    >
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Labtest Category</th>
                                <th>Lab</th>
                                <th>Base Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Sample Required</th>
                                <th>Report Time</th>
                                <th>Pic</th>
                                <th>Active</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LabtestStateData.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.name}</td>
                                    {/* ✅ Both are populated objects — use .name */}
                                    <td>{item.labtestCategory?.name || "N/A"}</td>
                                    <td>{item.lab?.name || "N/A"}</td>
                                    <td>&#8377;{item.basePrice}</td>
                                    <td>{item.discount}%</td>
                                    <td>&#8377;{item.finalPrice}</td>
                                    <td>{item.sampleRequired}</td>
                                    <td>{item.reportTime}</td>
                                    <td>
                                        <Link
                                            to={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                height={50}
                                                width={80}
                                                alt="Labtest Pic"
                                            />
                                        </Link>
                                    </td>
                                    <td className={item.active ? "text-success" : "text-danger"}>
                                        {item.active ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        <Link to={`/labtest/update/${item._id}`} className="btn btn-primary">
                                            <i className="fa fa-edit fs-4"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deleteRecord(item._id)}>
                                            <i className="fa fa-trash fs-4"></i>
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