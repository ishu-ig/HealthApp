import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';

import $ from 'jquery';                                         // Import jQuery
import 'datatables.net-dt/css/dataTables.dataTables.min.css';   // Import DataTables styles
import 'datatables.net';

import { deleteMedicine, getMedicine } from "../../Redux/ActionCreators/MedicineActionCreators"
export default function AdminMedicine() {
    let MedicineStateData = useSelector(state => state.MedicineStateData)
    let dispatch = useDispatch()

    // function deleteRecord(id) {
    //     if (window.confirm("Are You Sure to Delete that Item : ")) {
    //         dispatch(deleteMedicine({ id: id }))
    //         getAPIData()
    //     }
    // }
    function deleteRecord(_id) {
        if (window.confirm("Are You Sure to Delete that Item : ")) {
            dispatch(deleteMedicine({ _id: _id }))
            getAPIData()
        }
    }
    function getAPIData() {
        dispatch(getMedicine())
        let time = setTimeout(() => {
            $('#DataTable').DataTable()
        }, 500)
        return time
    }
    useEffect(() => {
        let time = getAPIData()
        return () => clearTimeout(time)
    }, [MedicineStateData.length])
    return (
        <>
            <div>
                <h5 className='bg-primary text-light text-center p-3'>Medicine <Link to="/Medicine/create"><i className='fa fa-plus text-light float-end'></i></Link></h5>
                <div className="table-responsive">
                    <table id='DataTable' className="table table-striped table-hover table-bordered text-center">
                        <thead className="text-light" style={{ backgroundColor: "#1F2A40" }}>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Madicine Category</th>
                                <th>Manufacturer</th>
                                <th>Base Price</th>
                                <th>Discount</th>
                                <th>Final Price</th>
                                <th>Stock</th>
                                <th>Stock Quantity</th>
                                <th>Expire Date</th>
                                <th>Pic</th>
                                <th>Active</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                MedicineStateData.map((item) => {
                                    return <tr key={item._id}>
                                        {/* return <tr key={item._id}> */}
                                        {/* <td>{item.id}</td> */}
                                        <td>{item._id}</td>
                                        <td>{item.name}</td>
                                        {/* <td>{item.maincategory}</td>
                                                <td>{item.subcategory}</td>
                                                <td>{item.brand}</td> */}
                                        <td>{item.medicineCategory?.name}</td>
                                        <td>{item.manufacturer?.name}</td>
                                        <td>&#8377;{item.basePrice}</td>
                                        <td>{item.discount}</td>
                                        <td>&#8377;{item.finalPrice}</td>
                                        <td className={`${item.active ? 'text-success' : 'text-danger'}`}>{item.stock ? "Yes" : "No"}</td>
                                        <td>{item.stockQuantity}</td>
                                        <td>{item.expireDate}</td>
                                        <td>
                                            <div className='Medicine-images'>
                                                {item.pic?.map((p, index) => {
                                                    return <Link key={index} to={`${process.env.REACT_APP_BACKEND_SERVER}/${p}`} target='_blank' rel='noreferrer'>
                                                        <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${p}`} height={50} width={80} alt="Medicine Pic" className='me-2 mb-2' />
                                                    </Link>
                                                })}
                                            </div>
                                        </td>
                                        <td className={`${item.active ? 'text-success' : 'text-danger'}`}>{item.active ? "Yes" : "No"}</td>
                                        {/* <td><Link to={`/admin/Medicine/update/${item.id}`} className='btn btn-primary'><i className='fa fa-edit fs-4'></i></Link></td>
                                                <td>{localStorage.getItem("role")==="Super Admin"?<button className='btn btn-danger' onClick={() => deleteRecord(item.id)}><i className='fa fa-trash fs-4'></i></button>:null}</td> */}
                                        <td><Link to={`/medicine/update/${item._id}`} className='btn btn-primary'><i className='fa fa-edit fs-4'></i></Link></td>
                                        <td><button className='btn btn-danger' onClick={() => deleteRecord(item._id)}><i className='fa fa-trash fs-4'></i></button></td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
