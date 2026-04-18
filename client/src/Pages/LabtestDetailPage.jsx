import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getLabtest } from "../Redux/ActionCreators/LabtestActionCreators"
import { createLabtestCart, getLabtestCart } from "../Redux/ActionCreators/LabtestCartActionCreators"
import { createLabtestWishlist, getLabtestWishlist } from "../Redux/ActionCreators/LabtestWishlistActionCreators"
import Services from '../Components/Services'

export default function LabtestDetailPage() {
    let { _id } = useParams()

    let [data, setData]                     = useState({})
    let [relatedLabtest, setRelatedLabtest] = useState([])
    let [reservationDate, setReservationDate] = useState("")
    let [errorMessage, setErrorMessage]     = useState({
        reservationDate: "Date field is mandatory",
    })

    let LabtestStateData         = useSelector((state) => state.LabtestStateData)         || []
    let LabtestCartStateData     = useSelector((state) => state.LabtestCartStateData)     || []
    let LabtestWishlistStateData = useSelector((state) => state.LabtestWishlistStateData) || []

    let dispatch = useDispatch()
    let navigate = useNavigate()

    useEffect(() => {
        dispatch(getLabtest())
        dispatch(getLabtestCart())
        dispatch(getLabtestWishlist())
    }, [dispatch])

    useEffect(() => {
        if (LabtestStateData.length > 0 && _id) {
            let item = LabtestStateData.find((x) => x._id === _id)
            if (item) {
                setData(item)
                setRelatedLabtest(
                    LabtestStateData.filter((x) =>
                        x.active &&
                        (x.labtestCategory?._id || x.labtestCategory) ===
                        (item.labtestCategory?._id || item.labtestCategory) &&
                        x._id !== _id
                    )
                )
            }
        }
    }, [LabtestStateData, _id])

    function addToLabtestCart() {
        if (localStorage.getItem("login")) {
            if (!reservationDate) {
                setErrorMessage(prev => ({ ...prev, reservationDate: "Date field is mandatory" }))
                return
            }
            let item = LabtestCartStateData.find(
                x => (x.labtest?._id || x.labtest) === _id &&
                     (x.user?._id   || x.user)    === localStorage.getItem("userid")
            )
            if (!item) {
                dispatch(createLabtestCart({
                    user:            localStorage.getItem("userid"),
                    labtest:         _id,
                    total:           data.finalPrice,
                    reservationDate: reservationDate,
                }))
            }
            navigate("/labtest/cart")
        } else {
            alert("Login to add item to cart and place an order")
            navigate("/login")
        }
    }

    function addToWishlist() {
        if (localStorage.getItem("login")) {
            let item = LabtestWishlistStateData.find(
                x => (x.labtest?._id || x.labtest) === _id &&
                     (x.user?._id   || x.user)    === localStorage.getItem("userid")
            )
            if (!item) {
                dispatch(createLabtestWishlist({
                    user:    localStorage.getItem("userid"),
                    labtest: _id,
                }))
            }
            navigate("/wishlist")
        } else {
            alert("Login to add item to wishlist and place an order")
            navigate("/login")
        }
    }

    function getInputData(e) {
        const { value } = e.target
        setReservationDate(value)
        if (value) setErrorMessage(prev => ({ ...prev, reservationDate: "" }))
    }

    const today = new Date().toISOString().split("T")[0]

    return (
        <>
            <HeroSection title={`Lab Test - ${data.name || ""}`} />

            <div className="container-xxl py-5">
                <div className="container-fluid text-center">
                    <div className="section-header text-center mb-5" style={{ maxWidth: 500, margin: "auto" }}>
                        <h1 className="display-4 fw-bold">{data.name}</h1>
                    </div>

                    <div className="row">
                        {/* Lab Test Image */}
                        <div className="col-md-5 d-flex align-items-center justify-content-center">
                            {data?.pic && (
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                                    style={{ height: 400, width: '100%', borderRadius: '10px' }}
                                    className="shadow-lg"
                                    alt="Lab Test"
                                />
                            )}
                        </div>

                        {/* Lab Test Details */}
                        <div className="col-md-7">
                            <div className="card shadow-lg p-4">
                                <table className="table table-bordered table-striped border-3 border-primary">
                                    <tbody>
                                        <tr>
                                            <th>Lab Test Name</th>
                                            <td>{data?.name || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Category</th>
                                            {/* labtestCategory is a raw ObjectId in DB — show populated name if available */}
                                            <td>{data?.labtestCategory?.name || data?.labtestCategory || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Lab Name</th>
                                            {/* lab is a raw ObjectId in DB — show populated name if available */}
                                            <td>{data?.lab?.name || data?.lab || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td>
                                                <del className="text-danger">&#8377;{data?.basePrice}</del>
                                                <strong className="ms-2 text-success">&#8377;{data?.finalPrice}</strong>
                                                <sup className="text-success"> {data?.discount}%</sup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Sample Required</th>
                                            {/* DB field is sampleRequired, not sampleType */}
                                            <td>{data?.sampleRequired || "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Report Time</th>
                                            {/* reportTime is stored as a number (e.g. "2" hours) */}
                                            <td>{data?.reportTime ? `${data.reportTime} hrs` : "N/A"}</td>
                                        </tr>
                                        <tr>
                                            <th>Preparation</th>
                                            {/* DB field is preperation (note spelling matches DB) */}
                                            <td>
                                                {data?.preperation
                                                    ? <div dangerouslySetInnerHTML={{ __html: data.preperation }} />
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Date</th>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="reservationDate"
                                                    min={today}
                                                    className="form-control"
                                                    onChange={getInputData}
                                                />
                                                {errorMessage.reservationDate && (
                                                    <p className="text-danger small mt-1">
                                                        {errorMessage.reservationDate}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Day</th>
                                            <td>
                                                {reservationDate
                                                    ? new Date(reservationDate).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                    })
                                                    : "—"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className="col-md-12 my-3">
                                                    <div className="btn-group w-100">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={addToLabtestCart}
                                                            style={{ borderRadius: "5px" }}
                                                        >
                                                            <i className="fa fa-shopping-cart me-2"></i>
                                                            Add To Cart
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={addToWishlist}
                                                            style={{ borderRadius: "5px" }}
                                                        >
                                                            <i className="fa fa-heart me-2"></i>
                                                            Add To Wishlist
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: data?.description || "No description available"
                                                }} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {relatedLabtest.length > 0 ? (
                <Services title="Other Related Lab Tests" data={relatedLabtest} />
            ) : (
                <p className="text-center text-muted">No related lab tests found</p>
            )}
        </>
    )
}