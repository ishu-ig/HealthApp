import React from 'react';
import { Link } from 'react-router-dom';

export default function Nurse({ data, title }) {
    return (
        <>
            {title && (
                <div className="page-hero nurse-hero">
                    <div className="page-hero-overlay" />
                    <div className="page-hero-content">
                        <span className="hero-eyebrow">Dedicated Care</span>
                        <h1 className="hero-heading">Meet Our Dedicated Nurses</h1>
                        <p className="hero-sub">
                            Compassionate and skilled nurses committed to providing the best care and comfort.
                        </p>
                    </div>
                </div>
            )}

            <div className="container-fluid py-5">
                <div className="container">
                    {title && (
                        <div className="section-header text-center mb-5">
                            <span className="section-badge badge-teal">Our Nurses</span>
                            <h2 className="section-title">{title}</h2>
                            <p className="section-subtitle">
                                Choose from our qualified nurses for personalized and attentive care.
                            </p>
                        </div>
                    )}
                    <div className="row g-4">
                        {data.map((item) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                                <div className="nurse-card">
                                    <div className="nurse-card-top">
                                        <div className="nurse-avatar-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                alt={item.name}
                                                className="nurse-avatar"
                                            />
                                        </div>
                                        <div className="nurse-dept-badge">{item.department}</div>
                                    </div>
                                    <div className="nurse-body">
                                        <h5 className="nurse-name">{item.name}</h5>
                                        <div className="nurse-stats">
                                            <div className="stat-item">
                                                <i className="bi bi-heart-pulse"></i>
                                                <span>{item.experience}+ yrs</span>
                                                <small>Experience</small>
                                            </div>
                                            <div className="stat-divider" />
                                            <div className="stat-item">
                                                <i className="bi bi-currency-rupee"></i>
                                                <span>{item.fees}</span>
                                                <small>Fees</small>
                                            </div>
                                        </div>
                                        <Link to={`/nurse/${item._id}`} className="btn-nurse">
                                            Request Care
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <Link to="/nurse/shop" className="btn-view-more">
                            View More Nurses <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}