import React from 'react';
import { Link } from 'react-router-dom';

export default function Labtest({ data, title }) {
    return (
        <>
            <div
                className={`container-fluid py-5 ${title === "Available Lab Tests" ? "" : "bg-light"} wow fadeInUp`}
                data-wow-delay="0.3s"
            >
                <div className="container">
                    {
                        title ? <div className="section-title mb-5 text-center">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">
                                Health Checkups
                            </h5>
                            <h1 className="display-6 fw-bold mb-4">{title}</h1>
                            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Book lab tests from the comfort of your home and get accurate reports delivered online.
                            </p>
                        </div> : null
                    }
                    <div className="row g-4">
                        {data.map((item) => (
                            <div
                                className={title === "Home Labtest" ? "col-6" : "col-12"}
                                key={item._id}
                            >
                                <div
                                    className={`d-flex align-items-center justify-content-between rounded p-3 shadow-sm ${title === "Available Lab Tests" ? "bg-light" : "bg-white"
                                        }`}
                                    style={{
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.transform = "scale(1.02)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = "scale(1)")
                                    }
                                >
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                            alt={item.name}
                                            className="rounded me-3"
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '0.5rem',
                                            }}
                                        />
                                        <div>
                                            <h5 className="mb-1 fw-bold text-dark">{item.name}</h5>
                                            <p className="mb-1 text-muted small fw-semibold">
                                                {item.sampleRequired} Sample • {item.reportTime} Days
                                            </p>
                                            <p className="mb-0 text-primary fw-bold">₹{item.finalPrice}</p>
                                        </div>
                                    </div>
                                    <Link to={`/labtest/${item._id}`} className="btn btn-sm btn-primary px-3">Add To Cart</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
