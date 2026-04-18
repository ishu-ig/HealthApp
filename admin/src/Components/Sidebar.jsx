import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isExpanded }) {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    return (
        <div id="sidebar" className={isExpanded ? "expanded" : ""}>
            <div className="sidebar-header">
                <img src="https://i.pravatar.cc/100" alt="Admin" className="admin-avatar" />
                <span className="admin-name">John Doe</span>
                <span className="admin-role">Super Admin</span>
            </div>

            <ul className="sidebar-nav">

                <li>
                    <Link to="/" className={`sidebar-link text-light ${isActive("/") ? "active" : ""}`}>
                        <i className="fa fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li className="nav-section-label">Doctors</li>
                <li>
                    <Link to="/specialization" className={`sidebar-link text-light ${isActive("/specialization") ? "active" : ""}`}>
                        <i className="fa fa-user-md"></i>
                        <span>Specialization</span>
                    </Link>
                </li>
                <li>
                    <Link to="/doctor" className={`sidebar-link text-light ${isActive("/doctor") ? "active" : ""}`}>
                        <i className="fa fa-stethoscope"></i>
                        <span>Doctors</span>
                    </Link>
                </li>
                <li>
                    <Link to="/doctorAppointment" className={`sidebar-link text-light ${isActive("/doctorAppointment") ? "active" : ""}`}>
                        <i className="fa fa-calendar-check"></i>
                        <span>Doctor Appointments</span>
                    </Link>
                </li>

                <li className="nav-section-label">Nurses &amp; Hospitals</li>
                <li>
                    <Link to="/hospital" className={`sidebar-link text-light ${isActive("/hospital") ? "active" : ""}`}>
                        <i className="fa fa-hospital"></i>
                        <span>Hospitals</span>
                    </Link>
                </li>
                <li>
                    <Link to="/nurse" className={`sidebar-link text-light ${isActive("/nurse") ? "active" : ""}`}>
                        <i className="fa fa-user-nurse"></i>
                        <span>Nurses</span>
                    </Link>
                </li>
                <li>
                    <Link to="/nurseAppointment" className={`sidebar-link text-light ${isActive("/nurseAppointment") ? "active" : ""}`}>
                        <i className="fa fa-calendar-check"></i>
                        <span>Nurse Appointments</span>
                    </Link>
                </li>

                <li className="nav-section-label">Medicines</li>
                <li>
                    <Link to="/medicinecategory" className={`sidebar-link text-light ${isActive("/medicinecategory") ? "active" : ""}`}>
                        <i className="fa fa-tags"></i>
                        <span>Medicine Category</span>
                    </Link>
                </li>
                <li>
                    <Link to="/manufacturer" className={`sidebar-link text-light ${isActive("/manufacturer") ? "active" : ""}`}>
                        <i className="fa fa-industry"></i>
                        <span>Manufacturers</span>
                    </Link>
                </li>
                <li>
                    <Link to="/medicine" className={`sidebar-link text-light ${isActive("/medicine") ? "active" : ""}`}>
                        <i className="fa fa-capsules"></i>
                        <span>Medicines</span>
                    </Link>
                </li>

                <li className="nav-section-label">Laboratory</li>
                <li>
                    <Link to="/lab" className={`sidebar-link text-light ${isActive("/lab") ? "active" : ""}`}>
                        <i className="fa fa-flask"></i>
                        <span>Labs</span>
                    </Link>
                </li>
                <li>
                    <Link to="/labtestcategory" className={`sidebar-link text-light ${isActive("/labtestcategory") ? "active" : ""}`}>
                        <i className="fa fa-list-alt"></i>
                        <span>Test Category</span>
                    </Link>
                </li>
                <li>
                    <Link to="/labtest" className={`sidebar-link text-light ${isActive("/labtest") ? "active" : ""}`}>
                        <i className="fa fa-vial"></i>
                        <span>Lab Tests</span>
                    </Link>
                </li>
                <li>
                    <Link to="/labtestbooking" className={`sidebar-link text-light ${isActive("/labtestbooking") ? "active" : ""}`}>
                        <i className="fa fa-clipboard-list"></i>
                        <span>Test Bookings</span>
                    </Link>
                </li>

                <li className="nav-section-label">System</li>
                <li>
                    <Link to="/user" className={`sidebar-link text-light ${isActive("/user") ? "active" : ""}`}>
                        <i className="fa fa-users"></i>
                        <span>Users</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contactus" className={`sidebar-link text-light ${isActive("/contactus") ? "active" : ""}`}>
                        <i className="fa fa-phone-alt"></i>
                        <span>Contact Us</span>
                    </Link>
                </li>
                <li>
                    <Link to="/testimonial" className={`sidebar-link text-light ${isActive("/testimonial") ? "active" : ""}`}>
                        <i className="fa fa-star"></i>
                        <span>Testimonials</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings" className={`sidebar-link text-light ${isActive("/settings") ? "active" : ""}`}>
                        <i className="fa fa-cog"></i>
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}