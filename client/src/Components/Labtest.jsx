import React from 'react';
import { Link } from 'react-router-dom';

export default function Labtest({ data, title }) {
    return (
        <div className={`labtest-section py-5 ${title === "Available Lab Tests" ? "labtest-alt" : ""}`}>
            <div className="container">
                {title && (
                    <div className="section-header text-center mb-5">
                        <span className="section-badge badge-blue">Health Checkups</span>
                        <h1 className="section-title">{title}</h1>
                        <p className="section-subtitle">
                            Book lab tests from the comfort of your home and get accurate reports delivered online.
                        </p>
                    </div>
                )}
                <div className="row g-3">
                    {data.map((item) => (
                        <div
                            className={title === "Home Labtest" ? "col-6" : "col-12"}
                            key={item._id}
                        >
                            <div className="labtest-card">
                                <div className="labtest-img-wrap">
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                        alt={item.name}
                                        className="labtest-img"
                                    />
                                </div>
                                <div className="labtest-info">
                                    <h5 className="labtest-name">{item.name}</h5>
                                    <div className="labtest-meta">
                                        <span className="labtest-tag">
                                            <i className="bi bi-droplet me-1"></i>{item.sampleRequired}
                                        </span>
                                        <span className="labtest-tag">
                                            <i className="bi bi-clock me-1"></i>{item.reportTime} Days
                                        </span>
                                    </div>
                                    <p className="labtest-price">₹{item.finalPrice}</p>
                                </div>
                                <div className="labtest-action">
                                    <Link to={`/labtest/${item._id}`} className="btn-labtest">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}