import React from 'react';
import { Link } from 'react-router-dom';

export default function Hospital({ data, title }) {
    return (
        <>
            {/* Header Section */}
            {title && (
                <div className="position-relative">
                    <div
                        className="text-white py-4"
                        style={{
                            background: 'url("/assets/img/hospital-banner.jpg") center/cover no-repeat',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <div className="container text-center" style={{ zIndex: 2, position: 'relative' }}>
                            <h6 className="display-5 fw-bold mb-2">{title}</h6>
                            <p className="lead text-primary">
                                Accredited hospitals committed to delivering advanced medical care and excellence.
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
                </div>
            )}

            {/* Hospital List Section */}
            <div className="container-fluid py-5 bg-white wow fadeInUp" data-wow-delay="0.2s">
                <div className="container">
                    <div className="row g-4">
                        {data.map((hospital) => (
                            <div className="col-12 col-sm-6 col-lg-4 text-center" key={hospital._id}>
                                <div
                                    className="shadow rounded h-100 bg-light p-4"
                                    style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${hospital.image}`}
                                        alt={hospital.name}
                                        className="img-fluid mb-3 rounded"
                                        style={{
                                            height: '150px',
                                            width: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <h5 className="text-dark fw-bold mb-1">{hospital.name}</h5>
                                    <p className="text-muted mb-1"><strong>Location:</strong> {hospital.city}, {hospital.state}</p>
                                    <p className="text-muted mb-1"><strong>Departments:</strong> {hospital.departments?.join(', ')}</p>
                                    <p className="text-muted mb-1"><strong>Years of Service:</strong> {hospital.experience || 'N/A'}+</p>
                                    <Link to={`/hospitals/${hospital._id}`} className="btn btn-sm btn-outline-primary">Visit Hospital</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <div className="text-center mt-5">
                        <Link to="/hospitals" className="btn btn-primary px-4 py-2">
                            View More Hospitals
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
