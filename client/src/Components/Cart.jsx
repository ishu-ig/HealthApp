import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { getLabtest }          from '../Redux/ActionCreators/LabtestActionCreators';
import { getMedicine }         from '../Redux/ActionCreators/MedicineActionCreators';
import { createMedicineCheckout }
  from '../Redux/ActionCreators/MedicineCheckoutActionCreators';
import { deleteMedicineCart, getMedicineCart, updateMedicineCart }
  from '../Redux/ActionCreators/MedicineCartActionCreators';
import { createLabtestCheckout }
  from '../Redux/ActionCreators/LabtestCheckoutActionCreators';
import { deleteLabtestCart, getLabtestCart, updateLabtestCart }
  from '../Redux/ActionCreators/LabtestCartActionCreators';

export default function Cart({ title, data, category }) {

  const [cart,            setCart]            = useState([]);
  const [subtotal,        setSubtotal]        = useState(0);
  const [deliveryCharge,  setDeliveryCharge]  = useState(0);
  const [total,           setTotal]           = useState(0);
  const [mode,            setMode]            = useState('COD');
  const [reservationDate, setReservationDate] = useState('');
  const [dateError,       setDateError]       = useState('');
  const [removing,        setRemoving]        = useState(null);
  const [mounted,         setMounted]         = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MedicineCartStateData = useSelector(s => s.MedicineCartStateData) || [];
  const LabtestCartStateData  = useSelector(s => s.LabtestCartStateData)  || [];

  const isMedicine = title === 'medicine' || category === 'medicine';
  const isLabtest  = title === 'labtest'  || category === 'labtest';
  const isCheckout = title === 'Checkout';

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const calculate = (items) => {
    const sub = items.reduce((acc, x) => acc + (x.total || 0), 0);
    const del = isMedicine
      ? (sub > 0 && sub < 200 ? 50 : 0)
      : (sub > 0 && sub < 500 ? 100 : 0);
    setSubtotal(sub);
    setDeliveryCharge(del);
    setTotal(sub + del);
  };

  const updateRecord = (id, option) => {
    const updated = cart.map(item => {
      if (item._id !== id) return item;
      const clone = { ...item };
      if (isMedicine) {
        if (option === 'DEC' && clone.qty > 1) clone.qty -= 1;
        if (option === 'INC') clone.qty += 1;
        clone.total = clone.price * clone.qty;
        dispatch(updateMedicineCart(clone));
      } else {
        clone.total = clone.price ?? clone.total;
        dispatch(updateLabtestCart(clone));
      }
      return clone;
    });
    setCart(updated);
    calculate(updated);
  };

  const deleteRecord = (id) => {
    if (!window.confirm('Remove this item from cart?')) return;
    setRemoving(id);
    setTimeout(() => {
      isMedicine
        ? dispatch(deleteMedicineCart({ _id: id }))
        : dispatch(deleteLabtestCart({ _id: id }));
      setRemoving(null);
    }, 400);
  };

  const placeOrder = () => {
  if (isCheckout && isLabtest && !reservationDate) {
    setDateError('Please select a test date.');
    return;
  }

  const order = {
    user:          localStorage.getItem('userid'),
    orderStatus:   'Order is Placed',
    paymentMode:   mode,
    paymentStatus: 'Pending',
    subtotal,
    ...(isMedicine ? { shipping: deliveryCharge } : { deliveryStatus: deliveryCharge }),
    total,
    ...(isLabtest && reservationDate ? { reservationDate } : {}),
    ...(isMedicine ? { medicines: [...cart] } : { labtests: [...cart] }),
  };

  if (isMedicine) {
    dispatch(createMedicineCheckout(order));
    cart.forEach(item => dispatch(deleteMedicineCart({ _id: item._id })));
  } else {
    dispatch(createLabtestCheckout(order));
    cart.forEach(item => dispatch(deleteLabtestCart({ _id: item._id })));
  }

  const paymentType = isMedicine ? 'medicine' : 'labtest'; // 👈 derive type

  mode === 'COD'
    ? navigate('/confirmation')
    : navigate(`/payment/${paymentType}/-1`); // 👈 use correct type
};

  useEffect(() => {
    dispatch(getMedicine());
    dispatch(getLabtest());
    isMedicine ? dispatch(getMedicineCart()) : dispatch(getLabtestCart());
  }, [dispatch, title, category]);

  useEffect(() => {
    if (data?.length) {
      setCart(data);
      calculate(data);
      return;
    }

    const source = (isMedicine ? MedicineCartStateData : LabtestCartStateData) || [];
    const userId = localStorage.getItem('userid');

    const mapped = source
      .filter(x => (x.user?._id || x.user) === userId)
      .map(x => isMedicine ? ({
        _id:              x._id,
        name:             x.medicine?.name,
        pic:              Array.isArray(x.medicine?.pic) ? x.medicine.pic[0] : x.medicine?.pic,
        price:            x.medicine?.finalPrice,
        medicineCategory: x.medicine?.medicineCategory?.name || x.medicine?.medicineCategory,
        qty:              x.qty ?? 1,
        total:            x.total ?? ((x.medicine?.finalPrice ?? 0) * (x.qty ?? 1)),
      }) : ({
        _id:             x._id,
        name:            x.labtest?.name,
        pic:             Array.isArray(x.labtest?.pic) ? x.labtest.pic[0] : x.labtest?.pic,
        price:           x.labtest?.finalPrice,
        labtestCategory: x.labtest?.labtestCategory?.name || x.labtest?.labtestCategory,
        lab:             x.labtest?.lab?.name || x.labtest?.lab,
        sampleType:      x.labtest?.sampleType,
        total:           x.total ?? x.labtest?.finalPrice ?? 0,
      }));

    setCart(mapped);
    calculate(mapped);
  }, [MedicineCartStateData, LabtestCartStateData, data, title, category]);

  const freeThreshold = isMedicine ? 200 : 500;
  const progress = Math.min((subtotal / freeThreshold) * 100, 100);

  /* ── Empty State ── */
  if (!cart.length) {
    return (
      <>
        <style>{STYLES}</style>
        <div className={`hc-root ${mounted ? 'hc-mounted' : ''}`}>
          <div className="hc-empty-wrap">
            <div className="hc-empty-blob" />
            <div className="hc-empty-icon float-anim">
              {isMedicine ? '💊' : '🧪'}
            </div>
            <div className="hc-empty-eyebrow">
              {isCheckout ? 'Nothing to check out' : 'Empty Basket'}
            </div>
            <h3 className="hc-empty-title">
              {isCheckout
                ? 'Nothing here yet'
                : `Your ${isMedicine ? 'medicine' : 'lab test'} cart awaits`}
            </h3>
            <p className="hc-empty-sub">
              {isCheckout
                ? 'Head back and add items before checking out.'
                : `Explore our ${isMedicine ? 'medicines' : 'lab tests'} and add items to get started.`}
            </p>
            <Link
              to={isMedicine ? '/medicine' : '/labtest'}
              className="hc-cta"
              style={{ maxWidth: 260, margin: '0 auto', textDecoration: 'none' }}
            >
              {isMedicine ? '💊' : '🧪'} {isMedicine ? 'Browse Medicines' : 'Browse Lab Tests'}
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ── Main Render ── */
  return (
    <>
      <style>{STYLES}</style>

      <div className={`hc-root ${mounted ? 'hc-mounted' : ''}`}>
        <div className="hc-container">

          {/* ── Page Header ── */}
          {!isCheckout && (
            <div className="hc-page-header">
              <div className="hc-header-eyebrow">
                <span className="hc-eyebrow-line" />
                {isMedicine ? 'Medicine Cart' : 'Lab Test Cart'}
                <span className="hc-eyebrow-line hc-eyebrow-line--flex" />
              </div>
              <div className="hc-header-row">
                <h1 className="hc-page-title">Your Cart</h1>
                <span className="hc-badge-teal">
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* ── Step Indicator ── */}
          {isCheckout && (
            <div className="hc-steps">
              <div className="hc-step hc-step--done">
                <div className="hc-step-dot">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Cart</span>
              </div>
              <div className="hc-step-line hc-step-line--done" />
              <div className="hc-step hc-step--active">
                <div className="hc-step-dot"><span>2</span></div>
                <span>Checkout</span>
              </div>
              <div className="hc-step-line" />
              <div className="hc-step">
                <div className="hc-step-dot"><span>3</span></div>
                <span>Confirmation</span>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════
              hc-grid  — IMPROVED TWO-COLUMN LAYOUT
              Left  : items column  (minmax(0,1fr) — never overflows)
              Right : summary panel (320px sticky)
          ════════════════════════════════════════════════════ */}
          <div className="hc-grid">

            {/* ── LEFT: Items column ── */}
            <div className={isCheckout ? 'hc-col-full' : 'hc-col-items'}>

              {/* Delivery nudge bar */}
              {!isCheckout && deliveryCharge > 0 && (
                <div className="hc-nudge-strip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  Add <strong>₹{freeThreshold - subtotal}</strong> more for free {isMedicine ? 'delivery' : 'service'}
                  <div className="hc-nudge-track">
                    <div className="hc-nudge-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              {!isCheckout && deliveryCharge === 0 && subtotal > 0 && (
                <div className="hc-free-banner">
                  🎉 You've unlocked <strong>free {isMedicine ? 'delivery' : 'service'}!</strong>
                </div>
              )}

              {/* ── Item Cards ──
                  Inner layout uses CSS grid with explicit columns:
                  [thumb 72px] [info flex] [qty auto] [price auto] [delete auto]
                  This is far more stable than flexbox for 5-column rows.
              ── */}
              {cart.map((item, i) => (
                <div
                  key={item._id}
                  className={`hc-card${removing === item._id ? ' hc-card--removing' : ''}`}
                  style={{ animationDelay: `${0.05 + i * 0.055}s` }}
                >
                  {/* Teal accent on left edge, visible on hover */}
                  <div className="hc-card-accent" />

                  <div className="hc-card-inner">

                    {/* Col 1 — Thumbnail */}
                    <div className="hc-thumb-wrap">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                        alt={item.name}
                        className="hc-thumb"
                        onError={e => { e.target.src = '/placeholder.png'; }}
                      />
                    </div>

                    {/* Col 2 — Info (fills remaining space, clipped on overflow) */}
                    <div className="hc-card-info">
                      <span className="hc-card-cat">
                        {isMedicine ? item.medicineCategory : item.labtestCategory}
                      </span>
                      <h3 className="hc-card-name">{item.name}</h3>
                      {isMedicine ? (
                        <p className="hc-card-meta">
                          <span className="hc-meta-label">Unit price</span>
                          <span className="hc-meta-sep">·</span>
                          <span className="hc-meta-value">₹{item.price}</span>
                        </p>
                      ) : (
                        <div className="hc-card-meta-group">
                          <p className="hc-card-meta">
                            <span className="hc-meta-label">Lab</span>
                            <span className="hc-meta-sep">·</span>
                            <span className="hc-meta-value">{item.lab}</span>
                          </p>
                          <p className="hc-card-meta">
                            <span className="hc-meta-label">Sample</span>
                            <span className="hc-meta-sep">·</span>
                            <span className="hc-meta-value">{item.sampleType}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Col 3 — Quantity stepper */}
                    <div className="hc-qty-wrap">
                      {isMedicine && !isCheckout ? (
                        <div className="hc-qty" role="group" aria-label="Quantity">
                          <button
                            className="hc-qty-btn"
                            onClick={() => updateRecord(item._id, 'DEC')}
                            disabled={item.qty <= 1}
                            aria-label="Decrease quantity"
                          >−</button>
                          <span className="hc-qty-val" aria-live="polite">{item.qty}</span>
                          <button
                            className="hc-qty-btn"
                            onClick={() => updateRecord(item._id, 'INC')}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                      ) : (
                        <span className="hc-qty-badge">×{item.qty ?? 1}</span>
                      )}
                    </div>

                    {/* Col 4 — Price (unit above, item total in teal below) */}
                    <div className="hc-price-wrap">
                      <div className="hc-price-unit">₹{item.price}{isMedicine ? ' / ea' : ''}</div>
                      <div className="hc-price-total">₹{item.total}</div>
                    </div>

                    {/* Col 5 — Delete (fades in on card hover) */}
                    {!isCheckout && (
                      <button
                        className="hc-del-btn"
                        onClick={() => deleteRecord(item._id)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove item"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── RIGHT: Summary panel (sticky, 320px fixed width) ── */}
            <div className={isCheckout ? 'hc-col-full' : 'hc-col-summary'}>
              <div className="hc-sum-card">
                {/* Teal top accent line */}
                <div className="hc-sum-topline" />

                <div className="hc-sum-header">
                  <div className="hc-sum-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2"/>
                      <line x1="8" y1="10" x2="16" y2="10"/>
                      <line x1="8" y1="14" x2="16" y2="14"/>
                    </svg>
                  </div>
                  <span className="hc-sum-title">Order Summary</span>
                </div>

                <div className="hc-divider" />

                <div className="hc-sum-row">
                  <span>
                    Subtotal
                    <span className="hc-sum-count"> ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                  </span>
                  <span className="hc-sum-val">₹{subtotal}</span>
                </div>
                <div className="hc-sum-row">
                  <span>{isMedicine ? 'Delivery' : 'Service Charge'}</span>
                  {deliveryCharge === 0 ? (
                    <span className="hc-free">
                      <s className="hc-strike">₹{isMedicine ? 50 : 100}</s> FREE
                    </span>
                  ) : (
                    <span className="hc-sum-val">₹{deliveryCharge}</span>
                  )}
                </div>

                <div className="hc-divider" />

                {/* Total */}
                <div className="hc-total-row">
                  <div>
                    <p className="hc-total-label">Total</p>
                    <p className="hc-total-sub">incl. all taxes</p>
                  </div>
                  <div className="hc-total-amount">₹{total}</div>
                </div>

                {/* Lab test date picker */}
                {isCheckout && isLabtest && (
                  <div className="hc-field-section">
                    <label className="hc-field-label" htmlFor="hc-date-input">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Preferred Test Date
                    </label>
                    <input
                      id="hc-date-input"
                      type="date"
                      className={`hc-date-input${dateError ? ' hc-date-input--err' : ''}`}
                      min={today}
                      value={reservationDate}
                      onChange={e => { setReservationDate(e.target.value); setDateError(''); }}
                    />
                    {dateError && (
                      <p className="hc-err-msg" role="alert">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {dateError}
                      </p>
                    )}
                    {reservationDate && (
                      <div className="hc-date-confirm">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {new Date(reservationDate).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Payment method */}
                {isCheckout && (
                  <div className="hc-field-section">
                    <label className="hc-field-label" htmlFor="hc-pay-select">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="1" y="4" width="22" height="16" rx="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Payment Method
                    </label>
                    <select
                      id="hc-pay-select"
                      className="hc-pay-select"
                      value={mode}
                      onChange={e => setMode(e.target.value)}
                    >
                      <option value="COD">Cash on Delivery</option>
                      <option value="Net Banking">Net Banking / UPI / Card</option>
                    </select>
                  </div>
                )}

                {/* CTA button */}
                <button
                  className="hc-cta"
                  onClick={
                    isCheckout
                      ? placeOrder
                      : () => navigate(`/checkout/${isMedicine ? 'medicine' : 'labtest'}`)
                  }
                >
                  {isCheckout ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Place Order · ₹{total}
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                {!isCheckout && (
                  <Link to={isMedicine ? '/medicine' : '/labtest'} className="hc-back-link">
                    ← Continue {isMedicine ? 'Shopping' : 'Browsing'}
                  </Link>
                )}

                {/* Trust badges */}
                {isCheckout && (
                  <div className="hc-trust-row">
                    {[
                      { icon: '🔒', label: 'Secure' },
                      { icon: '↩️', label: 'Easy Returns' },
                      { icon: '🏥', label: 'Verified' },
                    ].map(b => (
                      <div key={b.label} className="hc-trust-item">
                        <div className="hc-trust-icon" aria-hidden="true">{b.icon}</div>
                        <span className="hc-trust-label">{b.label}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>{/* /hc-grid */}
        </div>
      </div>
    </>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --c-ink:       #0d1b2a;
    --c-mid:       #3a5068;
    --c-muted:     #7a90a4;
    --c-border:    #e2eaf2;
    --c-bg:        #f5f8fb;
    --c-white:     #ffffff;
    --c-teal:      #0891b2;
    --c-teal-lt:   #e0f2fe;
    --c-teal-glow: rgba(8,145,178,0.18);
    --c-amber:     #f59e0b;
    --c-amber-lt:  #fef3c7;
    --c-red:       #ef4444;
    --c-red-lt:    #fee2e2;
    --c-green:     #10b981;
    --c-green-lt:  #d1fae5;
    --c-radius:    14px;
    --c-radius-sm: 8px;
    --c-shadow:    0 2px 12px rgba(13,27,42,0.07);
    --c-shadow-md: 0 8px 32px rgba(13,27,42,0.10);
    --c-font:      'Sora', sans-serif;
    --c-mono:      'JetBrains Mono', monospace;
    --c-ease:      all 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Root shell ── */
  .hc-root {
    background: var(--c-bg);
    min-height: 50vh;
    font-family: var(--c-font);
    -webkit-font-smoothing: antialiased;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .hc-root.hc-mounted { opacity: 1; }

  .hc-container {
    max-width: 1180px;
    margin: 0 auto;
    padding: 40px 16px 80px;
  }

  /* ── Page header ── */
  .hc-page-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--c-border);
  }
  .hc-header-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--c-teal);
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .hc-eyebrow-line {
    display: block;
    width: 20px;
    height: 1px;
    background: var(--c-teal);
    flex-shrink: 0;
  }
  .hc-eyebrow-line--flex {
    width: auto;
    flex: 1;
    background: linear-gradient(90deg, var(--c-border), transparent);
  }
  .hc-header-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;
  }
  .hc-page-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: var(--c-ink);
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }
  .hc-badge-teal {
    background: var(--c-teal-lt);
    border: 1px solid rgba(8,145,178,0.25);
    border-radius: 999px;
    padding: 3px 12px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--c-teal);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Step indicator ── */
  .hc-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 480px;
    margin: 0 auto 28px;
  }
  .hc-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--c-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .hc-step--active { color: var(--c-teal); }
  .hc-step--done   { color: var(--c-green); }
  .hc-step-dot {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--c-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--c-muted);
    border: 2px solid var(--c-border);
    transition: var(--c-ease);
  }
  .hc-step--active .hc-step-dot {
    background: var(--c-teal);
    border-color: var(--c-teal);
    color: #fff;
    box-shadow: 0 0 0 4px var(--c-teal-glow);
  }
  .hc-step--done .hc-step-dot {
    background: var(--c-green);
    border-color: var(--c-green);
    color: #fff;
  }
  .hc-step-line {
    flex: 1;
    height: 2px;
    background: var(--c-border);
    margin: 0 6px 18px;
    transition: background 0.3s;
  }
  .hc-step-line--done { background: var(--c-green); }

  /* ════════════════════════════════════════════════════════════════════
     hc-grid  —  CORE LAYOUT IMPROVEMENT
     ────────────────────────────────────────────────────────────────────
     Before: display:flex; gap:24px
       Problem: .hc-col-items used flex:1 1 0 which can allow children
       to push the column wider than available space.

     After: display:grid; grid-template-columns: minmax(0,1fr) 320px
       • minmax(0,1fr) on the left column explicitly sets its minimum
         width to 0, so no child (long product name, wide image, etc.)
         can ever make the column overflow its track.
       • 320px right column is a hard fixed width — the summary panel
         never shrinks or grows unexpectedly.
       • align-items:start ensures the sticky summary starts at the top
         of the grid row rather than stretching to match the items column.
  ════════════════════════════════════════════════════════════════════ */
  .hc-grid {
    display: grid;
    flexDirection:column;
    // grid-template-columns: minmax(0, 1fr) 320px;
    gap: 24px;
    align-items: start;
  }

  /* Left column — flex column of cards + nudge strips */
  .hc-col-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0; /* redundant safety — grid already enforces this */
  }

  /* Right column — sticky summary panel */
  .hc-col-summary {
    position: sticky;
    top: 24px;
    align-self: start;   /* don't stretch to items column height */
  }

  /* Full-width override used on checkout page */
  .hc-col-full { width: 100%; }

  /* ── Nudge strip ── */
  .hc-nudge-strip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--c-amber-lt);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: var(--c-radius-sm);
    padding: 9px 13px;
    font-size: 0.76rem;
    color: #92400e;
    flex-wrap: wrap;
  }
  .hc-nudge-strip strong { color: #b45309; }
  .hc-nudge-track {
    flex: 1;
    min-width: 60px;
    height: 4px;
    background: rgba(245,158,11,0.2);
    border-radius: 99px;
    overflow: hidden;
  }
  .hc-nudge-fill {
    height: 100%;
    background: var(--c-amber);
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hc-free-banner {
    background: var(--c-green-lt);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: var(--c-radius-sm);
    padding: 10px 14px;
    font-size: 0.83rem;
    color: #065f46;
    font-weight: 500;
  }

  /* ════════════════════════════════════════════════════════════════════
     hc-card  —  IMPROVED INNER GRID
     ────────────────────────────────────────────────────────────────────
     Before: .hc-card-inner used display:flex with flex-wrap:wrap.
       Problem: flexbox wraps unpredictably on narrow viewports, and
       the price/delete columns had no guaranteed alignment.

     After: display:grid with explicit column template:
       [thumb 72px] [info 1fr] [qty auto] [price auto] [delete auto]
       • Each column has a clear role and never bleeds into the next.
       • The info column uses minmax(0,1fr) so long names truncate
         correctly with text-overflow:ellipsis instead of pushing layout.
       • align-items:center keeps all 5 columns vertically centered.
       • On mobile the template collapses to [thumb][info][delete] with
         qty and price wrapping below info via grid-column span.
  ════════════════════════════════════════════════════════════════════ */
  .hc-card {
    position: relative;
    background: var(--c-white);
    border: 1px solid var(--c-border);
    border-radius: var(--c-radius);
    overflow: hidden;
    transition: var(--c-ease);
    animation: cardIn 0.4s ease both;
  }
  .hc-card:hover {
    background: #fafcfe;
    border-color: rgba(8,145,178,0.25);
    box-shadow: var(--c-shadow-md);
    transform: translateY(-1px);
  }
  .hc-card--removing {
    opacity: 0 !important;
    transform: translateX(50px) scale(0.97) !important;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Left accent bar on hover */
  .hc-card-accent {
    position: absolute;
    left: 0; top: 16px; bottom: 16px;
    width: 2px;
    border-radius: 0 2px 2px 0;
    background: var(--c-teal);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .hc-card:hover .hc-card-accent { opacity: 1; }

  /* ── Card inner grid ── */
  .hc-card-inner {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) auto auto auto;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
  }

  /* Col 1 — Thumbnail */
  .hc-thumb-wrap {
    width: 72px; height: 72px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--c-bg);
    border: 1px solid var(--c-border);
    transition: border-color 0.2s;
    flex-shrink: 0;
  }
  .hc-card:hover .hc-thumb-wrap { border-color: var(--c-teal); }
  .hc-thumb { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Col 2 — Info (overflow safe) */
  .hc-card-info { min-width: 0; }
  .hc-card-cat {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--c-teal);
    background: var(--c-teal-lt);
    padding: 2px 8px;
    border-radius: 999px;
    margin-bottom: 5px;
  }
  .hc-card-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--c-ink);
    margin: 0 0 4px;
    /* Truncate long names instead of stretching the column */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }
  .hc-card-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.76rem;
    margin: 2px 0;
  }
  .hc-card-meta-group { display: flex; flex-direction: column; gap: 1px; }
  .hc-meta-label { color: var(--c-muted); font-weight: 500; }
  .hc-meta-sep   { color: var(--c-border); }
  .hc-meta-value { color: var(--c-mid); font-weight: 600; }

  /* Col 3 — Quantity */
  .hc-qty-wrap { flex-shrink: 0; }
  .hc-qty {
    display: flex;
    align-items: center;
    border: 1px solid var(--c-border);
    border-radius: 999px;
    overflow: hidden;
    background: var(--c-white);
  }
  .hc-qty-btn {
    width: 32px; height: 32px;
    border: none;
    background: transparent;
    color: var(--c-muted);
    font-size: 1rem;
    cursor: pointer;
    transition: var(--c-ease);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--c-font);
  }
  .hc-qty-btn:hover:not(:disabled) {
    background: var(--c-teal-glow);
    color: var(--c-teal);
  }
  .hc-qty-btn:disabled { opacity: 0.3; cursor: default; }
  .hc-qty-val {
    min-width: 30px;
    text-align: center;
    font-family: var(--c-mono);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--c-ink);
    border-left: 1px solid var(--c-border);
    border-right: 1px solid var(--c-border);
    height: 32px;
    display: flex; align-items: center; justify-content: center;
  }
  .hc-qty-badge {
    background: var(--c-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--c-radius-sm);
    padding: 4px 12px;
    font-family: var(--c-mono);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--c-ink);
  }

  /* Col 4 — Price */
  .hc-price-wrap {
    text-align: right;
    min-width: 72px;
    flex-shrink: 0;
  }
  .hc-price-unit {
    font-size: 0.68rem;
    color: var(--c-muted);
    margin-bottom: 4px;
    font-family: var(--c-mono);
    white-space: nowrap;
  }
  .hc-price-total {
    font-family: var(--c-mono);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--c-teal);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  /* Col 5 — Delete (hidden until hover) */
  .hc-del-btn {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(239,68,68,0.2);
    background: var(--c-red-lt);
    color: var(--c-red);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: var(--c-ease);
    flex-shrink: 0;
    opacity: 0;
  }
  .hc-card:hover .hc-del-btn { opacity: 1; }
  .hc-del-btn:hover {
    background: var(--c-red);
    color: #fff;
    border-color: var(--c-red);
    transform: scale(1.1);
  }

  /* ── Summary card ── */
  .hc-sum-card {
    position: relative;
    background: var(--c-white);
    border: 1px solid var(--c-border);
    border-radius: var(--c-radius);
    padding: 24px;
    box-shadow: var(--c-shadow-md);
    overflow: hidden;
  }
  .hc-sum-topline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--c-teal) 40%, #67e8f9 60%, transparent 100%);
  }
  .hc-sum-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .hc-sum-icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: var(--c-teal-lt);
    border: 1px solid rgba(8,145,178,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--c-teal);
  }
  .hc-sum-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--c-ink);
    letter-spacing: -0.01em;
  }
  .hc-divider {
    height: 1px;
    background: var(--c-border);
    margin: 14px 0;
  }
  .hc-sum-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.84rem;
    color: var(--c-muted);
    margin-bottom: 10px;
  }
  .hc-sum-count { color: var(--c-muted); font-size: 0.8rem; }
  .hc-sum-val { font-family: var(--c-mono); font-weight: 500; color: var(--c-mid); }
  .hc-free { display: flex; align-items: center; gap: 5px; color: var(--c-green); font-weight: 700; }
  .hc-strike { color: var(--c-muted); font-weight: 400; text-decoration: line-through; }

  .hc-total-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
  }
  .hc-total-label { font-size: 1rem; font-weight: 800; color: var(--c-ink); margin: 0 0 2px; letter-spacing: -0.01em; }
  .hc-total-sub { font-size: 0.68rem; color: var(--c-muted); margin: 0; }
  .hc-total-amount {
    font-family: var(--c-mono);
    font-size: 2rem;
    font-weight: 700;
    color: var(--c-teal);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* Fields */
  .hc-field-section {
    border-top: 1px solid var(--c-border);
    padding-top: 16px;
    margin-top: 4px;
  }
  .hc-field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--c-muted);
    margin-bottom: 10px;
  }
  .hc-pay-select {
    width: 100%;
    padding: 10px 38px 10px 14px;
    border: 1.5px solid var(--c-border);
    border-radius: var(--c-radius-sm);
    background: var(--c-bg);
    color: var(--c-ink);
    font-family: var(--c-font);
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237a90a4' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }
  .hc-pay-select:focus {
    border-color: var(--c-teal);
    box-shadow: 0 0 0 3px var(--c-teal-glow);
  }
  .hc-date-input {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid var(--c-border);
    border-radius: var(--c-radius-sm);
    font-family: var(--c-mono);
    font-size: 0.87rem;
    color: var(--c-ink);
    background: var(--c-bg);
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .hc-date-input:focus {
    border-color: var(--c-teal);
    box-shadow: 0 0 0 3px var(--c-teal-glow);
    background: var(--c-white);
  }
  .hc-date-input--err { border-color: var(--c-red); }
  .hc-err-msg {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.75rem; color: var(--c-red); margin: 6px 0 0; font-weight: 500;
  }
  .hc-date-confirm {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.79rem; color: var(--c-teal); font-weight: 600;
    margin-top: 8px; padding: 8px 11px;
    background: var(--c-teal-lt); border-radius: var(--c-radius-sm);
  }

  /* CTA */
  .hc-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 20px;
    padding: 13px 20px;
    background: linear-gradient(135deg, #0891b2, #0e7490);
    color: #fff;
    border: none;
    border-radius: 999px;
    font-family: var(--c-font);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: var(--c-ease);
    box-shadow: 0 4px 18px var(--c-teal-glow);
    text-decoration: none;
  }
  .hc-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(8,145,178,0.35);
    filter: brightness(1.05);
    color: #fff;
  }
  .hc-cta:active { transform: scale(0.98); }

  .hc-back-link {
    display: block;
    text-align: center;
    margin-top: 14px;
    font-size: 0.78rem;
    color: var(--c-muted);
    text-decoration: none;
    font-weight: 500;
    letter-spacing: 0.03em;
    transition: color 0.15s;
  }
  .hc-back-link:hover { color: var(--c-teal); }

  /* Trust badges */
  .hc-trust-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--c-border);
    margin-top: 18px;
  }
  .hc-trust-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: 72px;
  }
  .hc-trust-icon {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--c-teal-lt);
    border: 1px solid rgba(8,145,178,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem;
  }
  .hc-trust-label {
    font-size: 0.62rem;
    color: var(--c-muted);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-align: center;
  }

  /* ── Empty state ── */
  .hc-empty-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: auto;
    padding: 60px 24px;
    text-align: center;
    overflow: hidden;
  }
  .hc-empty-blob {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, var(--c-teal-lt) 0%, transparent 70%);
    opacity: 0.5;
    pointer-events: none;
  }
  .hc-empty-icon {
    width: 88px; height: 88px;
    border-radius: 50%;
    border: 1px solid rgba(8,145,178,0.25);
    background: var(--c-teal-lt);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 28px;
    font-size: 2.2rem;
    position: relative;
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .hc-empty-eyebrow {
    font-size: 0.6rem; font-weight: 700;
    letter-spacing: 0.2em; color: var(--c-teal);
    text-transform: uppercase; margin-bottom: 12px; position: relative;
  }
  .hc-empty-title {
    font-size: clamp(1.7rem, 5vw, 2.3rem);
    font-weight: 800; color: var(--c-ink);
    letter-spacing: -0.02em; line-height: 1.2;
    margin: 0 0 12px; position: relative;
  }
  .hc-empty-sub {
    font-size: 0.9rem; color: var(--c-muted);
    max-width: 340px; margin: 0 0 32px; line-height: 1.7; position: relative;
  }

  /* ════════════════════════════════════════════════════════════════════
     RESPONSIVE
     ────────────────────────────────────────────────────────────────────
     ≤ 960px  — summary drops below items (grid → single column)
     ≤ 640px  — card inner collapses: thumb + info on row 1,
                qty + price on row 2, delete always visible
  ════════════════════════════════════════════════════════════════════ */
  @media (max-width: 960px) {
    .hc-grid {
      grid-template-columns: 1fr;
    }
    .hc-col-summary {
      width: 100%;
      position: static;
    }
  }

  @media (max-width: 640px) {
    .hc-container { padding: 24px 14px 60px; }

    /* On mobile: [thumb] [info] [delete] on row 1,
                 [qty] spanning all / [price] on row 2 */
    .hc-card-inner {
      grid-template-columns: 56px minmax(0, 1fr) auto;
      grid-template-rows: auto auto;
      gap: 10px;
      padding: 14px 16px;
    }
    .hc-qty-wrap  { grid-column: 2; grid-row: 2; }
    .hc-price-wrap {
      grid-column: 3; grid-row: 2;
      text-align: right;
    }
    .hc-del-btn {
      grid-column: 3; grid-row: 1;
      opacity: 1 !important; /* always visible on touch */
    }
    .hc-thumb-wrap { width: 56px; height: 56px; }
  }
`;