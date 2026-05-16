import React from 'react';
import { Link } from 'react-router-dom';

export default function Hospital({ data, title }) {
    return (
        <>
            {title && (
                <div className="page-hero hospital-hero">
                    <div className="page-hero-overlay" />
                    <div className="page-hero-content">
                        <span className="hero-eyebrow">Trusted Care</span>
                        <h1 className="hero-heading">{title}</h1>
                        <p className="hero-sub">
                            Accredited hospitals committed to delivering advanced medical care and excellence.
                        </p>
                    </div>
                </div>
            )}

            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-4">
                        {data.map((hospital) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={hospital._id}>
                                <div className="hospital-card">
                                    <div className="hospital-img-wrap">
                                        <img
                                            src={`${process.env.REACT_APP_BACKEND_SERVER}/${hospital.image}`}
                                            alt={hospital.name}
                                            className="hospital-img"
                                        />
                                        <div className="hospital-exp-badge">
                                            <span>{hospital.experience || 'N/A'}+</span>
                                            <small>Years</small>
                                        </div>
                                    </div>
                                    <div className="hospital-body">
                                        <h5 className="hospital-name">{hospital.name}</h5>
                                        <p className="hospital-location">
                                            <i className="bi bi-geo-alt-fill me-1 text-primary"></i>
                                            {hospital.city}, {hospital.state}
                                        </p>
                                        <div className="hospital-depts">
                                            {hospital.departments?.slice(0, 3).map((dept, i) => (
                                                <span key={i} className="dept-chip">{dept}</span>
                                            ))}
                                            {hospital.departments?.length > 3 && (
                                                <span className="dept-chip dept-more">+{hospital.departments.length - 3}</span>
                                            )}
                                        </div>
                                        <Link to={`/hospitals/${hospital._id}`} className="btn-hospital">
                                            Visit Hospital <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <Link to="/hospitals" className="btn-view-more">
                            View More Hospitals <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}