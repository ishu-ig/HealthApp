import React, { useEffect, useState } from 'react'
import imageValidator from '../FormValidator/imageValidator'
import formValidator from '../FormValidator/formValidator'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

export default function UpdateProfilePage() {
    let [data, setData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        pic: ""
    })

    let [errorMessage, setErrorMessage] = useState({
        name: "",
        phone: "",
        pic: ""
    })

    let [show, setShow] = useState(false)
    let navigate = useNavigate()

    function getInputData(e) {
        let name = e.target.name
        let value = e.target.files ? "profile/" + e.target.files[0].name : e.target.value

        if (name !== "active") {
            setErrorMessage((old) => ({
                ...old,
                [name]: e.target.files ? imageValidator(e) : formValidator(e)
            }))
        }

        setData((old) => ({
            ...old,
            [name]: value
        }))
    }

    async function postData(e) {
        e.preventDefault()

        let error = Object.values(errorMessage).find((x) => x !== "")
        if (error) {
            setShow(true)
            return
        }

        try {
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, // ✅ FIXED
                {
                    method: "PUT",
                    headers: {
                        'content-type': 'application/json' // ✅ FIXED
                    },
                    body: JSON.stringify({ ...data })
                }
            )

            response = await response.json()

            if (response.result === "Done") {
                if (data.role === "Buyer") // ✅ FIXED
                    navigate("/profile")
                else
                    navigate("/admin")
            } else {
                alert("Something Went Wrong")
            }

        } catch (error) {
            alert("Internal Server Error")
        }
    }

    useEffect(() => {
        (async () => {
            try {
                let response = await fetch(
                    `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, // ✅ FIXED
                    {
                        method: "GET",
                        headers: {
                            'content-type': 'application/json' // ✅ FIXED
                        },
                    }
                )

                response = await response.json()

                if (response.result === "Done") {
                    setData(response.data) // ✅ FIXED
                }

            } catch (error) {
                alert("Internal Server Error")
            }
        })()
    }, [])

    return (
        <>
            <HeroSection title="Update Profile" />
            <div className="container">
                <div className="card p-4 shadow-lg row m-auto" style={{ maxWidth: "800px", width: "100%" }}>
                    <div className="col-md-8 col-sm-10 col-11 md-3 m-auto">
                        <h5 className='text-light bg-primary text-center p-2'>Update Profile</h5>

                        <form onSubmit={postData}>
                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label>Name</label>
                                    <input type="text" name="name" value={data.name} onChange={getInputData} className="form-control border-3 border-primary" />
                                </div>

                                <div className="col-md-6">
                                    <label>Contact Number</label>
                                    <input type="number" name="phone" value={data.phone} onChange={getInputData} className="form-control border-3 border-primary" />
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label>Address</label>
                                <textarea name="address" value={data.address} onChange={getInputData} className='form-control border-3 border-primary' />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label>State</label>
                                    <input type="text" name="state" value={data.state} onChange={getInputData} className='form-control border-3 border-primary' />
                                </div>

                                <div className="col-md-6">
                                    <label>City</label>
                                    <input type="text" name="city" value={data.city} onChange={getInputData} className='form-control border-3 border-primary' />
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className="col-md-6">
                                    <label>Pin</label>
                                    <input type="number" name="pin" value={data.pin} onChange={getInputData} className='form-control border-3 border-primary' />
                                </div>

                                <div className="col-md-6">
                                    <label>Profile Pic</label>
                                    <input type="file" name="pic" onChange={getInputData} className='form-control border-3 border-primary' />
                                </div>
                            </div>

                            <button type='submit' className='btn btn-primary w-100'>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}