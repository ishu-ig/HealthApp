import React from 'react'
import { Link } from 'react-router-dom'

export default function Medicine({ data, title }) {
    return (
        <div className="medicine-section py-5">
            {title && (
                <div className="section-header text-center mb-5">
                    <span className="section-badge">Top Picks</span>
                    <h1 className="section-title">{title}</h1>
                    <p className="section-subtitle">
                        Discover the most trusted and frequently purchased medicines by our customers.
                    </p>
                </div>
            )}
            <div className="container">
                <div className="row g-4">
                    {data?.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                            <div className="medicine-card">
                                <div className="medicine-img-wrap">
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${Array.isArray(item.pic) ? item.pic[0] : item.pic}`}
                                        alt={item.name}
                                        className="medicine-img"
                                    />
                                    <div className="medicine-overlay">
                                        <Link to={`/medicine/${item._id}`} className="overlay-btn">
                                            View Details
                                        </Link>
                                    </div>
                                    <span className="medicine-category-tag">
                                        {item.medicineCategory?.name || "General"}
                                    </span>
                                </div>
                                <div className="medicine-body">
                                    <h5 className="medicine-name">{item.name}</h5>
                                    <div className="medicine-meta">
                                        <span className="meta-item">
                                            <i className="bi bi-building me-1"></i>
                                            {item.manufacturer?.name || "N/A"}
                                        </span>
                                    </div>
                                    <div className="medicine-footer">
                                        <span className="medicine-price">₹{item.finalPrice}.00</span>
                                        <Link to={`/medicine/${item._id}`} className="btn-card-action">
                                            Add to Cart <i className="bi bi-cart-plus"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}