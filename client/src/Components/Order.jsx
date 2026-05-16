import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// ─── Import your real action creators below ────────────────────────────────
// import { updateMedicineCheckout }   from '../Redux/ActionCreators/MedicineCheckoutActionCreators';
// import { updateLabtestCheckout }    from '../Redux/ActionCreators/LabtestCheckoutActionCreators';
// import { updateDoctorAppointment }  from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
// import { updateNurseAppointment }   from '../Redux/ActionCreators/NurseAppointmentActionCreators';

// ─── Design tokens (mirrors your existing C / S pattern) ──────────────────
const C = {
  primary:       'var(--primary)',
  primaryLight:  'rgba(200,64,10,0.07)',
  primaryBorder: 'rgba(200,64,10,0.16)',
  secondary:     'var(--secondary)',
  accent:        'var(--accent)',
  dark:          'var(--dark)',
  gray:          'var(--gray)',
  light:         'var(--light)',
  border:        'var(--border)',
  cardBg:        'var(--card-bg)',
  radius:        'var(--radius)',
  radiusSm:      'var(--radius-sm)',
  shadowSm:      'var(--shadow-sm)',
  shadowMd:      'var(--shadow-md)',
  transition:    'var(--transition)',
  // Type-specific accent colours
  medicine: { bg: 'rgba(22,163,74,0.07)',  border: 'rgba(22,163,74,0.2)',  text: '#16a34a' },
  labtest:  { bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6' },
  doctor:   { bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)', text: '#8b5cf6' },
  nurse:    { bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.2)', text: '#ec4899' },
};

const S = {
  page:      { background: C.light, minHeight: '100vh', padding: '48px 0 80px' },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, color: C.dark, marginBottom: 6 },
  pageSub:   { fontSize: '0.88rem', color: C.gray, marginBottom: 36 },
  card: {
    background: '#fff', borderRadius: C.radius, boxShadow: C.shadowSm,
    border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 24,
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    flexWrap: 'wrap', gap: 12, padding: '18px 24px',
    borderBottom: `1px solid ${C.border}`, background: C.cardBg,
  },
  idLabel:  { fontSize: '0.7rem', fontWeight: 700, color: C.gray, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 },
  idValue:  { fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600, color: C.dark, background: C.primaryLight, border: `1px solid ${C.primaryBorder}`, padding: '3px 10px', borderRadius: 6, display: 'inline-block' },
  createdAt:{ fontSize: '0.78rem', color: C.gray, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 },
  statusPill: (ok) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
    background: ok ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
    color:      ok ? '#16a34a' : '#ef4444',
    border:     ok ? '1px solid rgba(22,163,74,0.25)' : '1px solid rgba(239,68,68,0.25)',
  }),
  statusDot: (ok) => ({ width: 7, height: 7, borderRadius: '50%', background: ok ? '#16a34a' : '#ef4444', animation: ok ? 'pulse 2s infinite' : 'none', flexShrink: 0 }),
  cardBody:  { padding: '0 24px' },
  itemRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '16px 0', borderBottom: `1px solid ${C.border}` },
  itemName:  { fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.95rem', color: C.dark, flex: '1 1 160px' },
  itemMeta:  { fontSize: '0.78rem', color: C.gray, marginTop: 3 },
  itemBadge: (colors) => ({
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 50,
    fontSize: '0.75rem', fontWeight: 600, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
  }),
  itemTotal: { fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', color: C.primary, textAlign: 'right', flexShrink: 0 },
  infoGrid:  { display: 'flex', flexWrap: 'wrap', gap: 12, padding: '16px 0' },
  infoChip:  (colors) => ({
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: C.radiusSm,
    background: colors.bg, border: `1px solid ${colors.border}`, flex: '1 1 140px',
  }),
  chipIcon:  (colors) => ({ color: colors.text, fontSize: '0.88rem', flexShrink: 0 }),
  chipLabel: { fontSize: '0.68rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  chipVal:   { fontSize: '0.85rem', fontWeight: 700, color: C.dark },
  cardFooter:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '16px 24px', background: C.cardBg, borderTop: `1px solid ${C.border}` },
  payLabel:  { fontSize: '0.7rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 },
  payValue:  { fontSize: '0.88rem', fontWeight: 600, color: C.dark },
  payStatus: (pending) => ({ fontSize: '0.82rem', fontWeight: 700, color: pending ? '#ef4444' : '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }),
  totalAmt:  { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 900, color: C.primary },
  totalLabel:{ fontSize: '0.7rem', color: C.gray, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 },
  btnRow:    { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  cancelBtn: { padding: '8px 20px', borderRadius: 50, border: '1.5px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: C.transition, display: 'flex', alignItems: 'center', gap: 6 },
  disabledBtn:{ padding: '8px 20px', borderRadius: 50, border: `1.5px solid ${C.border}`, background: C.light, color: C.gray, fontWeight: 600, fontSize: '0.82rem', cursor: 'not-allowed', opacity: 0.6, display: 'flex', alignItems: 'center', gap: 6 },
  viewBtn:   (colors) => ({ padding: '8px 20px', borderRadius: 50, border: `1.5px solid ${colors.border}`, background: colors.bg, color: colors.text, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: C.transition }),
  empty:     { padding: '64px 24px', textAlign: 'center', background: '#fff', borderRadius: C.radius, border: `1px dashed ${C.primaryBorder}`, boxShadow: C.shadowSm },
  emptyIcon: { fontSize: '3.5rem', color: C.border, display: 'block', marginBottom: 16 },
  emptyTitle:{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 900, color: C.dark, marginBottom: 8 },
  emptyText: { fontSize: '0.88rem', color: C.gray, marginBottom: 24 },
  shopBtn:   { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 50, background: C.primary, color: '#fff', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(200,64,10,0.3)', transition: C.transition },
  // Type badge in header
  typeBadge: (colors) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }),
};

// ─── Config per title ──────────────────────────────────────────────────────
const CONFIG = {
  MedicineOrder: {
    label:       'Medicine Orders',
    icon:        'fa-pills',
    emptyIcon:   'fa-prescription-bottle',
    emptyTitle:  'No Medicine Orders Yet',
    emptyText:   "You haven't ordered any medicines. Browse our pharmacy!",
    shopLink:    '/medicine',
    shopLabel:   'Browse Medicines',
    shopIcon:    'fa-pills',
    detailRoute: '/order-detail/medicine',
    colors:      C.medicine,
    // Which field holds the list of items
    itemsKey:    'medicines',
    // Status field & "active" condition
    statusKey:   'orderStatus',
    isActive:    (item) => item?.orderStatus !== 'Cancelled',
    statusLabel: (item) => item?.orderStatus || 'Placed',
    // Cancel eligibility (order-style: no time window)
    canCancel:   canCancelOrder,
    cancelField: 'orderStatus',
    cancelValue: 'Cancelled',
    // Column labels for item rows
    nameKey:     (prod) => prod?.medicine?.name || prod?.name || '—',
    qtyKey:      (prod) => prod?.qty,
    priceKey:    (prod) => prod?.medicine?.finalPrice || prod?.price,
    totalKey:    (prod) => prod?.total,
    // Footer totals
    totalField:  'total',
    subtotalField: 'subtotal',
    extraChargeLabel: 'Shipping',
    extraChargeField: 'shipping',
  },

  LabtestOrder: {
    label:       'Lab Test Orders',
    icon:        'fa-flask',
    emptyIcon:   'fa-microscope',
    emptyTitle:  'No Lab Tests Booked',
    emptyText:   "You haven't booked any lab tests. Schedule a test today!",
    shopLink:    '/labtest',
    shopLabel:   'Book Lab Tests',
    shopIcon:    'fa-flask',
    detailRoute: '/order-detail/labtest',
    colors:      C.labtest,
    itemsKey:    'labtests',
    statusKey:   'orderStatus',
    isActive:    (item) => item?.orderStatus !== 'Cancelled',
    statusLabel: (item) => item?.orderStatus || 'Placed',
    canCancel:   canCancelOrder,
    cancelField: 'orderStatus',
    cancelValue: 'Cancelled',
    nameKey:     (t) => t?.labtest?.name || t?.name || '—',
    qtyKey:      (t) => t?.qty || 1,
    priceKey:    (t) => t?.labtest?.finalPrice || t?.price,
    totalKey:    (t) => t?.total,
    totalField:  'total',
    subtotalField: 'subtotal',
    extraChargeLabel: 'Delivery Charge',
    extraChargeField: 'deliveryCharge',
  },

  DoctorAppointment: {
    label:       'Doctor Appointments',
    icon:        'fa-user-md',
    emptyIcon:   'fa-stethoscope',
    emptyTitle:  'No Doctor Appointments',
    emptyText:   "You haven't booked any doctor appointments. Consult a doctor today!",
    shopLink:    '/doctor',
    shopLabel:   'Find Doctors',
    shopIcon:    'fa-user-md',
    detailRoute: '/order-detail/doctor',
    colors:      C.doctor,
    itemsKey:    null,                   // single-item appointment (not an array)
    statusKey:   'status',
    isActive:    (item) => item?.appointmentStatus !== false && item?.status !== 'Cancelled',
    statusLabel: (item) => item?.status || 'Pending',
    canCancel:   canCancelAppointment,
    cancelField: 'status',
    cancelValue: 'Cancelled',
    nameKey:     null,
    totalField:  'fees',
    subtotalField: 'fees',
    extraChargeLabel: null,
    extraChargeField: null,
  },

  NurseAppointment: {
    label:       'Nurse Appointments',
    icon:        'fa-user-nurse',
    emptyIcon:   'fa-hand-holding-medical',
    emptyTitle:  'No Nurse Appointments',
    emptyText:   "You haven't booked any nurse appointments. Book home care today!",
    shopLink:    '/nurse',
    shopLabel:   'Find Nurses',
    shopIcon:    'fa-user-nurse',
    detailRoute: '/order-detail/nurse',
    colors:      C.nurse,
    itemsKey:    null,
    statusKey:   'status',
    isActive:    (item) => item?.appointmentStatus !== false && item?.status !== 'Cancelled',
    statusLabel: (item) => item?.status || 'Pending',
    canCancel:   canCancelAppointment,
    cancelField: 'status',
    cancelValue: 'Cancelled',
    nameKey:     null,
    totalField:  'fees',
    subtotalField: 'fees',
    extraChargeLabel: null,
    extraChargeField: null,
  },
};

// ─── Cancellation helpers ──────────────────────────────────────────────────

/** Medicine & Labtest orders — mirrors the food Order logic */
function canCancelOrder(item) {
  if (!item) return false;
  const terminal = ['Cancelled', 'Delivered', 'Completed'];
  if (terminal.includes(item.orderStatus)) return false;

  const mode    = (item.paymentMode   || '').trim().toUpperCase();
  const status  = (item.paymentStatus || '').trim().toLowerCase();
  const isPaid    = status === 'done';
  const isPending = status === 'pending';

  if (mode === 'COD') return isPending;
  return isPaid; // Net Banking — refund path
}

/**
 * Doctor & Nurse appointments — same payment logic + 5-hour window.
 * Returns { eligible, windowOpen }
 */
function canCancelAppointment(item, cancelStatus = {}) {
  if (!item) return { eligible: false, windowOpen: false };
  const terminal = ['Cancelled', 'Completed'];
  if (terminal.includes(item.status)) return { eligible: false, windowOpen: false };
  if (item.appointmentStatus === false) return { eligible: false, windowOpen: false };

  const mode    = (item.paymentMode   || '').trim();
  const status  = (item.paymentStatus || '').trim().toLowerCase();
  const isPaid    = status === 'done';
  const isPending = status === 'pending';

  // "Cash" behaves like COD; "Net Banking" is online
  const paymentAllows = mode === 'Cash' ? isPending : isPaid;
  if (!paymentAllows) return { eligible: false, windowOpen: false };

  const windowOpen = !!cancelStatus[item._id];
  return { eligible: true, windowOpen };
}

// ─── Chip helper for appointment detail rows ───────────────────────────────
function InfoChip({ icon, label, value, colors }) {
  return (
    <div style={S.infoChip(colors)}>
      <i className={`fa ${icon}`} style={S.chipIcon(colors)} />
      <div>
        <div style={S.chipLabel}>{label}</div>
        <div style={S.chipVal}>{value || '—'}</div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

/**
 * HealthOrder
 *
 * Props:
 *   title      — one of 'MedicineOrder' | 'LabtestOrder' | 'DoctorAppointment' | 'NurseAppointment'
 *   data       — array of records from Redux store
 *   onCancel   — (item, updatedFields) => void  — dispatch your update action here
 */
export default function HealthOrder({ title, data = [], onCancel }) {
  const navigate = useNavigate();
  const cfg = CONFIG[title];
  const isAppointment = title === 'DoctorAppointment' || title === 'NurseAppointment';

  // ── Hooks must always be called before any early return ──
  // 5-hour cancellation window (appointments only)
  const [cancelStatus, setCancelStatus] = useState({});
  useEffect(() => {
    if (!isAppointment) return;
    const map = {};
    data.forEach(item => {
      const diffHrs = (Date.now() - new Date(item.createdAt).getTime()) / 3_600_000;
      map[item._id] = diffHrs <= 5;
    });
    setCancelStatus(map);
  }, [data, isAppointment]);

  if (!cfg) {
    console.error(`HealthOrder: unknown title "${title}". Use one of: ${Object.keys(CONFIG).join(', ')}`);
    return null;
  }

  const colors = cfg.colors;

  // ── Cancel handlers ──

  function handleCancelOrder(item) {
    if (!canCancelOrder(item)) return;
    if (!window.confirm(`Cancel this ${cfg.label.slice(0, -1)}?`)) return;
    onCancel?.(item, { [cfg.cancelField]: cfg.cancelValue });
  }

  function handleCancelAppointment(item) {
    const { eligible, windowOpen } = canCancelAppointment(item, cancelStatus);
    if (!eligible || !windowOpen) {
      alert('Cancellation is only allowed within 5 hours of booking.');
      return;
    }
    if (!window.confirm(`Cancel this appointment?`)) return;
    onCancel?.(item, { [cfg.cancelField]: cfg.cancelValue, appointmentStatus: false });
    setCancelStatus(p => ({ ...p, [item._id]: false }));
    navigate(0);
  }

  // ── Status pill helpers ──
  function isActive(item) { return cfg.isActive(item); }
  function statusLabel(item) { return cfg.statusLabel(item); }

  // ── Render ──
  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.35)} }
        .hord-card:hover   { box-shadow: var(--shadow-md) !important; transform: translateY(-2px); }
        .hord-cancel:hover { background: rgba(239,68,68,0.12) !important; border-color: #ef4444 !important; }
        .hord-view:hover   { opacity: 0.82; }
        .hord-shop:hover   { background: var(--accent) !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(28,16,9,0.2) !important; }
      `}</style>

      <div style={S.page}>
        <div className="container-xxl">

          {/* ── Page heading ── */}
          <div className="mb-4">
            <h1 style={S.pageTitle}>
              <i className={`fa ${cfg.icon} me-3`} style={{ color: colors.text, fontSize: '1.6rem' }} />
              {cfg.label}
            </h1>
            <p style={S.pageSub}>
              {data.length} {cfg.label.toLowerCase()} found
            </p>
          </div>

          {/* ── Cards ── */}
          {Array.isArray(data) && data.length ? data.map(item => (
            <div key={item?._id} style={S.card} className="hord-card">

              {/* Card Header */}
              <div style={S.cardHeader}>
                <div>
                  <div style={S.idLabel}>ID</div>
                  <div style={S.idValue}>{item?._id}</div>
                  <div style={S.createdAt}>
                    <i className="fa fa-clock" style={{ color: colors.text, fontSize: '0.75rem' }} />
                    {new Date(item?.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  {/* Type badge */}
                  <span style={S.typeBadge(colors)}>
                    <i className={`fa ${cfg.icon}`} style={{ fontSize: '0.7rem' }} />
                    {title.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {/* Status pill */}
                  <span style={S.statusPill(isActive(item))}>
                    <span style={S.statusDot(isActive(item))} />
                    {statusLabel(item)}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={S.cardBody}>

                {/* ── Medicine / Labtest: item rows ── */}
                {cfg.itemsKey && item?.[cfg.itemsKey]?.map((prod, idx) => (
                  <div key={prod._id || idx} style={S.itemRow}>
                    <div style={{ flex: '1 1 180px' }}>
                      <div style={S.itemName}>{cfg.nameKey(prod)}</div>
                      <div style={S.itemMeta}>
                        <span style={S.itemBadge(colors)}>
                          <i className="fa fa-times" style={{ fontSize: '0.65rem' }} />
                          {cfg.qtyKey(prod)} qty
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {cfg.priceKey(prod) && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginBottom: 3 }}>
                          ₹{cfg.priceKey(prod)} × {cfg.qtyKey(prod)}
                        </div>
                      )}
                      <div style={S.itemTotal}>₹{cfg.totalKey(prod)}</div>
                    </div>
                  </div>
                ))}

                {/* ── Doctor Appointment: info chips ── */}
                {title === 'DoctorAppointment' && (
                  <div style={S.infoGrid}>
                    <InfoChip icon="fa-user-md"   label="Doctor"   value={item?.doctor?.name}          colors={colors} />
                    <InfoChip icon="fa-hospital"  label="Hospital" value={item?.hospital?.name}         colors={colors} />
                    <InfoChip icon="fa-calendar"  label="Date"     value={item?.date ? new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'} colors={colors} />
                    <InfoChip icon="fa-clock"     label="Time"     value={item?.appointmentTime}        colors={colors} />
                    <InfoChip icon="fa-video"     label="Mode"     value={item?.appointmentMode}        colors={colors} />
                    <InfoChip icon="fa-stethoscope" label="Service" value={item?.serviceType}           colors={colors} />
                  </div>
                )}

                {/* ── Nurse Appointment: info chips ── */}
                {title === 'NurseAppointment' && (
                  <div style={S.infoGrid}>
                    <InfoChip icon="fa-user-nurse"         label="Nurse"    value={item?.nurse?.name}   colors={colors} />
                    <InfoChip icon="fa-hospital"           label="Hospital" value={item?.hospital?.name} colors={colors} />
                    <InfoChip icon="fa-calendar"           label="Date"     value={item?.date ? new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'} colors={colors} />
                    <InfoChip icon="fa-clock"              label="Time"     value={item?.appointmentTime} colors={colors} />
                    <InfoChip icon="fa-hand-holding-medical" label="Service" value={item?.serviceType}  colors={colors} />
                    <InfoChip icon="fa-hourglass-half"    label="Duration" value={item?.duration ? `${item.duration} hr` : '—'} colors={colors} />
                  </div>
                )}

              </div>

              {/* Card Footer */}
              <div style={S.cardFooter}>
                {/* Payment info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={S.payLabel}>Payment Mode</div>
                    <div style={S.payValue}>
                      <i className={`fa ${['COD','Cash'].includes(item?.paymentMode) ? 'fa-money-bill-wave' : 'fa-university'} me-1`}
                         style={{ color: colors.text, fontSize: '0.8rem' }} />
                      {item?.paymentMode || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={S.payLabel}>Payment Status</div>
                    <div style={S.payStatus(item?.paymentStatus === 'Pending')}>
                      <i className={`fa ${item?.paymentStatus === 'Pending' ? 'fa-hourglass-half' : 'fa-check-circle'}`}
                         style={{ fontSize: '0.8rem' }} />
                      {item?.paymentStatus || 'N/A'}
                    </div>
                  </div>
                  {/* Extra charge (shipping / delivery) */}
                  {cfg.extraChargeField && item?.[cfg.extraChargeField] !== undefined && (
                    <div>
                      <div style={S.payLabel}>{cfg.extraChargeLabel}</div>
                      <div style={S.payValue}>₹{item[cfg.extraChargeField]}</div>
                    </div>
                  )}
                  {/* Reservation date for lab tests */}
                  {title === 'LabtestOrder' && item?.reservationDate && (
                    <div>
                      <div style={S.payLabel}>Test Date</div>
                      <div style={S.payValue}>
                        {new Date(item.reservationDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Total + Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={S.totalLabel}>Total Amount</div>
                    <div style={S.totalAmt}>₹{item?.[cfg.totalField]}</div>
                  </div>

                  <div style={S.btnRow}>

                    {/* ── Order-type cancel (Medicine / Labtest) ── */}
                    {!isAppointment && (
                      <>
                        {canCancelOrder(item) && (
                          <button onClick={() => handleCancelOrder(item)} style={S.cancelBtn} className="hord-cancel">
                            <i className="fa fa-times-circle" style={{ fontSize: '0.8rem' }} />
                            Cancel
                          </button>
                        )}
                        <Link to={`${cfg.detailRoute}/${item?._id}`} style={S.viewBtn(colors)} className="hord-view">
                          <i className="fa fa-eye" style={{ fontSize: '0.8rem' }} />
                          View Details
                        </Link>
                      </>
                    )}

                    {/* ── Appointment-type cancel (Doctor / Nurse) ── */}
                    {isAppointment && (() => {
                      const { eligible, windowOpen } = canCancelAppointment(item, cancelStatus);
                      return (
                        <>
                          {item.status === 'Cancelled' || item.appointmentStatus === false ? (
                            <span style={S.disabledBtn}>
                              <i className="fa fa-ban" style={{ fontSize: '0.8rem' }} />
                              Cancelled
                            </span>
                          ) : eligible && windowOpen ? (
                            <button onClick={() => handleCancelAppointment(item)} style={S.cancelBtn} className="hord-cancel">
                              <i className="fa fa-times-circle" style={{ fontSize: '0.8rem' }} />
                              Cancel
                            </button>
                          ) : eligible && !windowOpen ? (
                            <span style={{ ...S.disabledBtn, border: `1.5px solid ${colors.border}`, background: colors.bg, color: C.gray }}>
                              <i className="fa fa-clock" style={{ fontSize: '0.78rem', color: colors.text, opacity: 0.6 }} />
                              Window Expired
                            </span>
                          ) : null}

                          <Link to={`${cfg.detailRoute}/${item?._id}`} style={S.viewBtn(colors)} className="hord-view">
                            <i className="fa fa-eye" style={{ fontSize: '0.8rem' }} />
                            View Details
                          </Link>
                        </>
                      );
                    })()}

                  </div>
                </div>
              </div>

            </div>
          )) : (
            /* ── Empty state ── */
            <div style={S.empty}>
              <i className={`fa ${cfg.emptyIcon}`} style={{ ...S.emptyIcon, color: colors.border }} />
              <div style={S.emptyTitle}>{cfg.emptyTitle}</div>
              <p style={S.emptyText}>{cfg.emptyText}</p>
              <Link to={cfg.shopLink} style={S.shopBtn} className="hord-shop">
                <i className={`fa ${cfg.shopIcon}`} />
                {cfg.shopLabel}
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}