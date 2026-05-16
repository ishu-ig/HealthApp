import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getDoctorAppointment }  from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import { getNurseAppointment }   from '../Redux/ActionCreators/NurseAppointmentActionCreators';
import { getMedicineCheckout }   from '../Redux/ActionCreators/MedicineCheckoutActionCreators';
import { getLabtestCheckout }    from '../Redux/ActionCreators/LabtestCheckoutActionCreators';

/* ─── Per-type config ────────────────────────────────────────────────────────
   Each entry maps a URL :type param to:
     • Redux state key + action
     • Brand colour tokens
     • Which fields to render in the info cards
     • Status tracker steps + icons
     • The "assignee" card label (delivery boy / tester / none)
─────────────────────────────────────────────────────────────────────────────*/
const TYPE_CONFIG = {
  doctor: {
    label:       'Doctor Appointment',
    backTo:      '/doctor-appointment',
    backLabel:   'All Appointments',
    itemsLabel:  null,                        // no items table
    stateKey:    'DoctorAppointmentStateData',
    getAction:   getDoctorAppointment,
    hue:         '199',                       // CSS hue for teal
    accent:      '#0891b2',
    accentLight: 'rgba(8,145,178,0.09)',
    accentBorder:'rgba(8,145,178,0.18)',
    icon:        '🩺',

    statusSteps: ['Pending','Accepted','In Progress','Completed'],
    stepIcons:   ['fa-clock','fa-check-circle','fa-heartbeat','fa-star'],
    cancelledStatus: 'Cancelled',
    doneStatus:      'Completed',

    /* schema-mapped info rows */
    infoRows: (d) => [
      { icon: 'fa-id-badge',     label: 'Appointment ID',   value: d._id },
      { icon: 'fa-user-md',      label: 'Doctor',           value: d.doctor?.name },
      { icon: 'fa-hospital',     label: 'Hospital',         value: d.hospital?.name },
      { icon: 'fa-concierge-bell',label:'Service',          value: d.serviceType || 'Consultation' },
      { icon: 'fa-laptop-medical',label:'Mode',             value: d.appointmentMode },
      { icon: 'fa-calendar-alt', label: 'Date',             value: d.date ? new Date(d.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null },
      { icon: 'fa-clock',        label: 'Appointment Time', value: d.appointmentTime || '—' },
      { icon: 'fa-clock',        label: 'Reporting Time',   value: d.reportingTime || '—' },
      { icon: 'fa-calendar',     label: 'Booked On',        value: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : null },
    ],

    /* payment summary rows */
    summaryRows: (d) => [
      { label: 'Payment Mode',   value: d.paymentMode || 'Cash' },
      { label: 'Payment Status', value: d.paymentStatus, badge: true },
      { label: 'Razorpay ID',    value: d.rppid || null },
    ],
    amountLabel: 'Fees',
    amountKey:   'fees',

    /* schema: no deliveryBoy/tester for doctor */
    assigneeLabel: null,
    assigneeKey:   null,
  },

  nurse: {
    label:       'Nurse Appointment',
    backTo:      '/nurse-appointment',
    backLabel:   'All Appointments',
    itemsLabel:  null,
    stateKey:    'NurseAppointmentStateData',
    getAction:   getNurseAppointment,
    hue:         '270',
    accent:      '#7c3aed',
    accentLight: 'rgba(124,58,237,0.09)',
    accentBorder:'rgba(124,58,237,0.18)',
    icon:        '🏥',

    statusSteps: ['Pending','Accepted','In Progress','Completed'],
    stepIcons:   ['fa-clock','fa-check-circle','fa-procedures','fa-star'],
    cancelledStatus: 'Cancelled',
    doneStatus:      'Completed',

    infoRows: (d) => [
      { icon: 'fa-id-badge',      label: 'Appointment ID',  value: d._id },
      { icon: 'fa-user-nurse',    label: 'Nurse',           value: d.nurse?.name },
      { icon: 'fa-hospital',      label: 'Hospital',        value: d.hospital?.name },
      { icon: 'fa-heartbeat',     label: 'Service',         value: d.serviceType || 'Other' },
      { icon: 'fa-calendar-alt',  label: 'Date',            value: d.date ? new Date(d.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null },
      { icon: 'fa-clock',         label: 'Appointment Time',value: d.appointmentTime || '—' },
      { icon: 'fa-clock',         label: 'Reporting Time',  value: d.reportingTime || '—' },
      /* NurseAppointment schema: duration */
      { icon: 'fa-hourglass-half',label: 'Duration',        value: d.duration ? `${d.duration} hr${d.duration > 1 ? 's' : ''}` : null },
      /* NurseAppointment schema: address */
      { icon: 'fa-map-marker-alt',label: 'Address',         value: d.address || null },
      { icon: 'fa-calendar',      label: 'Booked On',       value: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : null },
    ],

    summaryRows: (d) => [
      { label: 'Payment Mode',   value: d.paymentMode || 'Cash' },
      { label: 'Payment Status', value: d.paymentStatus, badge: true },
      { label: 'Razorpay ID',    value: d.rppid || null },
    ],
    amountLabel: 'Fees',
    amountKey:   'fees',
    assigneeLabel: null,
    assigneeKey:   null,
  },

  medicine: {
    label:       'Medicine Order',
    backTo:      '/medicine-checkout',
    backLabel:   'All Orders',
    itemsLabel:  'Medicines',
    stateKey:    'MedicineCheckoutStateData',
    getAction:   getMedicineCheckout,
    hue:         '158',
    accent:      '#059669',
    accentLight: 'rgba(5,150,105,0.09)',
    accentBorder:'rgba(5,150,105,0.18)',
    icon:        '💊',

    statusSteps: ['Order is Placed','Processing','Ready To Pick Up','Out for Delivery','Delivered'],
    stepIcons:   ['fa-clipboard-check','fa-cog','fa-box','fa-shipping-fast','fa-check-circle'],
    cancelledStatus: 'Cancelled',
    doneStatus:      'Delivered',

    infoRows: (d) => [
      { icon: 'fa-id-badge',   label: 'Order ID',      value: d._id },
      { icon: 'fa-calendar',   label: 'Ordered On',    value: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null },
    ],

    summaryRows: (d) => [
      { label: 'Subtotal',         value: `₹${d.subtotal ?? 0}` },
      /* MedicineCheckout schema: "shipping" field (not deliveryCharge) */
      { label: 'Shipping',         value: `₹${d.shipping ?? 0}` },
      { label: 'Total',            value: `₹${d.total ?? 0}`, bold: true },
      { label: 'Payment Mode',     value: d.paymentMode || 'COD' },
      { label: 'Payment Status',   value: d.paymentStatus, badge: true },
      { label: 'Razorpay ID',      value: d.rppid || null },
    ],
    amountLabel: 'Total',
    amountKey:   'total',

    /* MedicineCheckout schema: deliveryBoy (ObjectId, default null) */
    assigneeLabel: 'Delivery Partner',
    assigneeKey:   'deliveryBoy',
    assigneeIcon:  'fa-motorcycle',
  },

  labtest: {
    label:       'Lab Test Order',
    backTo:      '/labtest-checkout',
    backLabel:   'All Orders',
    itemsLabel:  'Lab Tests',
    stateKey:    'LabtestCheckoutStateData',
    getAction:   getLabtestCheckout,
    hue:         '0',
    accent:      '#dc2626',
    accentLight: 'rgba(220,38,38,0.09)',
    accentBorder:'rgba(220,38,38,0.18)',
    icon:        '🧪',

    statusSteps: ['Order is Placed','Processing','Sample Collected','Report Ready','Completed'],
    stepIcons:   ['fa-clipboard-check','fa-cog','fa-vial','fa-file-medical','fa-check-circle'],
    cancelledStatus: 'Cancelled',
    doneStatus:      'Completed',

    infoRows: (d) => [
      { icon: 'fa-id-badge',   label: 'Order ID',           value: d._id },
      /* LabtestCheckout schema: reservationDate (Date, default null) */
      { icon: 'fa-calendar-check', label: 'Reservation Date', value: d.reservationDate ? new Date(d.reservationDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—' },
      { icon: 'fa-calendar',   label: 'Ordered On',          value: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null },
    ],

    summaryRows: (d) => [
      { label: 'Subtotal',            value: `₹${d.subtotal ?? 0}` },
      /* LabtestCheckout schema: "deliveryCharge" (not "shipping") */
      { label: 'Delivery Charge',     value: `₹${d.deliveryCharge ?? 0}` },
      { label: 'Total',               value: `₹${d.total ?? 0}`, bold: true },
      { label: 'Payment Mode',        value: d.paymentMode || 'COD' },
      { label: 'Payment Status',      value: d.paymentStatus, badge: true },
      { label: 'Razorpay ID',         value: d.rppid || null },
    ],
    amountLabel: 'Total',
    amountKey:   'total',

    /* LabtestCheckout schema: tester (ObjectId, default null) */
    assigneeLabel: 'Assigned Tester',
    assigneeKey:   'tester',
    assigneeIcon:  'fa-microscope',
  },
};

/* ─── Sub-components ─────────────────────────────────────────────────────────*/

function InfoRow({ icon, label, value, accent, accentLight }) {
  if (!value) return null;
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
      <div style={{ width:32, height:32, flexShrink:0, background:accentLight, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <i className={`fa ${icon}`} style={{ color:accent, fontSize:13 }} aria-hidden="true" />
      </div>
      <div style={{ minWidth:0 }}>
        <p style={{ margin:'0 0 1px', fontSize:'0.72rem', color:'#888', fontWeight:500 }}>{label}</p>
        <p style={{ margin:0, fontSize:'0.88rem', color:'#1a1a1a', fontWeight:600, wordBreak:'break-all' }}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ value, accent, accentLight }) {
  const color = value === 'Done' || value === 'Completed' || value === 'Delivered'
    ? { bg:'rgba(5,150,105,0.1)', text:'#065f46' }
    : value === 'Failed' || value === 'Cancelled'
    ? { bg:'rgba(220,38,38,0.1)', text:'#991b1b' }
    : { bg:accentLight, text:accent };
  return (
    <span style={{ display:'inline-block', padding:'3px 11px', borderRadius:999, fontSize:'0.76rem', fontWeight:700, background:color.bg, color:color.text }}>
      {value || '—'}
    </span>
  );
}

function AssigneeCard({ data, cfg }) {
  if (!cfg.assigneeKey) return null;
  const person = data[cfg.assigneeKey];

  return (
    <div style={cardStyle}>
      <SectionHead icon={cfg.assigneeIcon} label={cfg.assigneeLabel} accent={cfg.accent} accentLight={cfg.accentLight} />
      {!person ? (
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:cfg.accentLight, borderRadius:10, margin:'0 20px 20px' }}>
          <div style={{ width:38, height:38, borderRadius:'50%', background:cfg.accentBorder, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <i className={`fa ${cfg.assigneeIcon}`} style={{ color:cfg.accent, fontSize:16 }} aria-hidden="true" />
          </div>
          <p style={{ margin:0, fontSize:'0.87rem', color:'#888' }}>Not assigned yet.</p>
        </div>
      ) : (
        <div style={{ padding:'0 20px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, padding:'12px 16px', background:cfg.accentLight, borderRadius:12 }}>
            <div style={{ width:46, height:46, borderRadius:'50%', background:cfg.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff', fontWeight:700, fontSize:'1.1rem' }}>
              {(person.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:'0.95rem', color:'#1a1a1a' }}>{person.name || '—'}</p>
              <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:999, fontSize:'0.7rem', fontWeight:700, background:'rgba(5,150,105,0.1)', color:'#065f46' }}>Active</span>
            </div>
          </div>
          <InfoRow icon="fa-phone"    label="Phone"   value={person.phone}  accent={cfg.accent} accentLight={cfg.accentLight} />
          <InfoRow icon="fa-envelope" label="Email"   value={person.email}  accent={cfg.accent} accentLight={cfg.accentLight} />
          <InfoRow icon="fa-id-badge" label="ID"      value={person.employeeId || person._id} accent={cfg.accent} accentLight={cfg.accentLight} />
        </div>
      )}
    </div>
  );
}

function SectionHead({ icon, label, accent, accentLight }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,0.06)', marginBottom:4 }}>
      <div style={{ width:30, height:30, borderRadius:8, background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <i className={`fa ${icon}`} style={{ color:accent, fontSize:13 }} aria-hidden="true" />
      </div>
      <span style={{ fontSize:'0.82rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555' }}>{label}</span>
    </div>
  );
}

/* ─── Item tables ─────────────────────────────────────────────────────────── */
function MedicineTable({ medicines, shipping, total, accent, accentLight }) {
  const subtotal = medicines?.reduce((s, m) => s + (m.total || 0), 0) ?? 0;
  return (
    <>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.87rem' }}>
          <thead>
            <tr style={{ background:accentLight }}>
              {['#','Medicine','Category','Qty','Unit Price','Total'].map(h => (
                <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:accent }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(medicines || []).map((m, i) => (
              <tr key={i} style={{ borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding:'11px 14px', color:'#aaa', fontWeight:600 }}>{i+1}</td>
                <td style={{ padding:'11px 14px', fontWeight:600, color:'#1a1a1a' }}>{m.name || '—'}</td>
                <td style={{ padding:'11px 14px', color:'#888' }}>{m.medicineCategory || '—'}</td>
                <td style={{ padding:'11px 14px' }}>
                  <span style={{ background:accentLight, color:accent, padding:'3px 10px', borderRadius:999, fontSize:'0.78rem', fontWeight:700 }}>×{m.qty ?? 1}</span>
                </td>
                <td style={{ padding:'11px 14px', color:'#555' }}>₹{m.price ?? 0}</td>
                <td style={{ padding:'11px 14px', fontWeight:700, color:accent }}>₹{m.total ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(0,0,0,0.07)', display:'flex', justifyContent:'flex-end' }}>
        <div style={{ minWidth:220 }}>
          <TotalRow label="Subtotal"  value={`₹${subtotal}`} />
          <TotalRow label="Shipping"  value={`₹${shipping ?? 0}`} />
          <TotalRow label="Total"     value={`₹${total ?? 0}`} bold accent={accent} />
        </div>
      </div>
    </>
  );
}

function LabtestTable({ labtests, deliveryCharge, total, accent, accentLight }) {
  const subtotal = labtests?.reduce((s, t) => s + (t.total || t.price || 0), 0) ?? 0;
  return (
    <>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.87rem' }}>
          <thead>
            <tr style={{ background:accentLight }}>
              {['#','Test Name','Category','Lab','Sample Type','Price'].map(h => (
                <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:accent }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(labtests || []).map((t, i) => (
              <tr key={i} style={{ borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding:'11px 14px', color:'#aaa', fontWeight:600 }}>{i+1}</td>
                <td style={{ padding:'11px 14px', fontWeight:600, color:'#1a1a1a' }}>{t.name || '—'}</td>
                <td style={{ padding:'11px 14px', color:'#888' }}>{t.labtestCategory || '—'}</td>
                <td style={{ padding:'11px 14px', color:'#888' }}>{t.lab || '—'}</td>
                <td style={{ padding:'11px 14px', color:'#888' }}>{t.sampleType || '—'}</td>
                <td style={{ padding:'11px 14px', fontWeight:700, color:accent }}>₹{t.total ?? t.price ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(0,0,0,0.07)', display:'flex', justifyContent:'flex-end' }}>
        <div style={{ minWidth:220 }}>
          <TotalRow label="Tests Subtotal"   value={`₹${subtotal}`} />
          {/* LabtestCheckout schema: deliveryCharge */}
          <TotalRow label="Delivery Charge"  value={`₹${deliveryCharge ?? 0}`} />
          <TotalRow label="Total"            value={`₹${total ?? 0}`} bold accent={accent} />
        </div>
      </div>
    </>
  );
}

function TotalRow({ label, value, bold, accent }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px dashed rgba(0,0,0,0.07)' }}>
      <span style={{ fontSize:'0.84rem', color:'#888' }}>{label}</span>
      <span style={{ fontSize: bold ? '1.05rem' : '0.84rem', fontWeight: bold ? 800 : 600, color: bold && accent ? accent : '#1a1a1a' }}>{value}</span>
    </div>
  );
}

/* ─── Shared card style ───────────────────────────────────────────────────── */
const cardStyle = {
  background:'#fff',
  borderRadius:16,
  border:'1px solid rgba(0,0,0,0.07)',
  boxShadow:'0 2px 14px rgba(0,0,0,0.05)',
  overflow:'hidden',
  marginBottom:20,
};

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function OrderDetailPage() {
  // URL: /order-detail/:type/:_id
  const { type, _id } = useParams();
  const dispatch = useDispatch();

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.medicine;

  const stateData = useSelector((s) => s[cfg.stateKey]) || [];
  const [order, setOrder] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => { dispatch(cfg.getAction()); }, [dispatch, type]);

  useEffect(() => {
    if (stateData.length) {
      setOrder(stateData.find(x => x._id === _id) || null);
    }
  }, [stateData, _id]);

  // Add near the top with other useState calls
const [invoiceError, setInvoiceError] = useState("")

// Then in generateInvoice, replace setPayError with setInvoiceError
const generateInvoice = async () => {
  if (invoiceLoading) return
  setInvoiceLoading(true)
  setInvoiceError("")   // 👈

  const invoiceConfig = {
    medicine: { endpoint: '/api/medicine-invoice/generate', bodyKey: 'orderId' },
    labtest:  { endpoint: '/api/labtest-invoice/generate',  bodyKey: 'orderId' },
    doctor:   { endpoint: '/api/doctor-invoice/generate',   bodyKey: 'appointmentId' },
    nurse:    { endpoint: '/api/nurse-invoice/generate',    bodyKey: 'appointmentId' },
  }

  const { endpoint, bodyKey } = invoiceConfig[type] || invoiceConfig.medicine

  try {
    const res  = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
      body: JSON.stringify({ [bodyKey]: _id }),
    })
    const data = await res.json()
    if (res.ok && data.result === 'Done' && data.invoice?.invoiceNumber) {
      window.open(`${process.env.REACT_APP_BACKEND_SERVER}/invoices/${data.invoice.invoiceNumber}.pdf`, '_blank')
    } else {
      setInvoiceError(data.reason || 'Invoice generation failed.')  // 👈
    }
  } catch (e) {
    console.error(e)
    setInvoiceError('Could not connect to server.')  // 👈
  } finally {
    setInvoiceLoading(false)
  }
}
  /* ── Loading ── */
  if (!order) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f9fb' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, border:`3px solid ${cfg.accent}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
        <p style={{ color:'#888', fontSize:'0.9rem' }}>Loading details…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Status tracker ── */
  const { statusSteps, stepIcons, cancelledStatus, doneStatus } = cfg;
  const currentStep = statusSteps.findIndex(s => s.toLowerCase() === (order.status || order.orderStatus || '').toLowerCase());
  const isCancelled = (order.status || order.orderStatus) === cancelledStatus;
  const isDone      = (order.status || order.orderStatus) === doneStatus;
  const isPaid      = order.paymentStatus === 'Done';
  const amountDue   = order[cfg.amountKey];

  return (
    <div style={{ background:'#f8f9fb', minHeight:'100vh', padding:'44px 16px 60px' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* ── Page header ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:30, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:cfg.accentLight, border:`1px solid ${cfg.accentBorder}`, borderRadius:999, padding:'5px 14px', marginBottom:10 }}>
              <span style={{ fontSize:'1.1rem' }}>{cfg.icon}</span>
              <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:cfg.accent }}>{cfg.label}</span>
            </div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'2rem', fontWeight:700, color:'#111', margin:0, letterSpacing:'-0.02em' }}>
              {type === 'doctor' || type === 'nurse' ? 'Appointment Details' : 'Track Your Order'}
            </h2>
          </div>
          <Link
            to={cfg.backTo}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', background:'#fff', color:'#555', border:'1px solid rgba(0,0,0,0.1)', borderRadius:999, textDecoration:'none', fontWeight:600, fontSize:'0.85rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.background = cfg.accentLight; e.currentTarget.style.color = cfg.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555'; }}
          >
            <i className="fa fa-arrow-left" style={{ fontSize:12 }} aria-hidden="true" /> {cfg.backLabel}
          </Link>
        </div>

        {/* ── Status tracker ── */}
        <div style={{ ...cardStyle }}>
          <SectionHead icon="fa-route" label="Progress" accent={cfg.accent} accentLight={cfg.accentLight} />
          {isCancelled ? (
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 20px', background:'rgba(220,38,38,0.06)', margin:'0 20px 20px', borderRadius:12, border:'1px solid rgba(220,38,38,0.15)' }}>
              <i className="fa fa-times-circle" style={{ color:'#dc2626', fontSize:22 }} aria-hidden="true" />
              <div>
                <p style={{ margin:'0 0 2px', fontWeight:700, color:'#dc2626', fontSize:'0.95rem' }}>Cancelled</p>
                <p style={{ margin:0, fontSize:'0.8rem', color:'#a04040' }}>This {type === 'doctor' || type === 'nurse' ? 'appointment' : 'order'} has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div style={{ padding:'24px 20px 20px', overflowX:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', minWidth:360 }}>
                {/* Track line */}
                <div style={{ position:'absolute', top:19, left:'5%', right:'5%', height:3, background:'rgba(0,0,0,0.07)', borderRadius:4 }}>
                  <div style={{ height:'100%', width:`${Math.max(0,(currentStep/(statusSteps.length-1))*100)}%`, background:cfg.accent, borderRadius:4, transition:'width 0.6s ease' }} />
                </div>
                {statusSteps.map((step, i) => {
                  const done = i <= currentStep;
                  return (
                    <div key={step} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, position:'relative', zIndex:1 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background: done ? cfg.accent : '#fff', border:`2.5px solid ${done ? cfg.accent : 'rgba(0,0,0,0.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, boxShadow: done ? `0 0 0 4px ${cfg.accentLight}` : 'none', transition:'all 0.3s' }}>
                        <i className={`fa ${stepIcons[i]}`} style={{ fontSize:14, color: done ? '#fff' : '#ccc' }} aria-hidden="true" />
                      </div>
                      <span style={{ fontSize:'0.68rem', fontWeight: done ? 700 : 400, color: done ? cfg.accent : '#aaa', textAlign:'center', maxWidth:80, lineHeight:1.3 }}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Two-column grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }} className="odp-grid">

          {/* Info card */}
          <div style={{ ...cardStyle, marginBottom:0 }}>
            <SectionHead icon="fa-info-circle" label="Details" accent={cfg.accent} accentLight={cfg.accentLight} />
            <div style={{ padding:'4px 20px 16px' }}>
              {cfg.infoRows(order).map(r => (
                <InfoRow key={r.label} {...r} accent={cfg.accent} accentLight={cfg.accentLight} />
              ))}
            </div>
          </div>

          {/* Patient / customer info */}
          <div style={{ ...cardStyle, marginBottom:0 }}>
            <SectionHead icon="fa-user" label={type === 'doctor' || type === 'nurse' ? 'Patient' : 'Customer'} accent={cfg.accent} accentLight={cfg.accentLight} />
            <div style={{ padding:'4px 20px 16px' }}>
              {[
                { icon:'fa-user',          label:'Name',    value: order.user?.name || order.user?.username },
                { icon:'fa-envelope',      label:'Email',   value: order.user?.email },
                { icon:'fa-phone',         label:'Phone',   value: order.user?.phone },
                { icon:'fa-map-marker-alt',label:'City',    value: order.user?.city },
                { icon:'fa-flag',          label:'State',   value: order.user?.state },
                { icon:'fa-hashtag',       label:'Pincode', value: order.user?.pin },
              ].map(r => (
                <InfoRow key={r.label} {...r} accent={cfg.accent} accentLight={cfg.accentLight} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment summary ── */}
        <div style={{ ...cardStyle }}>
          <SectionHead icon="fa-credit-card" label="Payment Summary" accent={cfg.accent} accentLight={cfg.accentLight} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, padding:'0 20px 20px' }}>
            <div>
              {cfg.summaryRows(order).filter(r => r.value).map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize:'0.82rem', color:'#888', fontWeight:500 }}>{r.label}</span>
                  {r.badge
                    ? <StatusBadge value={r.value} accent={cfg.accent} accentLight={cfg.accentLight} />
                    : <span style={{ fontSize:'0.87rem', fontWeight: r.bold ? 800 : 600, color: r.bold ? cfg.accent : '#1a1a1a' }}>{r.value}</span>
                  }
                </div>
              ))}
            </div>
            {/* Amount bubble */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
              <div style={{ textAlign:'center', background:cfg.accentLight, borderRadius:16, padding:'24px 32px', border:`1.5px dashed ${cfg.accentBorder}` }}>
                <p style={{ margin:'0 0 4px', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#888' }}>{cfg.amountLabel}</p>
                <p style={{ margin:0, fontSize:'2.4rem', fontWeight:800, color:cfg.accent, lineHeight:1, letterSpacing:'-0.03em' }}>
                  ₹{amountDue ?? '—'}
                </p>
                <div style={{ marginTop:10 }}>
                  <StatusBadge value={order.paymentStatus} accent={cfg.accent} accentLight={cfg.accentLight} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Assignee (delivery boy / tester) ── */}
        <AssigneeCard data={order} cfg={cfg} />

        {/* ── Items table (medicine or labtest) ── */}
        {cfg.itemsLabel && (
          <div style={{ ...cardStyle }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:cfg.accentLight, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className={`fa ${type === 'medicine' ? 'fa-pills' : 'fa-flask'}`} style={{ color:cfg.accent, fontSize:13 }} aria-hidden="true" />
                </div>
                <span style={{ fontSize:'0.82rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#555' }}>{cfg.itemsLabel}</span>
              </div>
              {/* Invoice download */}
              <button
                onClick={generateInvoice}
                disabled={invoiceLoading}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 20px', background: invoiceLoading ? '#ccc' : cfg.accent, color:'#fff', border:'none', borderRadius:999, fontWeight:700, fontSize:'0.82rem', cursor: invoiceLoading ? 'not-allowed' : 'pointer', boxShadow:`0 4px 12px ${cfg.accentLight}`, transition:'all 0.2s' }}
                onMouseEnter={e => { if(!invoiceLoading) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >
                {invoiceLoading
                  ? <><div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> Generating…</>
                  : <><i className="fa fa-file-invoice" style={{ fontSize:13 }} aria-hidden="true" /> Download Invoice</>
                }
              </button>
            </div>

            {type === 'medicine'
              ? <MedicineTable medicines={order.medicines} shipping={order.shipping} total={order.total} accent={cfg.accent} accentLight={cfg.accentLight} />
              : <LabtestTable  labtests={order.labtests} deliveryCharge={order.deliveryCharge} total={order.total} accent={cfg.accent} accentLight={cfg.accentLight} />
            }
          </div>
        )}

        {/* ── Completed banner ── */}
        {isDone && isPaid && (
          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 22px', background:'rgba(5,150,105,0.07)', borderRadius:14, border:'1px solid rgba(5,150,105,0.18)' }}>
            <i className="fa fa-check-circle" style={{ color:'#059669', fontSize:24 }} aria-hidden="true" />
            <div>
              <p style={{ margin:'0 0 2px', fontWeight:700, color:'#059669', fontSize:'0.95rem' }}>All done!</p>
              <p style={{ margin:0, fontSize:'0.8rem', color:'#065f46' }}>
                {type === 'doctor' || type === 'nurse' ? 'Appointment completed and payment received.' : 'Order delivered and payment confirmed.'}
              </p>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media(max-width:640px) {
          .odp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}