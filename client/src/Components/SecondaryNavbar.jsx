import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaTags, FaServicestack, FaQuestionCircle, FaPhoneAlt } from 'react-icons/fa';

export default function SecondaryNavbar({ title }) {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-primary navbar-dark shadow sticky-top py-3 rounded-bottom" >
        <div className="container">
          {/* Brand */}
          <Link className="navbar-brand fw-bold text-light text-capitalize d-flex align-items-center" to="">
            🏥 <span className="ms-2">{title}</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto fw-semibold">
              <li className="nav-item">
                <Link className="nav-link text-light d-flex align-items-center gap-2 hover-effect" to={`/${title}`}>
                  <FaHome /> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light d-flex align-items-center gap-2 hover-effect" to={`/${title}/shop`}>
                  <FaShoppingBag /> Shop
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light d-flex align-items-center gap-2 hover-effect" to="">
                  <FaTags /> Pricing
                </Link>
              </li>

              {/* Dropdown */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle text-light d-flex align-items-center gap-2 hover-effect"
                  to=""
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  More
                </Link>
                <ul className="dropdown-menu shadow border-0 rounded-3 p-2">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="">
                      <FaServicestack /> Our Services
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="">
                      <FaQuestionCircle /> FAQs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="">
                      <FaPhoneAlt /> Contact Us
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Extra CSS for UX improvements */}
      <style>
        {`
          .hover-effect:hover {
            color: #ffd700 !important;
            transform: translateY(-2px);
            transition: all 0.3s ease-in-out;
          }
          .dropdown-item:hover {
            background-color: #f8f9fa;
            border-radius: 8px;
          }
        `}
      </style>
    </>
  );
}
