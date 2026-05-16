import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getLabtestCheckout,
  updateLabtestCheckout,
} from '../../Redux/ActionCreators/LabtestCheckoutActionCreators';

export default function AdminLabtestCheckoutShow() {
  const { _id } = useParams();
  const LabtestCheckoutStateData = useSelector(s => s.LabtestCheckoutStateData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data,          setData]          = useState(null);
  const [orderStatus,   setOrderStatus]   = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [saved,         setSaved]         = useState(false);

  /* LabtestCheckout schema: tester (ObjectId, default null) */
  const [testers,        setTesters]        = useState([]);
  const [selectedTester, setSelectedTester] = useState('');

  useEffect(() => { dispatch(getLabtestCheckout()); }, [dispatch]);

  /* Fetch testers from user list (role: "Tester" or "Lab Technician") */
  useEffect(() => {
    async function fetchTesters() {
      try {
        let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
          headers: { authorization: localStorage.getItem('token') },
        });
        res = await res.json();
        const list = Array.isArray(res) ? res : res.data || [];
        setTesters(list.filter(u => (u.role === 'Tester' || u.role === 'Lab Technician') && u.active));
      } catch (e) {
        console.error('Failed to fetch testers', e);
      }
    }
    fetchTesters();
  }, []);

  useEffect(() => {
    const list = Array.isArray(LabtestCheckoutStateData)
      ? LabtestCheckoutStateData
      : LabtestCheckoutStateData?.data || [];
    if (list.length) {
      const item = list.find(x => x._id === _id);
      if (item) {
        setData({ ...item });
        setOrderStatus(item.orderStatus || 'Order is Placed');
        setPaymentStatus(item.paymentStatus || 'Pending');
        /* LabtestCheckout schema: tester (ObjectId, default null) */
        setSelectedTester(item.tester?._id || item.tester || '');
      } else {
        alert('Invalid Checkout ID');
      }
    }
  }, [_id, LabtestCheckoutStateData]);

  function updateRecord() {
    if (window.confirm('Are you sure you want to update the status?')) {
      const updated = {
        ...data,
        orderStatus,
        paymentStatus,
        tester: selectedTester || undefined,
      };
      dispatch(updateLabtestCheckout(updated));
      setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      navigate('/admin/labtest-checkout');
    }
  }

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border text-primary mb-3"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading order…</p>
      </div>
    </div>
  );

  /* Status steps — matches LabtestCheckout lifecycle */
  const STATUS_STEPS = [
    { key: 'Order is Placed',  label: 'Placed',           icon: 'fa-clipboard-check' },
    { key: 'Processing',       label: 'Processing',       icon: 'fa-cog'             },
    { key: 'Sample Collected', label: 'Sample Collected', icon: 'fa-vial'            },
    { key: 'Report Ready',     label: 'Report Ready',     icon: 'fa-file-medical'    },
    { key: 'Completed',        label: 'Completed',        icon: 'fa-check-circle'    },
  ];

  const currentStep      = STATUS_STEPS.findIndex(s => s.key.toLowerCase() === data.orderStatus?.toLowerCase());
  const isCancelled      = data.orderStatus === 'Cancelled';
  const isCompleted      = data.orderStatus === 'Completed' && data.paymentStatus === 'Done';
  const canUpdateOrder   = data.orderStatus !== 'Completed' && !isCancelled;
  const canUpdatePayment = data.paymentStatus !== 'Done';
  const showUpdatePanel  = canUpdateOrder || canUpdatePayment;

  const safeStep = currentStep === -1 ? 0 : currentStep;
  const nextStatusOptions = STATUS_STEPS.map((s, i) => ({
    ...s,
    disabled: i > safeStep + 1 || i < safeStep,
  }));

  return (
    <div className="acs-root fade-in-up">

      {/* ── Page Header ── */}
      <div className="acs-page-header">
        <div className="acs-page-header-left">
          <Link to="/admin/labtest-checkout" className="acs-back-btn">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h5 className="acs-page-title">
              <i className="fas fa-flask me-2" style={{ color: 'var(--accent)' }}></i>Lab Test Order Details
            </h5>
            <p className="acs-page-id">ID: {data._id}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`acs-badge ${isCancelled ? 'danger' : data.orderStatus === 'Completed' ? 'success' : data.orderStatus === 'Report Ready' ? 'teal' : 'info'}`}>
            <i className="fas fa-circle me-1" style={{ fontSize: 6 }}></i>
            {data.orderStatus}
          </span>
          <span className={`acs-badge ${data.paymentStatus === 'Done' ? 'success' : data.paymentStatus === 'Failed' ? 'danger' : 'warn'}`}>
            <i className={`fas ${data.paymentStatus === 'Done' ? 'fa-check' : 'fa-clock'} me-1`}></i>
            {data.paymentStatus}
          </span>
        </div>
      </div>

      {saved && (
        <div className="acs-toast">
          <i className="fas fa-check-circle me-2"></i>Order updated successfully
        </div>
      )}

      <div className="acs-grid">

        {/* ── Order Progress ── */}
        {!isCancelled && (
          <div className="acs-card acs-full">
            <div className="acs-card-head">
              <span><i className="fas fa-route me-2" style={{ color: 'var(--accent)' }}></i>Order Progress</span>
            </div>
            <div className="acs-progress-row">
              {STATUS_STEPS.map((step, i) => {
                const isDone    = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <React.Fragment key={step.key}>
                    <div className="acs-progress-step">
                      <div className={`acs-progress-circle ${isDone ? 'done' : isCurrent ? 'active' : ''}`}>
                        {isDone ? <i className="fas fa-check"></i> : <i className={`fas ${step.icon}`}></i>}
                      </div>
                      <span className={`acs-progress-label ${isDone || isCurrent ? 'visible' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`acs-progress-line ${isDone ? 'done' : ''}`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cancelled Banner ── */}
        {isCancelled && (
          <div className="acs-card acs-full acs-cancelled-banner">
            <i className="fas fa-times-circle" style={{ fontSize: 22, color: 'var(--accent-danger)' }}></i>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-danger)', fontSize: 15 }}>Order Cancelled</div>
              <div style={{ fontSize: 12, color: '#a04040', marginTop: 2 }}>This order has been cancelled and cannot be updated.</div>
            </div>
          </div>
        )}

        {/* ── Customer Info ── */}
        <div className="acs-card">
          <div className="acs-card-head">
            <span><i className="fas fa-user me-2" style={{ color: 'var(--accent)' }}></i>Customer</span>
          </div>
          <div className="acs-detail-list">
            {[
              { icon: 'fa-user',           val: data.user?.name || data.user?.username },
              { icon: 'fa-envelope',       val: data.user?.email },
              { icon: 'fa-phone',          val: data.user?.phone },
              { icon: 'fa-map-marker-alt', val: [data.user?.address, data.user?.city, data.user?.state, data.user?.pin].filter(Boolean).join(', ') },
            ].filter(r => r.val).map(({ icon, val }) => (
              <div key={icon} className="acs-detail-row">
                <i className={`fas ${icon}`} style={{ color: 'var(--accent)', width: 16, flexShrink: 0 }}></i>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Summary — uses LabtestCheckout schema fields ── */}
        <div className="acs-card">
          <div className="acs-card-head">
            <span><i className="fas fa-file-invoice me-2" style={{ color: 'var(--accent)' }}></i>Order Summary</span>
          </div>
          <div className="acs-summary-grid">
            <div className="acs-summary-row">
              <span>Subtotal</span>
              <span>₹{data.subtotal ?? 0}</span>
            </div>
            {/* LabtestCheckout schema: deliveryCharge (not "shipping") */}
            <div className="acs-summary-row">
              <span>Delivery Charge</span>
              <span>₹{data.deliveryCharge ?? 0}</span>
            </div>
            <div className="acs-summary-divider"></div>
            <div className="acs-summary-row total">
              <span>Total</span>
              <span>₹{data.total ?? 0}</span>
            </div>
            <div className="acs-summary-row">
              <span>Payment Mode</span>
              <span>{data.paymentMode || 'COD'}</span>
            </div>
            <div className="acs-summary-row">
              <span>Payment Status</span>
              <span className={`acs-badge ${data.paymentStatus === 'Done' ? 'success' : data.paymentStatus === 'Failed' ? 'danger' : 'warn'}`}>
                {data.paymentStatus}
              </span>
            </div>
            {/* LabtestCheckout schema: reservationDate (Date, default null) */}
            <div className="acs-summary-row">
              <span>Reservation Date</span>
              <span>
                {data.reservationDate
                  ? new Date(data.reservationDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div className="acs-summary-row">
              <span>Order Date</span>
              <span>
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            {/* LabtestCheckout schema: rppid */}
            {data.rppid && (
              <div className="acs-summary-row">
                <span>Razorpay ID</span>
                <span style={{ fontSize: 12, wordBreak: 'break-all' }}>{data.rppid}</span>
              </div>
            )}
            {/* LabtestCheckout schema: tester (ObjectId ref) */}
            {data.tester && (
              <div className="acs-summary-row">
                <span>Assigned Tester</span>
                <span>{data.tester?.name || data.tester}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Lab Tests — LabtestCheckout schema: labtests[] ── */}
        {data.labtests?.length > 0 && (
          <div className="acs-card acs-full">
            <div className="acs-card-head">
              <span><i className="fas fa-flask me-2" style={{ color: 'var(--accent)' }}></i>Ordered Lab Tests</span>
              <span className="acs-count-pill">{data.labtests.length} item{data.labtests.length > 1 ? 's' : ''}</span>
            </div>
            <div className="acs-table-wrap">
              <table className="acs-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test Name</th>
                    <th>Category</th>
                    <th>Lab</th>
                    <th>Sample Type</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.labtests.map((t, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.name || t.labtest?.name || '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {t.labtestCategory || '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {t.lab || '—'}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {t.sampleType || '—'}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{t.total ?? t.price ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Update Status ── */}
        {showUpdatePanel && !isCancelled && (
          <div className="acs-card acs-full">
            <div className="acs-card-head">
              <span><i className="fas fa-edit me-2" style={{ color: 'var(--accent)' }}></i>Update Status</span>
            </div>
            <div className="acs-update-grid">
              {canUpdateOrder && (
                <div>
                  <label className="form-label">Order Status</label>
                  <select className="form-select" value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                    {nextStatusOptions.map(s => (
                      <option key={s.key} value={s.key} disabled={s.disabled}>{s.label}</option>
                    ))}
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}
              {/* LabtestCheckout has tester instead of deliveryBoy */}
              {canUpdateOrder && (
                <div>
                  <label className="form-label">Assign Tester</label>
                  <select
                    className="form-select"
                    value={selectedTester}
                    onChange={e => setSelectedTester(e.target.value)}
                  >
                    <option value="">-- Select Tester --</option>
                    {testers.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.phone})</option>
                    ))}
                  </select>
                </div>
              )}
              {canUpdatePayment && (
                <div>
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              )}
            </div>
            <button className="acs-update-btn" onClick={updateRecord}>
              <i className="fas fa-save me-2"></i>Save Changes
            </button>
          </div>
        )}

        {/* ── Completed Banner ── */}
        {isCompleted && (
          <div className="acs-card acs-full acs-completed-banner">
            <i className="fas fa-check-circle" style={{ fontSize: 22, color: 'var(--accent-success)' }}></i>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: 15 }}>Order Completed</div>
              <div style={{ fontSize: 12, color: '#2d7a50', marginTop: 2 }}>Lab tests completed and payment received.</div>
            </div>
          </div>
        )}

      </div>

      <style>{STYLES}</style>
    </div>
  );
}

const STYLES = `
  .acs-root { padding-bottom: 40px; }
  .acs-page-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:24px; }
  .acs-page-header-left { display:flex;align-items:center;gap:14px; }
  .acs-back-btn { width:36px;height:36px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);text-decoration:none;transition:var(--transition);flex-shrink:0; }
  .acs-back-btn:hover { background:var(--bg-hover);color:var(--text-primary);border-color:var(--border-accent); }
  .acs-page-title { font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--text-primary);margin:0; }
  .acs-page-id { font-size:11px;color:var(--text-muted);margin:2px 0 0;word-break:break-all; }
  .acs-toast { display:flex;align-items:center;background:rgba(56,239,145,0.1);border:1px solid rgba(56,239,145,0.3);border-radius:var(--radius-sm);padding:10px 16px;color:var(--accent-success);font-size:13px;font-weight:600;margin-bottom:18px;animation:acsSlide 0.3s ease; }
  @keyframes acsSlide { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none} }
  .acs-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
  .acs-full { grid-column:1/-1; }
  .acs-card { background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden; }
  .acs-card-head { display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--text-primary); }
  .acs-progress-row { display:flex;align-items:center;padding:24px 20px;gap:0;flex-wrap:nowrap;overflow-x:auto; }
  .acs-progress-step { display:flex;flex-direction:column;align-items:center;gap:8px;min-width:72px; }
  .acs-progress-circle { width:40px;height:40px;border-radius:50%;background:var(--bg-surface);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-muted);transition:all 0.35s; }
  .acs-progress-circle.done { background:rgba(56,239,145,0.12);border-color:var(--accent-success);color:var(--accent-success); }
  .acs-progress-circle.active { background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 0 5px rgba(79,142,247,0.15),0 4px 14px rgba(79,142,247,0.35);animation:acsPulse 2s ease-in-out infinite; }
  @keyframes acsPulse { 0%,100%{box-shadow:0 0 0 5px rgba(79,142,247,0.15),0 4px 14px rgba(79,142,247,0.35)}50%{box-shadow:0 0 0 8px rgba(79,142,247,0.08),0 4px 14px rgba(79,142,247,0.35)} }
  .acs-progress-label { font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);text-align:center;transition:color 0.3s; }
  .acs-progress-label.visible { color:var(--text-secondary); }
  .acs-progress-line { flex:1;height:2px;background:var(--border);border-radius:2px;margin-bottom:26px;transition:background 0.4s;min-width:20px; }
  .acs-progress-line.done { background:var(--accent-success); }
  .acs-cancelled-banner,.acs-completed-banner { display:flex;align-items:center;gap:14px;padding:18px 20px; }
  .acs-cancelled-banner { background:rgba(247,95,95,0.07);border-color:rgba(247,95,95,0.2)!important; }
  .acs-completed-banner { background:rgba(56,239,145,0.07);border-color:rgba(56,239,145,0.2)!important; }
  .acs-detail-list { display:flex;flex-direction:column;gap:12px;padding:18px 20px; }
  .acs-detail-row { display:flex;align-items:flex-start;gap:12px;font-size:13.5px;color:var(--text-secondary);line-height:1.5; }
  .acs-summary-grid { display:flex;flex-direction:column;gap:0;padding:4px 0 8px; }
  .acs-summary-row { display:flex;justify-content:space-between;align-items:center;padding:10px 20px;font-size:13.5px;color:var(--text-secondary); }
  .acs-summary-row.total { font-size:16px;font-weight:700;color:var(--text-primary); }
  .acs-summary-row.total span:last-child { color:var(--accent); }
  .acs-summary-divider { border-top:1px solid var(--border);margin:4px 20px; }
  .acs-table-wrap { overflow-x:auto; }
  .acs-table { width:100%;border-collapse:collapse;font-size:13px;color:var(--text-secondary); }
  .acs-table thead th { background:var(--bg-surface);color:var(--text-muted);font-size:10.5px;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;padding:10px 20px;border-bottom:1px solid var(--border);white-space:nowrap; }
  .acs-table tbody tr { border-bottom:1px solid var(--border); }
  .acs-table tbody tr:last-child { border-bottom:none; }
  .acs-table tbody tr:hover { background:var(--bg-hover); }
  .acs-table tbody td { padding:12px 20px;vertical-align:middle;color:var(--text-secondary); }
  .acs-count-pill { font-size:11px;font-weight:700;background:var(--accent-glow);color:var(--accent);border:1px solid var(--border-accent);border-radius:20px;padding:2px 10px; }
  .acs-update-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:20px 20px 0; }
  .acs-update-btn { width:calc(100% - 40px);margin:16px 20px 20px;padding:11px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);font-size:13.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.25s;box-shadow:0 4px 14px rgba(79,142,247,0.3); }
  .acs-update-btn:hover { background:#3a7de0;transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,142,247,0.45); }
  .acs-badge { display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:700;border:1px solid var(--border);background:var(--bg-surface);color:var(--text-muted); }
  .acs-badge.success { background:rgba(56,239,145,.12);color:#38EF91;border-color:rgba(56,239,145,.25); }
  .acs-badge.warn    { background:rgba(247,195,95,.12);color:#F7C35F;border-color:rgba(247,195,95,.25); }
  .acs-badge.info    { background:rgba(79,142,247,.12);color:#4F8EF7;border-color:rgba(79,142,247,.25); }
  .acs-badge.teal    { background:rgba(56,239,195,.12);color:#38EFC3;border-color:rgba(56,239,195,.25); }
  .acs-badge.danger  { background:rgba(247,95,95,.12); color:#F75F5F;border-color:rgba(247,95,95,.25); }
  @media(max-width:640px){
    .acs-grid{grid-template-columns:1fr}
    .acs-update-grid{grid-template-columns:1fr}
    .acs-progress-circle{width:32px;height:32px;font-size:12px}
    .acs-update-btn{width:calc(100% - 32px);margin:14px 16px 16px}
    .acs-update-grid{padding:16px 16px 0}
  }
`;