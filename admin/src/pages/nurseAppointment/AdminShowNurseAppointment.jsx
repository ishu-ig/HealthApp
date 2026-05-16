import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getNurseAppointment,
  updateNurseAppointment,
} from "../../Redux/ActionCreators/NurseAppointmentActionCreators";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .abs-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f5f4f0;
    padding: 2rem 1.5rem;
    color: #1a1a18;
  }

  .abs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .abs-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #5c5c58;
    text-decoration: none;
    background: #fff;
    border: 1px solid #e0dfd9;
    border-radius: 8px;
    padding: 8px 14px;
    transition: all 0.15s ease;
  }

  .abs-back-btn:hover {
    background: #f0efe9;
    color: #1a1a18;
    border-color: #c8c7c0;
  }

  .abs-back-btn svg { width: 14px; height: 14px; }

  .abs-page-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: #1a1a18;
    margin: 0;
  }

  .abs-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 1.25rem;
    max-width: 1100px;
    margin: 0 auto;
    align-items: start;
  }

  @media (max-width: 820px) {
    .abs-grid { grid-template-columns: 1fr; }
  }

  .abs-card {
    background: #fff;
    border: 1px solid #e8e7e1;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .abs-card:last-child { margin-bottom: 0; }

  .abs-card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0efe9;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .abs-card-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .abs-card-icon.blue   { background: #e8f0fb; }
  .abs-card-icon.amber  { background: #fef3e2; }
  .abs-card-icon.purple { background: #f3eefe; }

  .abs-card-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: #888880;
    margin: 0;
  }

  .abs-rows { padding: 8px 0; }

  .abs-row {
    display: flex;
    align-items: flex-start;
    padding: 11px 20px;
    border-bottom: 1px solid #f5f4f0;
    gap: 1rem;
  }

  .abs-row:last-child { border-bottom: none; }

  .abs-row-label {
    font-size: 13px;
    color: #888880;
    font-weight: 500;
    width: 160px;
    flex-shrink: 0;
    padding-top: 1px;
  }

  .abs-row-value {
    font-size: 14px;
    color: #1a1a18;
    font-weight: 400;
    flex: 1;
    min-width: 0;
  }

  .abs-id {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5c5c58;
    background: #f5f4f0;
    padding: 3px 8px;
    border-radius: 5px;
    letter-spacing: 0.3px;
  }

  .abs-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.2px;
  }

  .abs-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  .abs-badge.success { background: #e6f5ed; color: #1a7a41; }
  .abs-badge.success::before  { background: #2da05a; }
  .abs-badge.danger  { background: #fdecea; color: #b02a1e; }
  .abs-badge.danger::before   { background: #e34234; }
  .abs-badge.warning { background: #fff4e1; color: #9a6200; }
  .abs-badge.warning::before  { background: #e89500; }
  .abs-badge.info    { background: #e8f0fb; color: #185fa5; }
  .abs-badge.info::before     { background: #185fa5; }
  .abs-badge.neutral { background: #f0efe9; color: #5c5c58; }
  .abs-badge.neutral::before  { background: #888880; }

  .abs-select {
    margin-top: 8px;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 8px 10px;
    border: 1px solid #e0dfd9;
    border-radius: 8px;
    background: #fafaf8;
    color: #1a1a18;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
  }

  .abs-select:focus { border-color: #888880; }

  .abs-update-btn {
    display: block;
    width: 100%;
    padding: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: #1a1a18;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    letter-spacing: 0.2px;
    margin-top: 4px;
  }

  .abs-update-btn:hover  { background: #333330; }
  .abs-update-btn:active { transform: scale(0.98); }

  .abs-summary-card {
    background: #1a1a18;
    border-radius: 14px;
    padding: 20px;
    color: #fff;
    margin-bottom: 1.25rem;
  }

  .abs-summary-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #888880;
    margin-bottom: 4px;
  }

  .abs-summary-name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 4px;
  }

  .abs-summary-sub { font-size: 13px; color: #888880; }

  .abs-divider {
    border: none;
    border-top: 1px solid #2e2e2c;
    margin: 16px 0;
  }

  .abs-stat-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    align-items: baseline;
  }

  .abs-stat-label { font-size: 12px; color: #888880; }
  .abs-stat-val   { font-size: 13px; font-weight: 500; color: #e8e7e1; }

  .abs-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 14px;
    border-top: 1px solid #2e2e2c;
  }

  .abs-total-label {
    font-size: 12px;
    color: #888880;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .abs-total-val {
    font-family: 'DM Mono', monospace;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }

  .abs-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #f3eefe;
    color: #6b3fbd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .abs-contact-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #5c5c58;
    padding: 3px 0;
  }

  .abs-contact-row svg {
    width: 13px;
    height: 13px;
    opacity: 0.5;
    flex-shrink: 0;
  }
`;

/* ── Status badge helpers ── */
function AppointmentStatusBadge({ status }) {
  const map = {
    Pending:       "warning",
    Accepted:      "info",
    "In Progress": "info",
    Completed:     "success",
    Cancelled:     "danger",
  };
  return <span className={`abs-badge ${map[status] || "neutral"}`}>{status || "—"}</span>;
}

function PaymentStatusBadge({ status }) {
  const map = { Done: "success", Pending: "warning", Failed: "danger" };
  return <span className={`abs-badge ${map[status] || "neutral"}`}>{status || "—"}</span>;
}

export default function AdminNurseAppointmentShow() {
  const { _id } = useParams();
  const NurseAppointmentStateData = useSelector((s) => s.NurseAppointmentStateData);
  const dispatch = useDispatch();

  const [data,          setData]          = useState({});
  const [paymentStatus, setPaymentStatus] = useState("");
  const [flag,          setFlag]          = useState(false);

  useEffect(() => {
    dispatch(getNurseAppointment());
    if (NurseAppointmentStateData.length) {
      const item = NurseAppointmentStateData.find((x) => x._id === _id);
      if (item) {
        setData({ ...item });
        setPaymentStatus(item.paymentStatus);
      } else {
        alert("Invalid Appointment Id");
      }
    }
  }, [NurseAppointmentStateData.length]);

  function updateRecord() {
    if (window.confirm("Are you sure you want to update the payment status?")) {
      const updated = { ...data, paymentStatus };
      dispatch(updateNurseAppointment(updated));
      setData(updated);
      setFlag(!flag);
    }
  }

  /* Can update only when appointment is active and payment not yet done */
  const canUpdate =
    data.appointmentStatus === true && data.paymentStatus !== "Done";

  const initials = data.user?.username
    ? data.user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <style>{styles}</style>
      <div className="abs-wrap">

        {/* ── Header ── */}
        <div className="abs-header" style={{ maxWidth: 1100, margin: "0 auto 2rem" }}>
          <h1 className="abs-page-title">Nurse Appointment Details</h1>
          <Link to="/admin/nurseAppointment" className="abs-back-btn">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Appointments
          </Link>
        </div>

        {/* ── Grid ── */}
        <div className="abs-grid">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Appointment Info */}
            <div className="abs-card">
              <div className="abs-card-header">
                <div className="abs-card-icon blue">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="11" rx="2" stroke="#185fa5" strokeWidth="1.5"/>
                    <path d="M5 2v2M11 2v2M2 7h12" stroke="#185fa5" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="abs-card-title">Appointment Info</p>
              </div>
              <div className="abs-rows">
                <div className="abs-row">
                  <span className="abs-row-label">Appointment ID</span>
                  <span className="abs-row-value">
                    <span className="abs-id">{data._id || "—"}</span>
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Nurse</span>
                  <span className="abs-row-value" style={{ fontWeight: 500 }}>
                    {data.nurse?.name || "—"}
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Hospital</span>
                  <span className="abs-row-value">{data.hospital?.name || "—"}</span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Service Type</span>
                  <span className="abs-row-value">{data.serviceType || "Other"}</span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Date</span>
                  <span className="abs-row-value">
                    {data.date
                      ? new Date(data.date).toLocaleDateString("en-IN", {
                          weekday: "short", day: "numeric", month: "long", year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Appointment Time</span>
                  <span className="abs-row-value">{data.appointmentTime || "—"}</span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Reporting Time</span>
                  <span className="abs-row-value">{data.reportingTime || "—"}</span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Duration</span>
                  <span className="abs-row-value">
                    {data.duration ? `${data.duration} hr${data.duration > 1 ? "s" : ""}` : "—"}
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Address</span>
                  <span className="abs-row-value" style={{ color: "#5c5c58" }}>
                    {data.address || "—"}
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Appointment Status</span>
                  <span className="abs-row-value">
                    <AppointmentStatusBadge status={data.status} />
                  </span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Created</span>
                  <span className="abs-row-value" style={{ color: "#5c5c58", fontSize: 13 }}>
                    {data.createdAt ? new Date(data.createdAt).toLocaleString("en-IN") : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="abs-card">
              <div className="abs-card-header">
                <div className="abs-card-icon amber">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="4" width="14" height="9" rx="2" stroke="#9a6200" strokeWidth="1.5"/>
                    <path d="M1 7h14" stroke="#9a6200" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="abs-card-title">Payment</p>
              </div>
              <div className="abs-rows">
                <div className="abs-row">
                  <span className="abs-row-label">Payment Mode</span>
                  <span className="abs-row-value">{data.paymentMode || "—"}</span>
                </div>
                <div className="abs-row">
                  <span className="abs-row-label">Payment Status</span>
                  <span className="abs-row-value">
                    <PaymentStatusBadge status={data.paymentStatus} />
                    {canUpdate && (
                      <select
                        className="abs-select"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                        <option value="Failed">Failed</option>
                      </select>
                    )}
                  </span>
                </div>
                {data.rppid && (
                  <div className="abs-row">
                    <span className="abs-row-label">Razorpay ID</span>
                    <span className="abs-row-value">
                      <span className="abs-id">{data.rppid}</span>
                    </span>
                  </div>
                )}
              </div>
              {canUpdate && (
                <div style={{ padding: "12px 20px 18px" }}>
                  <button className="abs-update-btn" onClick={updateRecord}>
                    Update Payment Status
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>

            {/* Dark summary card */}
            <div className="abs-summary-card">
              <p className="abs-summary-label">Nurse</p>
              <p className="abs-summary-name">{data.nurse?.name || "—"}</p>
              <p className="abs-summary-sub">
                {data.date
                  ? new Date(data.date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : ""}
                {data.appointmentTime ? ` · ${data.appointmentTime}` : ""}
              </p>
              <hr className="abs-divider" />
              <div className="abs-stat-row">
                <span className="abs-stat-label">Service Type</span>
                <span className="abs-stat-val">{data.serviceType || "Other"}</span>
              </div>
              <div className="abs-stat-row">
                <span className="abs-stat-label">Duration</span>
                <span className="abs-stat-val">
                  {data.duration ? `${data.duration} hr${data.duration > 1 ? "s" : ""}` : "—"}
                </span>
              </div>
              <div className="abs-stat-row">
                <span className="abs-stat-label">Status</span>
                <span className="abs-stat-val">{data.status || "—"}</span>
              </div>
              <div className="abs-total-row">
                <span className="abs-total-label">Fees</span>
                <span className="abs-total-val">₹{data.fees ?? "—"}</span>
              </div>
            </div>

            {/* Customer card */}
            <div className="abs-card">
              <div className="abs-card-header">
                <div className="abs-avatar">{initials}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>
                    {data.user?.username || "Unknown"}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#888880" }}>Patient</p>
                </div>
              </div>
              <div className="abs-rows">
                <div className="abs-row" style={{ flexDirection: "column", gap: 6 }}>
                  <span className="abs-row-label" style={{ width: "auto" }}>Contact</span>
                  <div className="abs-contact-row">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 2h12v12H2z" rx="1"/>
                      <path d="M2 6h12" strokeLinecap="round"/>
                    </svg>
                    {data.user?.phone || "—"}
                  </div>
                </div>
                <div className="abs-row" style={{ flexDirection: "column", gap: 6 }}>
                  <span className="abs-row-label" style={{ width: "auto" }}>Address</span>
                  <div className="abs-contact-row">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" strokeLinejoin="round"/>
                      <circle cx="8" cy="6" r="1.5"/>
                    </svg>
                    {[data.user?.city, data.user?.state, data.user?.pin]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}