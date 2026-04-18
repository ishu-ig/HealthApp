import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import formValidator from "../../FormValidators/formValidator"

export default function AdminCreateUser() {
    let [data, setData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "Admon",
        password: "",
        cpassword: "",
        active: true
    })
    let [error, setError] = useState({
        name: "Name Field is Mendatory",
        username: "Username Field is Mendatory",
        email: "Email Field is Mendatory",
        phone: "Phone Field is Mendatory",
        password: "Password Field is Mendatory",
    })
    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    function getInputData(e) {
        let {name,value} = e.target
        

        if (name !== "active") {
            setError((old) => {
                return {
                    ...old,
                    [name]: formValidator(e)
                }
            })
        }
        setData((old) => {
            return {
                ...old,
                [name]: name === "active" ? (value === "1" ? true : false) : value
            }
        })
    }
    async function postSubmit(e) {
        e.preventDefault()
        if (data.password === data.cpassword) {
            let errorItem = Object.values(error).find(x => x !== "")
            if (errorItem)
                setShow(true)
            else {
                let item = {
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                    password: data.password,
                    active: data.active
                }

                let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authorization": localStorage.getItem("token")
                    },
                    body: JSON.stringify(item)
                    // body: item
                })
                response = await response.json()
                if (response.result ==="Done")
                    navigate("/user")
                else {
                    setShow(true)
                    setError((old) => {
                        return {
                            ...old,
                            "username": response.reason.username ?? "",
                            "email": response.reason.email ?? "",
                        }
                    })
                }
            }

        }
        else {
            setShow(true)
            setError((old) => {
                return {
                    ...old,
                    'password': 'Password and Confirm Password Does Not Matched'
                }
            })
        }
    }
    return (
        <>
            <div className="container">
                <h5 className="text-center text-light bg-primary p-2">Create User <Link to="/User"><i className="fa fa-arrow-left text-light float-end pt-1"></i></Link></h5>
                {/* Form */}
                <div className="card mt-3 shadow-sm p-4">
                    <form onSubmit={postSubmit}>
                        {/* Name Field */}
                        <div className='row'>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={getInputData}
                                    placeholder="Enter User Name"
                                    className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.name && <p className="text-danger mt-1">{error.name}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Username*</label>
                                <input
                                    type="text"
                                    name="username"
                                    onChange={getInputData}
                                    placeholder="Enter Username"
                                    className={`form-control ${show && error.username ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.username && <p className="text-danger mt-1">{error.username}</p>}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={getInputData}
                                    placeholder="Enter Email Address"
                                    className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.email && <p className="text-danger mt-1">{error.email}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Phone*</label>
                                <input
                                    type="number"
                                    name="phone"
                                    onChange={getInputData}
                                    placeholder="Enter Conatct Number"
                                    className={`form-control ${show && error.username ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.phone && <p className="text-danger mt-1">{error.phone}</p>}
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Password*</label>
                                <input
                                    type="passowrd"
                                    name="password"
                                    onChange={getInputData}
                                    placeholder="Enter Password"
                                    className={`form-control ${show && error.name ? 'border-danger' : 'border-primary'}`}
                                />
                                {show && error.password && <p className="text-danger mt-1">{error.password}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Confirm Password*</label>
                                <input
                                    type="password"
                                    name="cpassword"
                                    onChange={getInputData}
                                    placeholder="Enter Confirm Password"
                                    className={`form-control ${show && error.password ? 'border-danger' : 'border-primary'}`}
                                />
                            </div>
                        </div>

                        {/* File Upload & Active Status */}
                        <div className="row">
                            {/* File Upload */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Role</label>
                                <select
                                    name="role"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                            </div>

                            {/* Active Status */}
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold">Active</label>
                                <select
                                    name="active"
                                    onChange={getInputData}
                                    className="form-select border-primary"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100 text-light">
                                <i className="fa fa-save"></i> Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
