import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaTags, FaServicestack, FaQuestionCircle, FaPhoneAlt, FaChevronDown } from 'react-icons/fa';

const PRIMARY   = '#06A3DA';
const SECONDARY = '#F57E57';
const DARK      = '#091E3E';

export default function SecondaryNavbar({ title }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            <style>{`
                .snav {
                    background: linear-gradient(135deg, ${DARK} 0%, #0d2a5e 100%);
                    padding: 0 0;
                    position: sticky;
                    top: 0;
                    z-index: 1055;
                    transition: box-shadow 0.3s;
                }
                .snav.scrolled { box-shadow: 0 4px 20px rgba(9,30,62,0.30); }

                /* Brand */
                .snav-brand {
                    display: flex; align-items: center; gap: 10px;
                    text-decoration: none; padding: 14px 0;
                }
                .snav-brand .s-icon {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, ${PRIMARY}, #0080b0);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem; color: #fff;
                    box-shadow: 0 4px 12px rgba(6,163,218,0.4);
                    flex-shrink: 0;
                }
                .snav-brand .s-title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: #fff;
                    font-family: 'Jost',sans-serif;
                    letter-spacing: -0.01em;
                    text-transform: capitalize;
                }
                .snav-brand .s-title span { color: ${SECONDARY}; }

                /* Nav links */
                .snav .nav-link {
                    font-family: 'Jost',sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.78) !important;
                    padding: 20px 14px !important;
                    display: flex; align-items: center; gap: 7px;
                    border-bottom: 2.5px solid transparent;
                    transition: color 0.2s, border-color 0.2s;
                    white-space: nowrap;
                }
                .snav .nav-link:hover,
                .snav .nav-link.active {
                    color: #fff !important;
                    border-bottom-color: ${SECONDARY};
                }
                .snav .nav-link svg { font-size: 0.85rem; opacity: 0.75; }
                .snav .nav-link:hover svg { opacity: 1; }

                /* Dropdown */
                .snav .dropdown-menu {
                    background: #fff;
                    border: none;
                    border-radius: 14px;
                    box-shadow: 0 12px 40px rgba(9,30,62,0.18);
                    padding: 8px;
                    min-width: 200px;
                    margin-top: 0 !important;
                }
                .snav .dropdown-item {
                    border-radius: 8px;
                    padding: 9px 14px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: ${DARK};
                    display: flex; align-items: center; gap: 9px;
                    transition: background 0.18s, color 0.18s;
                }
                .snav .dropdown-item svg { color: ${PRIMARY}; font-size: 0.82rem; }
                .snav .dropdown-item:hover {
                    background: rgba(6,163,218,0.08);
                    color: ${PRIMARY};
                }

                /* Divider line between brand and links */
                .snav-divider {
                    width: 1px;
                    height: 24px;
                    background: rgba(255,255,255,0.15);
                    margin: 0 8px;
                }

                /* Mobile */
                @media (max-width: 991.98px) {
                    .snav .nav-link { padding: 10px 4px !important; border-bottom: none; }
                    .snav-divider { display: none; }
                }
            `}</style>

            <nav className={`snav navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    {/* Brand */}
                    <Link to={`/${title}`} className="snav-brand">
                        <div className="s-icon"><i className="fa fa-heartbeat" /></div>
                        <span className="s-title">Health<span>Care</span> <span style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: 500, textTransform: 'capitalize' }}>/ {title}</span></span>
                    </Link>

                    <div className="snav-divider d-none d-lg-block" />

                    {/* Toggler */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#snavCollapse"
                        style={{ filter: 'invert(1)' }}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    {/* Links */}
                    <div className="collapse navbar-collapse" id="snavCollapse">
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            <li className="nav-item">
                                <NavLink className="nav-link" to={`/${title}`}>
                                    <FaHome /> Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={`/${title}/shop`}>
                                    <FaShoppingBag /> Shop
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#">
                                    <FaTags /> Pricing
                                </NavLink>
                            </li>

                            {/* More dropdown */}
                            <li className="nav-item dropdown">
                                <span
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    style={{ cursor: 'pointer' }}
                                >
                                    More <FaChevronDown style={{ fontSize: '0.65rem' }} />
                                </span>
                                <ul className="dropdown-menu shadow">
                                    <li>
                                        <Link className="dropdown-item" to="#">
                                            <FaServicestack />Our Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="#">
                                            <FaQuestionCircle />FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="#">
                                            <FaPhoneAlt />Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}