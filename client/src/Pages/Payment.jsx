import React, { useEffect, useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

// ── Action Creators ───────────────────────────────────────────────────────────
import { getDoctorAppointment }  from "../Redux/ActionCreators/DoctorAppointmentActionCreators";
import { getNurseAppointment }   from "../Redux/ActionCreators/NurseAppointmentActionCreators";
import { getMedicineCheckout }   from "../Redux/ActionCreators/MedicineCheckoutActionCreators";
import { getLabtestCheckout }    from "../Redux/ActionCreators/LabtestCheckoutActionCreators";

// ── Config per type ───────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  doctor: {
    label:       "Doctor Appointment",
    icon:        "fa-user-md",
    color:       "#0891b2",       // teal
    colorLight:  "rgba(8,145,178,0.08)",
    colorDash:   "rgba(8,145,178,0.2)",
    colorGlow:   "rgba(8,145,178,0.28)",
    colorHover:  "#0e7490",
    orderAPI:    "/api/doctor-appointment/order",
    verifyAPI:   "/api/doctor-appointment/verify",
    confirmPath: "/confirmation/doctor",
    stateKey:    "DoctorAppointmentStateData",
    getAction:   getDoctorAppointment,
    detailRows:  (d) => [
      { icon: "fa-user-md",   label: "Doctor",   value: d.doctor?.name },
      { icon: "fa-hospital",  label: "Hospital", value: d.hospital?.name },
      { icon: "fa-calendar",  label: "Date",     value: d.date ? new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
      { icon: "fa-clock",     label: "Time",     value: d.appointmentTime || "—" },
      { icon: "fa-stethoscope",label:"Mode",     value: d.appointmentMode || "—" },
      { icon: "fa-concierge-bell", label: "Service", value: d.serviceType || "Consultation" },
    ],
  },
  nurse: {
    label:       "Nurse Appointment",
    icon:        "fa-procedures",
    color:       "#7c3aed",       // purple
    colorLight:  "rgba(124,58,237,0.08)",
    colorDash:   "rgba(124,58,237,0.2)",
    colorGlow:   "rgba(124,58,237,0.28)",
    colorHover:  "#6d28d9",
    orderAPI:    "/api/nurse-appointment/order",
    verifyAPI:   "/api/nurse-appointment/verify",
    confirmPath: "/confirmation/nurse",
    stateKey:    "NurseAppointmentStateData",
    getAction:   getNurseAppointment,
    detailRows:  (d) => [
      { icon: "fa-procedures", label: "Nurse",    value: d.nurse?.name },
      { icon: "fa-hospital",   label: "Hospital", value: d.hospital?.name },
      { icon: "fa-calendar",   label: "Date",     value: d.date ? new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
      { icon: "fa-clock",      label: "Time",     value: d.appointmentTime || "—" },
      { icon: "fa-heartbeat",  label: "Service",  value: d.serviceType || "Other" },
      { icon: "fa-hourglass-half", label: "Duration", value: d.duration ? `${d.duration} hr${d.duration > 1 ? "s" : ""}` : "—" },
    ],
  },
  medicine: {
    label:       "Medicine Order",
    icon:        "fa-pills",
    color:       "#059669",       // green
    colorLight:  "rgba(5,150,105,0.08)",
    colorDash:   "rgba(5,150,105,0.2)",
    colorGlow:   "rgba(5,150,105,0.28)",
    colorHover:  "#047857",
    orderAPI:    "/api/medicine-checkout/order",
    verifyAPI:   "/api/medicine-checkout/verify",
    confirmPath: "/confirmation/medicine",
    stateKey:    "MedicineCheckoutStateData",
    getAction:   getMedicineCheckout,
    detailRows:  (d) => [
      { icon: "fa-user",       label: "Customer",  value: d.user?.name || d.user?.username },
      { icon: "fa-pills",      label: "Items",     value: `${d.medicines?.length ?? 0} medicine(s)` },
      { icon: "fa-truck",      label: "Shipping",  value: `₹${d.shipping ?? 0}` },
      { icon: "fa-calculator", label: "Subtotal",  value: `₹${d.subtotal ?? 0}` },
      { icon: "fa-credit-card",label: "Payment",   value: d.paymentMode || "COD" },
    ],
  },
  labtest: {
    label:       "Lab Test Order",
    icon:        "fa-flask",
    color:       "#dc2626",       // red
    colorLight:  "rgba(220,38,38,0.08)",
    colorDash:   "rgba(220,38,38,0.2)",
    colorGlow:   "rgba(220,38,38,0.28)",
    colorHover:  "#b91c1c",
    orderAPI:    "/api/labtest-checkout/order",
    verifyAPI:   "/api/labtest-checkout/verify",
    confirmPath: "/confirmation/labtest",
    stateKey:    "LabtestCheckoutStateData",
    getAction:   getLabtestCheckout,
    detailRows:  (d) => [
      { icon: "fa-user",       label: "Customer",         value: d.user?.name || d.user?.username },
      { icon: "fa-flask",      label: "Tests",            value: `${d.labtests?.length ?? 0} test(s)` },
      { icon: "fa-calendar",   label: "Reservation Date", value: d.reservationDate ? new Date(d.reservationDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
      { icon: "fa-shipping-fast", label: "Delivery Charge", value: `₹${d.deliveryCharge ?? 0}` },
      { icon: "fa-calculator", label: "Subtotal",         value: `₹${d.subtotal ?? 0}` },
    ],
  },
};

export default function Payment() {
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(false);
  const [payError,setPayError]= useState("");

  const { Razorpay } = useRazorpay();
  const navigate     = useNavigate();

  // URL: /payment/:type/:_id  — type is one of doctor | nurse | medicine | labtest
  const { type, _id } = useParams();
  const dispatch       = useDispatch();

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.medicine;

  // Pull the right slice from Redux
  const stateData = useSelector((s) => s[cfg.stateKey]) || [];

  // ── Load record ────────────────────────────────────────────────
  useEffect(() => {
    dispatch(cfg.getAction());
  }, [dispatch, type]);

  useEffect(() => {
    if (stateData.length) {
      const item = _id === "-1"
        ? stateData[0]
        : stateData.find((i) => i._id === _id) || {};
      setData(item);
    }
  }, [stateData.length, _id, type]);

  // ── Open Razorpay modal ────────────────────────────────────────
  const initPayment = (paymentData) => {
    const options = {
      key:      "rzp_test_hPWsSLPsp2DADQ",
      amount:   paymentData.amount,
      currency: "INR",
      order_id: paymentData.id,
      prefill: {
        name:    data?.user?.name || data?.user?.username,
        email:   data?.user?.email,
        contact: data?.user?.phone,
      },

      handler: async (response) => {
        try {
          setLoading(true);
          setPayError("");

          let res = await fetch(
            `${process.env.REACT_APP_BACKEND_SERVER}${cfg.verifyAPI}`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: localStorage.getItem("token"),
              },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                checkid: data._id,
              }),
            }
          );
          res = await res.json();

          if (res.result === "Done") {
            dispatch(cfg.getAction());
            navigate(cfg.confirmPath);
          } else {
            setPayError("Payment verification failed. Please try again.");
          }
        } catch (e) {
          console.error(e);
          setPayError("Something went wrong during verification. Please contact support.");
        } finally {
          setLoading(false);
        }
      },

      "modal.ondismiss": () => {
        setLoading(false);
        setPayError("Payment was cancelled. Your order has not been placed.");
      },

      theme: { color: cfg.color },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (response) => {
      setLoading(false);
      setPayError(`Payment failed: ${response.error.description}.`);
    });
    rzp.open();
  };

  // ── Create order then open modal ───────────────────────────────
  const handlePayment = async () => {
    setLoading(true);
    setPayError("");
    try {
      let res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}${cfg.orderAPI}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ amount: data?.total ?? data?.fees }),
        }
      );
      res = await res.json();
      initPayment(res.data);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setPayError("Could not initiate payment. Please try again.");
    }
  };

  // ── Amount to display — doctor/nurse use "fees", others use "total" ──
  const amountDue = data?.total ?? data?.fees;
  const rows      = cfg.detailRows(data);

  return (
    <>
      <style>{CSS}</style>

      {/* ── Page Shell ── */}
      <div className="pay-shell">
        <div className="pay-wrapper">

          {/* ── Left: Branding panel ── */}
          <div className="pay-left" style={{ "--c": cfg.color, "--cg": cfg.colorGlow }}>
            <div className="pay-left-inner">

              {/* Type icon */}
              <div className="pay-brand-icon" style={{ background: cfg.color, boxShadow: `0 12px 32px ${cfg.colorGlow}` }}>
                <i className={`fa ${cfg.icon}`} />
              </div>

              <h2 className="pay-brand-title">{cfg.label}</h2>
              <p className="pay-brand-sub">Secured with 256-bit SSL encryption</p>

              {/* Trust badges */}
              <div className="pay-trust-grid">
                {[
                  { icon: "fa-lock",        text: "Secure Payment"   },
                  { icon: "fa-shield-alt",  text: "Data Protected"   },
                  { icon: "fa-redo",        text: "Easy Refunds"     },
                  { icon: "fa-headset",     text: "24/7 Support"     },
                ].map(b => (
                  <div className="pay-trust-item" key={b.text}>
                    <div className="pay-trust-icon" style={{ color: cfg.color, borderColor: `${cfg.color}30`, background: cfg.colorLight }}>
                      <i className={`fa ${b.icon}`} />
                    </div>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Payment method pills */}
              <div className="pay-methods">
                {["UPI", "Card", "Net Banking", "Wallet"].map(m => (
                  <span className="pay-method-pill" key={m} style={{ borderColor: `${cfg.color}30`, color: cfg.color, background: cfg.colorLight }}>
                    {m}
                  </span>
                ))}
              </div>

              <p className="pay-powered">
                <i className="fa fa-bolt" style={{ color: cfg.color }} /> Powered by Razorpay
              </p>
            </div>
          </div>

          {/* ── Right: Payment card ── */}
          <div className="pay-right">

            {amountDue ? (
              <>
                {/* Amount due */}
                <div className="pay-amount-box" style={{ background: cfg.colorLight, borderColor: cfg.colorDash }}>
                  <p className="pay-amount-label">Amount Due</p>
                  <p className="pay-amount-value" style={{ color: cfg.color }}>₹{amountDue}</p>
                  <p className="pay-amount-sub">Inclusive of all charges</p>
                </div>

                {/* Order details */}
                <div className="pay-details">
                  <p className="pay-section-label">
                    <i className={`fa ${cfg.icon} me-2`} style={{ color: cfg.color }} />
                    {cfg.label} Details
                  </p>
                  {rows.filter(r => r.value).map(({ icon, label, value }) => (
                    <div className="pay-detail-row" key={label}>
                      <div className="pay-detail-icon" style={{ background: cfg.colorLight, color: cfg.color }}>
                        <i className={`fa ${icon}`} />
                      </div>
                      <div className="pay-detail-text">
                        <span className="pay-detail-label">{label}</span>
                        <span className="pay-detail-value">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error banner */}
                {payError && (
                  <div className="pay-error">
                    <i className="fa fa-exclamation-circle pay-error-icon" />
                    <p>{payError}</p>
                  </div>
                )}

                {/* Pay button */}
                <button
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={loading}
                  style={{
                    background: loading ? "#94a3b8" : cfg.color,
                    boxShadow:  loading ? "none" : `0 6px 24px ${cfg.colorGlow}`,
                    cursor:     loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = cfg.colorHover; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = cfg.color; }}
                >
                  {loading ? (
                    <>
                      <span className="pay-spinner" /> Processing…
                    </>
                  ) : (
                    <>
                      <i className="fa fa-credit-card" /> Pay ₹{amountDue} Securely
                    </>
                  )}
                </button>

                <p className="pay-footer-note">
                  <i className="fa fa-shield-alt" style={{ color: cfg.color }} />
                  Your payment info is never stored on our servers
                </p>
              </>
            ) : (
              /* Loading state */
              <div className="pay-loading">
                <div className="pay-spinner-lg" style={{ borderTopColor: cfg.color }} />
                <p>Loading payment details…</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

  .pay-shell {
    min-height: 100vh;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    font-family: 'Sora', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Wrapper: two-column card ── */
  .pay-wrapper {
    display: grid;
    grid-template-columns: 320px 1fr;
    max-width: 860px;
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.13);
  }

  /* ── Left panel ── */
  .pay-left {
    background: #0f172a;
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .pay-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: var(--cg);
    pointer-events: none;
  }

  .pay-left::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    pointer-events: none;
  }

  .pay-left-inner {
    position: relative;
    z-index: 1;
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .pay-brand-icon {
    width: 64px; height: 64px;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    color: #fff;
    margin-bottom: 22px;
    flex-shrink: 0;
  }

  .pay-brand-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 8px;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  .pay-brand-sub {
    font-size: 0.78rem;
    color: #64748b;
    margin: 0 0 32px;
    font-weight: 500;
  }

  /* Trust grid */
  .pay-trust-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 28px;
  }

  .pay-trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.73rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .pay-trust-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: 1px solid;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }

  /* Method pills */
  .pay-methods {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 24px;
  }

  .pay-method-pill {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 4px 11px;
    border-radius: 999px;
    border: 1px solid;
  }

  .pay-powered {
    margin-top: auto;
    font-size: 0.72rem;
    color: #475569;
    font-weight: 500;
  }

  /* ── Right panel ── */
  .pay-right {
    background: #ffffff;
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Amount box */
  .pay-amount-box {
    border: 1.5px dashed;
    border-radius: 16px;
    padding: 22px;
    text-align: center;
    margin-bottom: 26px;
  }

  .pay-amount-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #94a3b8;
    margin: 0 0 6px;
  }

  .pay-amount-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1;
    margin: 0 0 6px;
    letter-spacing: -0.03em;
  }

  .pay-amount-sub {
    font-size: 0.72rem;
    color: #94a3b8;
    margin: 0;
  }

  /* Details section */
  .pay-details { margin-bottom: 24px; }

  .pay-section-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    margin: 0 0 14px;
  }

  .pay-detail-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .pay-detail-row:last-child { border-bottom: none; }

  .pay-detail-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  .pay-detail-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .pay-detail-label {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .pay-detail-value {
    font-size: 0.87rem;
    color: #0f172a;
    font-weight: 600;
  }

  /* Error banner */
  .pay-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 13px 16px;
    margin-bottom: 20px;
    animation: paySlide 0.3s ease;
  }

  .pay-error-icon {
    color: #dc2626;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .pay-error p {
    margin: 0;
    font-size: 0.82rem;
    color: #991b1b;
    font-weight: 500;
    line-height: 1.5;
  }

  @keyframes paySlide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }

  /* Pay button */
  .pay-btn {
    width: 100%;
    padding: 15px 20px;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-family: 'Sora', sans-serif;
    font-size: 0.93rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-bottom: 14px;
  }

  .pay-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .pay-btn:active:not(:disabled) { transform: scale(0.98); }

  /* Spinner (inline) */
  .pay-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .pay-footer-note {
    text-align: center;
    font-size: 0.72rem;
    color: #94a3b8;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 500;
  }

  /* Loading state */
  .pay-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 60px 0;
    gap: 16px;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .pay-spinner-lg {
    width: 44px; height: 44px;
    border: 3px solid #e2e8f0;
    border-top-color: #0891b2;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .pay-wrapper {
      grid-template-columns: 1fr;
      border-radius: 20px;
    }
    .pay-left { padding: 0; }
    .pay-left-inner { padding: 28px 24px; }
    .pay-brand-title { font-size: 1.15rem; }
    .pay-right { padding: 28px 24px; }
    .pay-amount-value { font-size: 2.2rem; }
    .pay-trust-grid { grid-template-columns: 1fr; gap: 8px; }
  }
`;