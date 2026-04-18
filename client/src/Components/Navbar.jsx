import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
            response = await response.json();
            setData(response);
        })();
    }, []);

    function logout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <>
            {/* Topbar Start */}
            <div className="container-fluid bg-light d-none d-lg-block">
                <div className="row gx-0 align-items-center">
                    <div className="col-md-6 text-center text-lg-start">
                        <div className="d-inline-flex align-items-center bg-primary text-white px-4 py-2 rounded-end">
                            <Link to="mailto:info@example.com" target="_blank" className="text-light me-4 d-flex align-items-center">
                                <i className="fa fa-envelope-open me-2"></i> info@example.com
                            </Link>
                            <Link to="tel:+91-987564321" target="_blank" className="text-light me-4 d-flex align-items-center">
                                <i className="fa fa-phone me-2"></i> +91-987564321
                            </Link>
                            <Link to="https://wa.me/987564321" target="_blank" className="text-light d-flex align-items-center">
                                <i className="bi bi-whatsapp me-2 fs-5"></i> +91-987564321
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6 text-center text-lg-end">
                        <div className="d-inline-flex align-items-center bg-primary text-white px-3 py-2 rounded-start">
                            <Link to="#" className="text-light me-3 fs-5"><i className="bi bi-facebook"></i></Link>
                            <Link to="#" className="text-light me-3 fs-5"><i className="bi bi-twitter"></i></Link>
                            <Link to="#" className="text-light me-3 fs-5"><i className="bi bi-instagram"></i></Link>
                            <Link to="#" className="text-light fs-5"><i className="bi bi-whatsapp"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Topbar End */}

            {/* Navbar Start */}
            <nav className="navbar navbar-expand-lg bg-white navbar-light shadow-sm px-4 py-3 sticky-top" style={{ position: 'relative', zIndex: 1060 }}>
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <h1 className="m-0 text-primary fw-bold d-flex align-items-center">
                        <i className="fab fa-slack me-2"></i>
                        Health<span className="text-secondary">Care</span>
                    </h1>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto align-items-lg-center">
                        <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                        <NavLink to="/about" className="nav-item nav-link">About</NavLink>
                        <NavLink to="" className="nav-item nav-link">Services</NavLink>
                        <NavLink to="/medicine" className="nav-item nav-link">Medicines</NavLink>
                        <NavLink to="/labtest" className="nav-item nav-link">Labtest</NavLink>
                        <NavLink to="/doctors" className="nav-item nav-link">Doctors</NavLink>
                        <NavLink to="/nurse" className="nav-item nav-link">Nurse</NavLink>
                        <NavLink to="/features" className="nav-item nav-link">Features</NavLink>
                        <NavLink to="/admin" className="nav-item nav-link">Admin</NavLink>

                        <div className="nav-item dropdown">
                            <Link to="/services" className="nav-link dropdown-toggle" style={{ zIndex: 2 }} data-bs-toggle="dropdown">Pages</Link>
                            <div className="dropdown-menu m-0">
                                <NavLink to="/pricing" className="dropdown-item">Pricing Plan</NavLink>
                                <NavLink to="/team" className="dropdown-item">Our Dentist</NavLink>
                                <NavLink to="/testimonials" className="dropdown-item">Testimonial</NavLink>
                                <NavLink to="/appointment" className="dropdown-item">Appointment</NavLink>
                            </div>
                        </div>

                        <NavLink to="/contactus" className="nav-item nav-link">Contact</NavLink>
                    </div>

                    {/* Right Side Actions */}
                    <div className="d-flex align-items-center ms-lg-3 gap-2">
                        {/* Appointment */}


                        {/* Profile */}
                        <div className="dropdown">
                            <button
                                className="btn p-0 border-0 bg-transparent"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <i className="fas fa-user-circle text-primary fs-2"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow" style={{ zIndex: 1 }}>
                                <li className="text-center p-2">
                                    <img
                                        src={data?.pic && localStorage.getItem("login")
                                            ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`
                                            : "/img/noimage.jpg"}
                                        alt="User"
                                        className="rounded-circle border mb-2"
                                        width={60}
                                        height={60}
                                    />
                                    <h6 className="fw-bold m-0">
                                        {localStorage.getItem("name") || "User"}
                                    </h6>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><NavLink className="dropdown-item" to="/profile"><i className="fas fa-user me-2"></i>Profile</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/medicine/cart"><i className="fas fa-shopping-cart me-2"></i>Cart</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/order"><i className="fas fa-box me-2"></i>Orders</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/booking"><i className="fas fa-calendar-alt me-2"></i>Booking</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/settings"><i className="fas fa-cog me-2"></i>Settings</NavLink></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    {localStorage.getItem("login") ? (
                                        <button onClick={logout} className="dropdown-item text-danger">
                                            <i className="fa fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    ) : (
                                        <NavLink to="/login" className="dropdown-item">
                                            <i className="fa fa-sign-in-alt me-2"></i> Login
                                        </NavLink>
                                    )}
                                </li>
                            </ul>
                        </div>
                        <Link to="/appointment" className="btn btn-primary px-3">Appointment</Link>
                        {/* SOS inside Navbar */}
                        
                    </div>
                </div>
            </nav>
            {/* Navbar End */}

            {/* Floating AI Support Button */}
            <button className="ai-support-btn">
                <i className="fas fa-robot"></i>
            </button>

            <style>{`
                .ai-support-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 30px;
                    background: linear-gradient(135deg, #4a90e2, #0056b3);
                    color: #fff;
                    font-size: 1.4rem;
                    border: none;
                    border-radius: 50%;
                    width: 55px;
                    height: 55px;
                    box-shadow: 0 6px 15px rgba(0, 86, 179, 0.5);
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .ai-support-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 25px rgba(0, 86, 179, 0.7);
                }

                .ai-support-btn:active {
                    transform: scale(0.95);
                }
            `}</style>
        </>
    );
}
