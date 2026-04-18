import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ── Import your existing action creators ──────────────────────────────────────
import { getDoctor }            from "../Redux/ActionCreators/DoctorActionCreators";
import { getNurse }             from "../Redux/ActionCreators/NurseActionCreators";
import { getHospital }          from "../Redux/ActionCreators/HospitalActionCreators";
import { getMedicine }          from "../Redux/ActionCreators/MedicineActionCreators";
import { getLabtest }           from "../Redux/ActionCreators/LabtestActionCreators";
// import { getUser }              from "../Redux/ActionCreators/UserActionCreators";
import { getDoctorAppointment } from "../Redux/ActionCreators/DoctorAppointmentActionCreators";
import { getNurseAppointment }  from "../Redux/ActionCreators/NurseAppointmentActionCreators";
import { getLabtestCheckout }    from "../Redux/ActionCreators/LabtestCheckoutActionCreators";
import { getContactUs }         from "../Redux/ActionCreators/ContactUsActionCreators";

export default function Home() {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    // ── Redux state slices ─────────────────────────────────────────────────────
    const doctors            = useSelector(s => s.DoctorStateData        || []);
    const nurses             = useSelector(s => s.NurseStateData         || []);
    const hospitals          = useSelector(s => s.HospitalStateData      || []);
    const medicines          = useSelector(s => s.MedicineStateData      || []);
    const labtests           = useSelector(s => s.LabtestStateData       || []);
    const users              = useSelector(s => s.UserStateData          || []);
    const doctorAppointments = useSelector(s => s.DoctorAppointmentStateData || []);
    const nurseAppointments  = useSelector(s => s.NurseAppointmentStateData  || []);
    const labtestBookings    = useSelector(s => s.LabtestBookingStateData    || []);
    const contacts           = useSelector(s => s.ContactUsStateData         || []);

    useEffect(() => {
        dispatch(getDoctor());
        dispatch(getNurse());
        dispatch(getHospital());
        dispatch(getMedicine());
        dispatch(getLabtest());
        // dispatch(getUser());
        dispatch(getDoctorAppointment());
        dispatch(getNurseAppointment());
        dispatch(getLabtestCheckout());
        dispatch(getContactUs());
        setTimeout(() => setLoaded(true), 200);
    }, []);

    // ── Derived stats ──────────────────────────────────────────────────────────
    const pendingDocAppts    = doctorAppointments.filter(a => a.status === "Pending").length;
    const pendingNurseAppts  = nurseAppointments.filter(a  => a.status === "Pending").length;
    const pendingPayments    = [...doctorAppointments, ...nurseAppointments]
                                .filter(a => a.paymentStatus === "Pending").length;
    const pendingContacts    = contacts.filter(c => c.active).length;
    const totalRevenue       = [...doctorAppointments, ...nurseAppointments, ...labtestBookings]
                                .filter(a => a.paymentStatus === "Done")
                                .reduce((sum, a) => sum + (a.fees || a.finalPrice || 0), 0);

    // ── Recent appointments (last 5) ───────────────────────────────────────────
    const recentAppointments = [...doctorAppointments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const recentNurseAppts = [...nurseAppointments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // ── Appointment status breakdown for mini chart ────────────────────────────
    const statusCounts = {
        Pending:     doctorAppointments.filter(a => a.status === "Pending").length,
        Accepted:    doctorAppointments.filter(a => a.status === "Accepted").length,
        "In Progress": doctorAppointments.filter(a => a.status === "In Progress").length,
        Completed:   doctorAppointments.filter(a => a.status === "Completed").length,
        Cancelled:   doctorAppointments.filter(a => a.status === "Cancelled").length,
    };
    const totalAppts = Object.values(statusCounts).reduce((s, v) => s + v, 0) || 1;

    const statusColors = {
        Pending:      "#F7C35F",
        Accepted:     "#4F8EF7",
        "In Progress":"#38EFC3",
        Completed:    "#38EF91",
        Cancelled:    "#F75F5F",
    };

    // ── Stat cards config ──────────────────────────────────────────────────────
    const statCards = [
        { label: "Doctors",            value: doctors.length,            icon: "fa-stethoscope",    accent: "#4F8EF7", link: "/doctor" },
        { label: "Nurses",             value: nurses.length,             icon: "fa-user-nurse",     accent: "#38EFC3", link: "/nurse" },
        { label: "Hospitals",          value: hospitals.length,          icon: "fa-hospital",       accent: "#A78BFA", link: "/hospital" },
        { label: "Patients",           value: users.length,              icon: "fa-users",          accent: "#F7C35F", link: "/user" },
        { label: "Medicines",          value: medicines.length,          icon: "fa-capsules",       accent: "#38EF91", link: "/medicine" },
        { label: "Lab Tests",          value: labtests.length,           icon: "fa-vial",           accent: "#F97316", link: "/labtest" },
        { label: "Doctor Appointments",value: doctorAppointments.length, icon: "fa-calendar-check", accent: "#EC4899", link: "/doctorAppointment" },
        { label: "Nurse Appointments", value: nurseAppointments.length,  icon: "fa-calendar-plus",  accent: "#14B8A6", link: "/nurseAppointment" },
    ];

    const alertCards = [
        { label: "Pending Doc Appts",  value: pendingDocAppts,   icon: "fa-clock",        color: "#F7C35F" },
        { label: "Pending Nurse Appts",value: pendingNurseAppts, icon: "fa-clock",        color: "#F97316" },
        { label: "Pending Payments",   value: pendingPayments,   icon: "fa-credit-card",  color: "#F75F5F" },
        { label: "New Messages",       value: pendingContacts,   icon: "fa-envelope",     color: "#4F8EF7" },
    ];

    const fmtCurrency = n => "₹" + n.toLocaleString("en-IN");
    const fmtStatus   = s => ({
        Pending:      { cls: "dash-badge dash-badge--warn",    label: "Pending" },
        Accepted:     { cls: "dash-badge dash-badge--info",    label: "Accepted" },
        "In Progress":{ cls: "dash-badge dash-badge--teal",    label: "In Progress" },
        Completed:    { cls: "dash-badge dash-badge--success", label: "Completed" },
        Cancelled:    { cls: "dash-badge dash-badge--danger",  label: "Cancelled" },
    }[s] || { cls: "dash-badge", label: s });

    return (
        <div className={`dash-root ${loaded ? "dash-loaded" : ""}`}>

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">Dashboard</h1>
                    <p className="dash-subtitle">Welcome back, Admin — here's what's happening today.</p>
                </div>
                <div className="dash-header-right">
                    <span className="dash-date">
                        <i className="fa fa-calendar-alt"></i>
                        {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                    </span>
                </div>
            </div>

            {/* ── Revenue Banner ──────────────────────────────────────────── */}
            <div className="dash-revenue-banner">
                <div className="dash-revenue-inner">
                    <div>
                        <p className="dash-revenue-label">Total Revenue Collected</p>
                        <p className="dash-revenue-value">{fmtCurrency(totalRevenue)}</p>
                    </div>
                    <div className="dash-revenue-icon">
                        <i className="fa fa-rupee-sign"></i>
                    </div>
                </div>
                <div className="dash-revenue-sub">
                    <span><i className="fa fa-check-circle"></i> From {[...doctorAppointments,...nurseAppointments,...labtestBookings].filter(a=>a.paymentStatus==="Done").length} completed payments</span>
                    <span><i className="fa fa-exclamation-circle"></i> {pendingPayments} payments still pending</span>
                </div>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────────────── */}
            <div className="dash-stat-grid">
                {statCards.map((c, i) => (
                    <Link to={c.link} key={i} className="dash-stat-card" style={{"--card-accent": c.accent, animationDelay: `${i * 0.05}s`}}>
                        <div className="dash-stat-icon" style={{background: c.accent + "22", color: c.accent}}>
                            <i className={`fa ${c.icon}`}></i>
                        </div>
                        <div className="dash-stat-info">
                            <span className="dash-stat-value">{c.value}</span>
                            <span className="dash-stat-label">{c.label}</span>
                        </div>
                        <div className="dash-stat-arrow">
                            <i className="fa fa-arrow-right"></i>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── Alert Row ───────────────────────────────────────────────── */}
            <div className="dash-alert-grid">
                {alertCards.map((c, i) => (
                    <div key={i} className="dash-alert-card" style={{"--alert-color": c.color, animationDelay: `${0.4 + i * 0.07}s`}}>
                        <i className={`fa ${c.icon}`} style={{color: c.color}}></i>
                        <span className="dash-alert-value" style={{color: c.color}}>{c.value}</span>
                        <span className="dash-alert-label">{c.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Middle Row: Status Chart + Recent Doctor Appointments ────── */}
            <div className="dash-mid-grid">

                {/* Appointment Status Breakdown */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2 className="dash-card-title"><i className="fa fa-chart-pie"></i> Appointment Status</h2>
                        <Link to="/doctorAppointment" className="dash-card-link">View all</Link>
                    </div>
                    <div className="dash-status-chart">
                        {Object.entries(statusCounts).map(([status, count]) => {
                            const pct = Math.round((count / totalAppts) * 100);
                            return (
                                <div key={status} className="dash-status-row">
                                    <span className="dash-status-name">{status}</span>
                                    <div className="dash-status-bar-track">
                                        <div
                                            className="dash-status-bar-fill"
                                            style={{width: `${pct}%`, background: statusColors[status]}}
                                        ></div>
                                    </div>
                                    <span className="dash-status-count" style={{color: statusColors[status]}}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Donut-style legend */}
                    <div className="dash-status-legend">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status} className="dash-legend-item">
                                <span className="dash-legend-dot" style={{background: statusColors[status]}}></span>
                                <span>{status}: <strong>{count}</strong></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Doctor Appointments */}
                <div className="dash-card dash-card--wide">
                    <div className="dash-card-header">
                        <h2 className="dash-card-title"><i className="fa fa-calendar-check"></i> Recent Doctor Appointments</h2>
                        <Link to="/doctorAppointment" className="dash-card-link">View all</Link>
                    </div>
                    {recentAppointments.length === 0 ? (
                        <p className="dash-empty">No appointments yet.</p>
                    ) : (
                        <div className="dash-table-wrap">
                            <table className="dash-table">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Fees</th>
                                        <th>Status</th>
                                        <th>Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAppointments.map((a, i) => {
                                        const s = fmtStatus(a.status);
                                        return (
                                            <tr key={i}>
                                                <td>{a.user?.username || "—"}</td>
                                                <td>{a.doctor?.name  || "—"}</td>
                                                <td>{a.date ? new Date(a.date).toLocaleDateString("en-IN") : "—"}</td>
                                                <td>₹{a.fees}</td>
                                                <td><span className={s.cls}>{s.label}</span></td>
                                                <td>
                                                    <span className={`dash-badge ${a.paymentStatus === "Done" ? "dash-badge--success" : a.paymentStatus === "Failed" ? "dash-badge--danger" : "dash-badge--warn"}`}>
                                                        {a.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom Row: Recent Nurse Appointments + Quick Links ──────── */}
            <div className="dash-bottom-grid">

                {/* Recent Nurse Appointments */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2 className="dash-card-title"><i className="fa fa-user-nurse"></i> Recent Nurse Appointments</h2>
                        <Link to="/nurseAppointment" className="dash-card-link">View all</Link>
                    </div>
                    {recentNurseAppts.length === 0 ? (
                        <p className="dash-empty">No nurse appointments yet.</p>
                    ) : (
                        <div className="dash-table-wrap">
                            <table className="dash-table">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Nurse</th>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentNurseAppts.map((a, i) => {
                                        const s = fmtStatus(a.status);
                                        return (
                                            <tr key={i}>
                                                <td>{a.user?.username || "—"}</td>
                                                <td>{a.nurse?.name   || "—"}</td>
                                                <td>{a.serviceType   || "—"}</td>
                                                <td>{a.date ? new Date(a.date).toLocaleDateString("en-IN") : "—"}</td>
                                                <td><span className={s.cls}>{s.label}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h2 className="dash-card-title"><i className="fa fa-bolt"></i> Quick Actions</h2>
                    </div>
                    <div className="dash-quick-grid">
                        {[
                            { label: "Add Doctor",       icon: "fa-stethoscope",   link: "/doctor/create",            color: "#4F8EF7" },
                            { label: "Add Nurse",        icon: "fa-user-nurse",    link: "/nurse/create",             color: "#38EFC3" },
                            { label: "Add Hospital",     icon: "fa-hospital",      link: "/hospital/create",          color: "#A78BFA" },
                            { label: "Add Medicine",     icon: "fa-capsules",      link: "/medicine/create",          color: "#38EF91" },
                            { label: "Add Lab Test",     icon: "fa-vial",          link: "/labtest/create",           color: "#F97316" },
                            { label: "View Messages",    icon: "fa-envelope",      link: "/contactus",                color: "#F75F5F" },
                            { label: "View Users",       icon: "fa-users",         link: "/user",                     color: "#F7C35F" },
                            { label: "Testimonials",     icon: "fa-star",          link: "/testimonial",              color: "#EC4899" },
                        ].map((q, i) => (
                            <Link to={q.link} key={i} className="dash-quick-btn" style={{"--q-color": q.color}}>
                                <i className={`fa ${q.icon}`} style={{color: q.color}}></i>
                                <span>{q.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}