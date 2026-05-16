import React from 'react';
import { Link } from 'react-router-dom';

export default function Doctor({ data, title }) {
    return (
        <>
            {title && (
                <div className="page-hero doctor-hero">
                    <div className="page-hero-overlay" />
                    <div className="page-hero-content">
                        <span className="hero-eyebrow">Our Specialists</span>
                        <h1 className="hero-heading">{title}</h1>
                        <p className="hero-sub">
                            Highly qualified, compassionate professionals dedicated to your health and well-being.
                        </p>
                    </div>
                </div>
            )}

            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-4">
                        {data.map((item) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                                <div className="doctor-card">
                                    <div className="doctor-card-top">
                                        <div className="doctor-avatar-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                alt={item.name}
                                                className="doctor-avatar"
                                            />
                                        </div>
                                        <div className="doctor-spec-badge">
                                            {item.specialization?.name || "General"}
                                        </div>
                                    </div>
                                    <div className="doctor-body">
                                        <h5 className="doctor-name">{item.name}</h5>
                                        <div className="doctor-stats">
                                            <div className="stat-item">
                                                <i className="bi bi-award"></i>
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
                                        <Link to={`/doctors/${item._id}`} className="btn-doctor">
                                            Book Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <Link to="/doctors" className="btn-view-more">
                            View More Doctors <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}