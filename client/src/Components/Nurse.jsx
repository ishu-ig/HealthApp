import React from 'react';
import { Link } from 'react-router-dom';

export default function Nurse({ data, title }) {
    return (
        <>
            {/* Enhanced Header Section */}
            {
                title ? 
                <div className="position-relative">
                <div
                    className="text-white py-4"
                    style={{
                        background: 'url("/assets/img/nurse-banner.jpg") center/cover no-repeat',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div className="container text-center" style={{ zIndex: 2, position: 'relative' }}>
                        <h6 className="display-5 fw-bold mb-2">Meet Our Dedicated Nurses</h6>
                        <p className="lead text-primary">
                            Compassionate and skilled nurses committed to providing the best care and comfort.
                        </p>
                    </div>
                    <div
                        className="overlay"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 0,
                        }}
                    ></div>
                </div>
            </div>:null
            }
            {/* Nurse List Section */}
            <div className="container-fluid py-5 bg-white wow fadeInUp" data-wow-delay="0.2s">
                <div className="container">
                    {title && (
                        <div className="section-title mb-5 text-center">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">
                                Our Nurses
                            </h5>
                            <h2 className="display-6 fw-bold mb-3">{title}</h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Choose from our qualified nurses for personalized and attentive care.
                            </p>
                        </div>
                    )}

                    <div className="row g-4">
                        {data.map((item) => (
                            <div className="col-12 col-sm-6 col-lg-4 text-center" key={item._id}>
                                <div
                                    className="shadow rounded h-100 bg-light p-4"
                                    style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                        alt={item.name}
                                        className="img-fluid mb-3 rounded-circle"
                                        style={{
                                            height: '150px',
                                            width: '150px',
                                            objectFit: 'cover',
                                            border: '4px solid #fff',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <h5 className="text-dark fw-bold mb-1">{item.name}</h5>
                                    <p className="text-muted mb-1"><strong>Department:</strong> {item.department}</p>
                                    <p className="text-muted mb-1"><strong>Experience:</strong> {item.experience}+ yrs</p>
                                    <p className="text-muted mb-3"><strong>Fees:</strong> ₹{item.fees}</p>
                                    <Link to={`/nurse/${item._id}`} className="btn btn-sm btn-outline-primary">Request Care</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <div className="text-center mt-5">
                        <Link to="/nurse/shop" className="btn btn-primary px-4 py-2">
                            View More Nurses
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
