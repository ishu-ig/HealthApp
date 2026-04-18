import React from 'react'
import { Link } from 'react-router-dom'

export default function Medicine({ data, title }) {
    return (
        <>
            <div className="container-fluid py-5 bg-white wow fadeInUp" data-wow-delay="0.2s">
                <div className="container">
                    {title && (
                        <div className="section-title mb-5 text-center">
                            <h5 className="position-relative d-inline-block text-success text-uppercase">Top Picks</h5>
                            <h1 className="display-6 fw-bold mb-4">{title}</h1>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Discover the most trusted and frequently purchased medicines by our customers.
                            </p>
                        </div>
                    )}
                    <div className="row g-4">
                        {data?.map((item) => (
                            <div className="col-12 col-sm-6 col-lg-4 text-center" key={item._id}>
                                <div
                                    className="shadow rounded h-100 bg-light p-3"
                                    style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <img
                                        // ✅ pic is an array — use first element
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${Array.isArray(item.pic) ? item.pic[0] : item.pic}`}
                                        alt={item.name}
                                        className="img-fluid mb-3 rounded"
                                        style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                    />
                                    <h5 className="text-dark fw-bold mb-2">{item.name}</h5>
                                    <p className="text-muted mb-1">
                                        <strong>Category:</strong> {item.medicineCategory?.name || "N/A"}
                                    </p>
                                    <p className="text-muted mb-1">
                                        <strong>Price:</strong> ₹{item.finalPrice}.00
                                    </p>
                                    <p className="text-muted mb-3">
                                        {/* ✅ manufacturer is a populated object — use .name */}
                                        <strong>Manufacturer:</strong> {item.manufacturer?.name || "N/A"}
                                    </p>
                                    <Link to={`/medicine/${item._id}`} className="btn btn-sm btn-primary">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}