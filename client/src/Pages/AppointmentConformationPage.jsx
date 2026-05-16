import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import { getNurseAppointment }  from '../Redux/ActionCreators/NurseAppointmentActionCreators';

/* ─── Per-type config ─────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  doctor: {
    stateKey:   'DoctorAppointmentStateData',
    getAction:  getDoctorAppointment,
    accent:     '#0891b2',
    accentDark: '#0e7490',
    accentGlow: 'rgba(8,145,178,0.22)',
    accentFaint:'rgba(8,145,178,0.08)',
    accentBorder:'rgba(8,145,178,0.2)',
    headerBg:   'linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%)',
    icon:       '🩺',
    label:      'Doctor Appointment',
    personLabel:'Doctor',
    personIcon: 'fa-user-md',
    placeLabel: 'Hospital',
    placeIcon:  'fa-hospital',
    backTo:     '/doctor-appointment',
    backLabel:  'My Appointments',
    prefix:     'DREC',
    rows: (d) => [
      { icon: 'fa-stethoscope',   label: 'Service',          value: d.serviceType || 'Consultation' },
      { icon: 'fa-laptop-medical',label: 'Mode',             value: d.appointmentMode || '—' },
      { icon: 'fa-calendar-alt',  label: 'Date',             value: d.date ? new Date(d.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—' },
      { icon: 'fa-clock',         label: 'Appointment Time', value: d.appointmentTime || '—' },
      { icon: 'fa-clipboard',     label: 'Reporting Time',   value: d.reportingTime || '—' },
    ],
    amountLabel: 'Consultation Fees',
    amountKey:   'fees',
    personName:  (d) => d.doctor?.name,
    placeName:   (d) => d.hospital?.name,
    placeAddress:(d) => d.hospital?.address,
  },
  nurse: {
    stateKey:   'NurseAppointmentStateData',
    getAction:  getNurseAppointment,
    accent:     '#7c3aed',
    accentDark: '#6d28d9',
    accentGlow: 'rgba(124,58,237,0.22)',
    accentFaint:'rgba(124,58,237,0.08)',
    accentBorder:'rgba(124,58,237,0.2)',
    headerBg:   'linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)',
    icon:       '🏥',
    label:      'Nurse Appointment',
    personLabel:'Nurse',
    personIcon: 'fa-user-nurse',
    placeLabel: 'Hospital',
    placeIcon:  'fa-hospital',
    backTo:     '/nurse-appointment',
    backLabel:  'My Appointments',
    prefix:     'NREC',
    rows: (d) => [
      { icon: 'fa-heartbeat',         label: 'Service',    value: d.serviceType || 'Other' },
      { icon: 'fa-calendar-alt',      label: 'Date',       value: d.date ? new Date(d.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—' },
      { icon: 'fa-clock',             label: 'Time',       value: d.appointmentTime || '—' },
      { icon: 'fa-hourglass-half',    label: 'Duration',   value: d.duration ? `${d.duration} hr${d.duration>1?'s':''}` : '—' },
      { icon: 'fa-map-marker-alt',    label: 'Address',    value: d.address || '—' },
    ],
    amountLabel: 'Service Fees',
    amountKey:   'fees',
    personName:  (d) => d.nurse?.name,
    placeName:   (d) => d.hospital?.name,
    placeAddress:(d) => d.hospital?.address,
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtDate(d) {
  return new Date(d || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function AppointmentConfirmationPage() {
  const { type, _id } = useParams();   // /confirmation/:type/:_id
  const dispatch      = useDispatch();
  const navigate      = useNavigate();

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.doctor;

  const stateData = useSelector(s => s[cfg.stateKey]) || [];
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await dispatch(cfg.getAction());
      } catch {
        setError('Failed to fetch appointment data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, type]);

  useEffect(() => {
  if (loading) return;

  const appt = stateData.find((x) => x._id === _id);

  if (appt) {
    setData(appt);
    setError(null);
    setTimeout(() => setVisible(true), 60);
  } else {
    setError('Appointment not found.');
  }
}, [stateData, _id, loading]);
  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4', flexDirection: 'column', gap: 16 }}>
      <style>{`@keyframes acp-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 48, height: 48, border: `3px solid ${cfg.accent}30`, borderTopColor: cfg.accent, borderRadius: '50%', animation: 'acp-spin 0.8s linear infinite' }} />
      <p style={{ fontFamily: "'Outfit', sans-serif", color: '#94a3b8', fontSize: '0.9rem' }}>Loading appointment…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>⚠️</span>
        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#0f172a', marginBottom: 8 }}>Something went wrong</p>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  const isConfirmed = data.status !== 'Cancelled' && data.appointmentStatus !== false;
  const isPaid      = /paid|done|success/i.test(data.paymentStatus || '');
  const amount      = data[cfg.amountKey];
  const rows        = cfg.rows(data);

  return (
    <>
      <style>{CSS(cfg.accent)}</style>

      <div className="acp-shell">
        {/* Decorative background blobs */}
        <div className="acp-blob acp-blob-1" style={{ background: cfg.accentGlow }} />
        <div className="acp-blob acp-blob-2" style={{ background: 'rgba(15,23,42,0.04)' }} />

        <div className={`acp-wrapper${visible ? ' acp-wrapper--in' : ''}`}>

          {/* ── Header strip ── */}
          <div className="acp-header" style={{ background: cfg.headerBg }}>
            {/* Noise texture overlay */}
            <div className="acp-header-noise" />

            {/* Status icon */}
            <div className={`acp-status-icon${isConfirmed ? ' acp-status-icon--ok' : ' acp-status-icon--cancel'}`}>
              <i className={`fa ${isConfirmed ? 'fa-check' : 'fa-times'}`} />
            </div>

            <h1 className="acp-header-title">
              {isConfirmed ? 'Appointment Confirmed!' : 'Appointment Cancelled'}
            </h1>
            <p className="acp-header-sub">
              {isConfirmed
                ? 'Your appointment has been booked successfully. Please arrive on time.'
                : 'This appointment has been cancelled. You may book a new one anytime.'}
            </p>

            {/* Type badge */}
            <div className="acp-type-badge">
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="acp-body">

            {/* Booking ID */}
            <div className="acp-id-row">
              <span className="acp-id-label">Appointment ID</span>
              <span className="acp-id-value">{data._id}</span>
            </div>

            {/* Two-column: Person + Place */}
            <div className="acp-two-col">
              {/* Person (doctor / nurse) */}
              <div className="acp-info-chip" style={{ borderColor: cfg.accentBorder, background: cfg.accentFaint }}>
                <div className="acp-chip-icon" style={{ background: cfg.accent }}>
                  <i className={`fa ${cfg.personIcon}`} />
                </div>
                <div>
                  <div className="acp-chip-label">{cfg.personLabel}</div>
                  <div className="acp-chip-value">{cfg.personName(data) || '—'}</div>
                </div>
              </div>

              {/* Hospital */}
              <div className="acp-info-chip" style={{ borderColor: cfg.accentBorder, background: cfg.accentFaint }}>
                <div className="acp-chip-icon" style={{ background: cfg.accent }}>
                  <i className={`fa ${cfg.placeIcon}`} />
                </div>
                <div>
                  <div className="acp-chip-label">{cfg.placeLabel}</div>
                  <div className="acp-chip-value">{cfg.placeName(data) || '—'}</div>
                  {cfg.placeAddress(data) && (
                    <div className="acp-chip-sub">{cfg.placeAddress(data)}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail rows */}
            <div className="acp-rows">
              <div className="acp-rows-label" style={{ color: cfg.accent }}>Appointment Details</div>
              {rows.map(({ icon, label, value }) => value && value !== '—' ? (
                <div key={label} className="acp-detail-row">
                  <div className="acp-detail-left">
                    <div className="acp-detail-icon" style={{ background: cfg.accentFaint, color: cfg.accent }}>
                      <i className={`fa ${icon}`} />
                    </div>
                    <span className="acp-detail-label">{label}</span>
                  </div>
                  <span className="acp-detail-value">{value}</span>
                </div>
              ) : null)}
            </div>

            {/* Divider */}
            <div className="acp-divider" />

            {/* Payment section */}
            <div className="acp-pay-row">
              <div className="acp-pay-cell">
                <div className="acp-pay-label">Payment Mode</div>
                <div className="acp-pay-value">
                  <i className={`fa ${['COD','Cash'].includes(data.paymentMode) ? 'fa-money-bill-wave' : 'fa-university'}`}
                     style={{ color: cfg.accent, fontSize: '0.8rem' }} />
                  {data.paymentMode || '—'}
                </div>
              </div>

              <div className="acp-pay-cell" style={{ background: isPaid ? 'rgba(5,150,105,0.07)' : 'rgba(245,158,11,0.07)', borderColor: isPaid ? 'rgba(5,150,105,0.2)' : 'rgba(245,158,11,0.2)' }}>
                <div className="acp-pay-label">Payment Status</div>
                <div className="acp-pay-value" style={{ color: isPaid ? '#059669' : '#d97706' }}>
                  <i className={`fa ${isPaid ? 'fa-check-circle' : 'fa-hourglass-half'}`} style={{ fontSize: '0.8rem' }} />
                  {data.paymentStatus || 'Pending'}
                </div>
              </div>

              {data.rppid && (
                <div className="acp-pay-cell" style={{ gridColumn: '1 / -1' }}>
                  <div className="acp-pay-label">Razorpay ID</div>
                  <div className="acp-pay-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{data.rppid}</div>
                </div>
              )}
            </div>

            {/* Amount highlight */}
            <div className="acp-amount" style={{ background: cfg.accentFaint, borderColor: cfg.accentBorder }}>
              <div className="acp-amount-label" style={{ color: cfg.accent }}>{cfg.amountLabel}</div>
              <div className="acp-amount-value" style={{ color: cfg.accent }}>
                ₹{amount ?? '—'}
              </div>
            </div>

            {/* Booked on */}
            {data.createdAt && (
              <p className="acp-booked-on">
                <i className="fa fa-calendar-check" style={{ color: cfg.accent }} />
                Booked on {fmtDate(data.createdAt)}
              </p>
            )}

          </div>

          {/* ── Footer actions ── */}
          <div className="acp-footer">
            <Link to="/" className="acp-btn-primary" style={{ background: cfg.accent, '--hover': cfg.accentDark }}>
              <i className="fa fa-home" />
              Home
            </Link>
            <Link to={cfg.backTo} className="acp-btn-secondary">
              <i className="fa fa-list-ul" />
              {cfg.backLabel}
            </Link>
            {/* <Link to={`/order-detail/${type}/${_id}`} className="acp-btn-outline" style={{ borderColor: cfg.accentBorder, color: cfg.accent }}>
              <i className="fa fa-eye" />
              Track
            </Link> */}
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

  .acp-shell {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    background: #f8f7f4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Background blobs */
  .acp-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }
  .acp-blob-1 { width: 480px; height: 480px; top: -120px; right: -120px; opacity: 0.55; }
  .acp-blob-2 { width: 360px; height: 360px; bottom: -80px; left: -80px; }

  /* ── Card wrapper ── */
  .acp-wrapper {
    width: 100%;
    max-width: 560px;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(15,23,42,0.14), 0 0 0 1px rgba(15,23,42,0.06);
    position: relative;
    z-index: 1;
    opacity: 0;
    transform: translateY(32px) scale(0.97);
    transition: opacity 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1);
  }

  .acp-wrapper--in {
    opacity: 1;
    transform: none;
  }

  /* ── Header ── */
  .acp-header {
    padding: 44px 36px 36px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .acp-header-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }

  /* Status icon */
  .acp-status-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    position: relative;
    z-index: 1;
    animation: acp-pop 0.6s cubic-bezier(.4,0,.2,1) 0.25s both;
  }

  .acp-status-icon--ok   { background: rgba(255,255,255,0.18); }
  .acp-status-icon--cancel { background: rgba(239,68,68,0.3); }

  .acp-status-icon i {
    font-size: 1.7rem;
    color: #fff;
  }

  @keyframes acp-pop {
    from { transform: scale(0) rotate(-15deg); opacity: 0; }
    70%  { transform: scale(1.12) rotate(3deg); }
    to   { transform: scale(1) rotate(0); opacity: 1; }
  }

  .acp-header-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.7rem;
    color: #fff;
    margin: 0 0 8px;
    line-height: 1.2;
    position: relative;
    z-index: 1;
  }

  .acp-header-sub {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.65);
    margin: 0 0 18px;
    line-height: 1.6;
    position: relative;
    z-index: 1;
  }

  .acp-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.06em;
    position: relative;
    z-index: 1;
  }

  /* ── Body ── */
  .acp-body { padding: 28px 32px 20px; }

  /* Booking ID */
  .acp-id-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    background: #f8f7f4;
    border-radius: 10px;
    border: 1px dashed #e2e0d8;
    margin-bottom: 20px;
  }

  .acp-id-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
  }

  .acp-id-value {
    font-family: monospace;
    font-size: 0.78rem;
    font-weight: 600;
    color: #334155;
    word-break: break-all;
    text-align: right;
    max-width: 60%;
  }

  /* Two-column info chips */
  .acp-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 22px;
  }

  .acp-info-chip {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px;
    border-radius: 12px;
    border: 1px solid;
  }

  .acp-chip-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 14px;
    flex-shrink: 0;
  }

  .acp-chip-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-bottom: 3px;
  }

  .acp-chip-value {
    font-size: 0.86rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
  }

  .acp-chip-sub {
    font-size: 0.72rem;
    color: #94a3b8;
    margin-top: 2px;
    line-height: 1.4;
  }

  /* Detail rows */
  .acp-rows { margin-bottom: 20px; }

  .acp-rows-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 10px;
  }

  .acp-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f0eb;
  }

  .acp-detail-row:last-child { border-bottom: none; }

  .acp-detail-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .acp-detail-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
  }

  .acp-detail-label {
    font-size: 0.82rem;
    color: #64748b;
    font-weight: 500;
  }

  .acp-detail-value {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0f172a;
    text-align: right;
    max-width: 55%;
  }

  /* Divider */
  .acp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e0d8, transparent);
    margin: 18px 0;
  }

  /* Payment section */
  .acp-pay-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }

  .acp-pay-cell {
    padding: 12px 14px;
    background: #f8f7f4;
    border-radius: 10px;
    border: 1px solid #e8e6df;
  }

  .acp-pay-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-bottom: 5px;
  }

  .acp-pay-value {
    font-size: 0.87rem;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Amount highlight */
  .acp-amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1.5px dashed;
    margin-bottom: 14px;
  }

  .acp-amount-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .acp-amount-value {
    font-family: 'DM Serif Display', serif;
    font-size: 1.9rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  /* Booked on */
  .acp-booked-on {
    font-size: 0.75rem;
    color: #94a3b8;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0;
    font-weight: 500;
  }

  /* ── Footer ── */
  .acp-footer {
    padding: 18px 32px 28px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .acp-btn-primary, .acp-btn-secondary, .acp-btn-outline {
    flex: 1; min-width: 100px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 16px;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.84rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }

  .acp-btn-primary {
    color: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .acp-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }

  .acp-btn-secondary {
    background: #f1f0eb;
    color: #374151;
    border: 1px solid #e8e6df;
  }
  .acp-btn-secondary:hover { background: #e8e6df; }

  .acp-btn-outline {
    background: transparent;
    border: 1.5px solid;
  }
  .acp-btn-outline:hover { background: ${accent}12; }

  @keyframes acp-spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 520px) {
    .acp-header { padding: 36px 24px 28px; }
    .acp-body   { padding: 22px 20px 16px; }
    .acp-footer { padding: 14px 20px 24px; flex-direction: column; }
    .acp-two-col { grid-template-columns: 1fr; }
    .acp-pay-row { grid-template-columns: 1fr; }
    .acp-header-title { font-size: 1.4rem; }
    .acp-amount-value  { font-size: 1.6rem; }
    .acp-btn-primary, .acp-btn-secondary, .acp-btn-outline { min-width: unset; }
  }
`