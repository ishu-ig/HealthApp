import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

// ── Brand palette ────────────────────────────────────────────────────────────
const P   = '#06A3DA';
const PD  = '#0484B8';
const SEC = '#F57E57';
const DRK = '#0B1F3F';

// ── Data ─────────────────────────────────────────────────────────────────────
const ORDER_CATEGORIES = [
  { key: 'all',               label: 'All Orders & Bookings', icon: 'fa-layer-group',   to: '/order?tab=all',                emoji: '🗂️',  dot: '#7c3aed', glow: 'rgba(124,58,237,.13)' },
//   { key: 'MedicineOrder',     label: 'Medicine Orders',       icon: 'fa-pills',          to: '/order?tab=MedicineOrder',      emoji: '💊',  dot: '#059669', glow: 'rgba(5,150,105,.12)'  },
//   { key: 'LabtestOrder',      label: 'Lab Test Bookings',     icon: 'fa-flask',          to: '/order?tab=LabtestOrder',       emoji: '🧪',  dot: '#2563eb', glow: 'rgba(37,99,235,.12)'  },
//   { key: 'DoctorAppointment', label: 'Doctor Appointments',   icon: 'fa-user-md',        to: '/order?tab=DoctorAppointment',  emoji: '🩺',  dot: '#7c3aed', glow: 'rgba(124,58,237,.12)' },
//   { key: 'NurseAppointment',  label: 'Nurse Appointments',    icon: 'fa-user-nurse',     to: '/order?tab=NurseAppointment',   emoji: '👩‍⚕️', dot: '#db2777', glow: 'rgba(219,39,119,.12)' },
];

const NAV_LINKS = [
  { to: '/',         label: 'Home',      icon: 'fa-home'          },
  { to: '/about',    label: 'About',     icon: 'fa-info-circle'   },
  { to: '/medicine', label: 'Medicines', icon: 'fa-pills'         },
  { to: '/labtest',  label: 'Lab Tests', icon: 'fa-flask'         },
  { to: '/doctors',  label: 'Doctors',   icon: 'fa-user-md'       },
  { to: '/nurse',    label: 'Nurses',    icon: 'fa-hospital-user' },
  { to: '/features', label: 'Features',  icon: 'fa-star'          },
];

const PAGES_LINKS = [
  { to: '/pricing',      label: 'Pricing Plan',  icon: 'fa-tags',           desc: 'View our plans'          },
  { to: '/team',         label: 'Our Doctors',   icon: 'fa-user-md',        desc: 'Meet the specialists'    },
  { to: '/testimonials', label: 'Testimonials',  icon: 'fa-comment-dots',   desc: 'What patients say'       },
  { to: '/appointment',  label: 'Appointment',   icon: 'fa-calendar-check', desc: 'Book a visit'            },
];

const PROFILE_LINKS = [
  { to: '/profile',  label: 'My Profile',  icon: 'fa-user-circle', color: '#06A3DA' },
  { to: '/cart',     label: 'My Cart',     icon: 'fa-shopping-cart', color: '#059669' },
  { to: '/settings', label: 'Settings',    icon: 'fa-cog', color: '#7c3aed' },
];

// ── Tiny hook: close on outside click ────────────────────────────────────────
function useOutsideClick(refs, onClose) {
  useEffect(() => {
    const h = e => {
      const isOutside = refs.every(r => r.current && !r.current.contains(e.target));
      if (isOutside) onClose();
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [refs, onClose]);
}

// ── Animated Dropdown component ───────────────────────────────────────────────
function Dropdown({ label, icon, isOpen, onToggle, onClose, children, align = 'left', minW = 220 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const closeTimer = useRef(null);

  useOutsideClick([ref], onClose);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimer.current);
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      closeTimer.current = setTimeout(() => setVisible(false), 260);
    }
    return () => clearTimeout(closeTimer.current);
  }, [isOpen]);

  return (
    <div className="nb-dropdown" ref={ref}>
      <button
        className={`nb-link nb-link--dd${isOpen ? ' nb-link--active' : ''}`}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && <i className={`fa ${icon} nb-link-icon`} />}
        {label}
        <i className={`fa fa-chevron-down nb-caret${isOpen ? ' nb-caret--up' : ''}`} />
      </button>
      {visible && (
        <div
          className={`nb-dd nb-dd--${align}${animating ? ' nb-dd--in' : ' nb-dd--out'}`}
          role="listbox"
          style={{ minWidth: minW }}
        >
          <div className="nb-dd-arrow" />
          {React.Children.map(children, (child, i) =>
            child ? React.cloneElement(child, {
              style: { ...child.props.style, '--i': i },
            }) : child
          )}
        </div>
      )}
    </div>
  );
}

// ── Animated Profile Dropdown ─────────────────────────────────────────────────
function ProfileDropdown({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimer.current);
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      closeTimer.current = setTimeout(() => setVisible(false), 260);
    }
    return () => clearTimeout(closeTimer.current);
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`nb-profile-dd${animating ? ' nb-profile-dd--in' : ' nb-profile-dd--out'}`} role="menu">
      <div className="nb-pd-arrow" />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [userData,    setUserData]    = useState({});
  const [scrolled,    setScrolled]    = useState(false);
  const [openMenu,    setOpenMenu]    = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [mOrdersOpen, setMOrdersOpen] = useState(false);
  const [mPagesOpen,  setMPagesOpen]  = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();

  const profileWrapRef = useRef(null);
  const toggle = key => setOpenMenu(prev => prev === key ? null : key);

  useOutsideClick([profileWrapRef], useCallback(() => {
    setOpenMenu(prev => prev === 'profile' ? null : prev);
  }, []));

  useEffect(() => {
    const uid = localStorage.getItem('userid');
    if (!uid) return;
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${uid}`, {
      headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
    }).then(r => r.json()).then(setUserData).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || sidebarOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, sidebarOpen]);

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const isLoggedIn = !!localStorage.getItem('login');
  const userName   = localStorage.getItem('name') || 'Guest';
  const avatarSrc  = userData?.pic && isLoggedIn
    ? `${process.env.REACT_APP_BACKEND_SERVER}/${userData.pic}`
    : null;

  return (
    <>
      <style>{CSS}</style>

      <div
        className={`nb-overlay${(sidebarOpen || mobileOpen) ? ' nb-overlay--visible' : ''}`}
        onClick={() => { setSidebarOpen(false); setMobileOpen(false); }}
        aria-hidden="true"
      />

      {/* ══ SIDEBAR ══ */}
      <aside className={`nb-sidebar${sidebarOpen ? ' nb-sidebar--open' : ''}`} aria-label="Orders sidebar">
        <div className="nb-sb-head">
          <div className="nb-sb-brand">
            <div className="nb-sb-brand-icon"><i className="fa fa-heartbeat" /></div>
            <div>
              <div className="nb-sb-brand-title">My Orders</div>
              <div className="nb-sb-brand-sub">Browse by category</div>
            </div>
          </div>
          <button className="nb-sb-close" onClick={() => setSidebarOpen(false)} aria-label="Close">
            <i className="fa fa-times" />
          </button>
        </div>

        <nav className="nb-sb-nav">
          {ORDER_CATEGORIES.map(cat => (
            <Link
              key={cat.key}
              to={cat.to}
              className={`nb-sb-item${cat.key === 'all' ? ' nb-sb-item--all' : ''}`}
              style={{ '--dot': cat.dot, '--glow': cat.glow }}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nb-sb-emoji">{cat.emoji}</span>
              <div className="nb-sb-icon"><i className={`fa ${cat.icon}`} /></div>
              <span className="nb-sb-label">{cat.label}</span>
              <i className="fa fa-chevron-right nb-sb-chevron" />
            </Link>
          ))}
        </nav>

        <div className="nb-sb-foot">
          <Link to="/appointment" className="nb-sb-cta" onClick={() => setSidebarOpen(false)}>
            <i className="fa fa-calendar-check" /> Book Appointment
          </Link>
        </div>
      </aside>

      {/* ══ TOPBAR ══ */}
      <div className="nb-topbar">
        <div className="nb-topbar-inner">
          <div className="nb-topbar-left">
            <a href="mailto:info@example.com"><i className="fa fa-envelope-open" /><span>info@example.com</span></a>
            <a href="tel:+919875643210"><i className="fa fa-phone" /><span>+91-987564321</span></a>
          </div>
          <div className="nb-topbar-right">
            <span className="nb-topbar-tag"><i className="fa fa-shield-alt" /> NABH Accredited</span>
            <div className="nb-topbar-social">
              {['facebook', 'twitter', 'instagram', 'whatsapp'].map(s => (
                <a key={s} href="#" aria-label={s}><i className={`bi bi-${s}`} /></a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN NAVBAR ══ */}
      <nav
        className={`nb-nav${scrolled ? ' nb-nav--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nb-nav-inner">

          <Link to="/" className="nb-brand" aria-label="HealthCare home">
            <div className="nb-brand-mark"><i className="fa fa-heartbeat" /></div>
            <span className="nb-brand-text">Health<em>Care</em></span>
          </Link>

          {/* Desktop links */}
          <div className="nb-links" role="menubar">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nb-link${isActive ? ' nb-link--active' : ''}`}
                role="menuitem"
              >
                {label}
              </NavLink>
            ))}

            {/* <Dropdown
              label="Orders"
              isOpen={openMenu === 'orders'}
              onToggle={() => toggle('orders')}
              onClose={() => setOpenMenu(null)}
              minW={290}
            >
              <div className="nb-dd-label-row">
                <span><i className="fa fa-box" /> My Orders &amp; Bookings</span>
              </div>
              {ORDER_CATEGORIES.map(cat => (
                <Link
                  key={cat.key}
                  to={cat.to}
                  className={`nb-dd-item${cat.key === 'all' ? ' nb-dd-item--all' : ''}`}
                  style={{ '--dot': cat.dot, '--glow': cat.glow }}
                  role="option"
                  onClick={() => setOpenMenu(null)}
                >
                  <span className="nb-dd-emoji">{cat.emoji}</span>
                  <span className="nb-dd-icon" style={{ background: cat.glow, color: cat.dot }}>
                    <i className={`fa ${cat.icon}`} />
                  </span>
                  <span className="nb-dd-text">{cat.label}</span>
                  {cat.key === 'all' && <span className="nb-dd-badge">ALL</span>}
                </Link>
              ))}
            </Dropdown> */}

            {/* <Dropdown
              label="Pages"
              isOpen={openMenu === 'pages'}
              onToggle={() => toggle('pages')}
              onClose={() => setOpenMenu(null)}
              minW={240}
            >
              <div className="nb-dd-label-row">
                <span><i className="fa fa-file-alt" /> Quick Links</span>
              </div>
              {PAGES_LINKS.map(({ to, label, icon, desc }) => (
                <Link key={to} to={to} className="nb-dd-item" role="option"
                  style={{ '--dot': P, '--glow': 'rgba(6,163,218,.09)' }}
                  onClick={() => setOpenMenu(null)}>
                  <span className="nb-dd-icon" style={{ background: 'rgba(6,163,218,.09)', color: P }}>
                    <i className={`fa ${icon}`} />
                  </span>
                  <span className="nb-dd-text">
                    <span className="nb-dd-text-main">{label}</span>
                    <span className="nb-dd-text-sub">{desc}</span>
                  </span>
                </Link>
              ))}
            </Dropdown> */}

            <NavLink
              to="/contactus"
              className={({ isActive }) => `nb-link${isActive ? ' nb-link--active' : ''}`}
            >
              Contact
            </NavLink>
          </div>

          {/* Right actions */}
          <div className="nb-actions">

            <button className="nb-orders-btn" onClick={() => setSidebarOpen(true)} title="My Orders">
              <i className="fa fa-th-list" />
              <span className="nb-orders-btn-lbl">Orders</span>
            </button>

            {/* Profile dropdown */}
            <div className="nb-profile-wrap" ref={profileWrapRef}>
              <button
                className={`nb-avatar-btn${openMenu === 'profile' ? ' nb-avatar-btn--open' : ''}`}
                onClick={() => toggle('profile')}
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={openMenu === 'profile'}
              >
                {avatarSrc
                  ? <img src={avatarSrc} alt={userName} className="nb-avatar-img" />
                  : <i className="fas fa-user-circle nb-avatar-icon" />
                }
                <span className="nb-avatar-dot" />
              </button>

              <ProfileDropdown isOpen={openMenu === 'profile'} onClose={() => setOpenMenu(null)}>
                <div className="nb-pd-head">
                  <img src={avatarSrc || '/img/noimage.jpg'} alt={userName} className="nb-pd-avatar" />
                  <div>
                    <div className="nb-pd-name">{userName}</div>
                    <div className="nb-pd-role">{isLoggedIn ? 'Member' : 'Guest'}</div>
                  </div>
                  <div className="nb-pd-status" />
                </div>

                <div className="nb-pd-section">Account</div>
                {PROFILE_LINKS.map(({ to, label, icon, color }, i) => (
                  <Link
                    key={to} to={to}
                    className="nb-pd-item"
                    style={{ '--pd-color': color, '--i': i }}
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span className="nb-pd-item-icon" style={{ background: `${color}18`, color }}>
                      <i className={`fa ${icon}`} />
                    </span>
                    {label}
                    <i className="fa fa-chevron-right nb-pd-item-arrow" />
                  </Link>
                ))}

                <div className="nb-pd-div" />
                <div className="nb-pd-section">My Activity</div>
                {ORDER_CATEGORIES.slice(0, 4).map((cat, i) => (
                  <Link
                    key={cat.key}
                    to={cat.to}
                    className="nb-pd-item"
                    style={{ '--pd-color': cat.dot, '--i': i + PROFILE_LINKS.length + 2 }}
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span className="nb-pd-item-emoji">{cat.emoji}</span>
                    {cat.label}
                  </Link>
                ))}

                <div className="nb-pd-div" />
                {isLoggedIn
                  ? <button
                      className="nb-pd-item nb-pd-item--danger"
                      style={{ '--i': PROFILE_LINKS.length + 6 }}
                      role="menuitem"
                      onClick={() => { setOpenMenu(null); logout(); }}
                    >
                      <span className="nb-pd-item-icon"><i className="fa fa-sign-out-alt" /></span>
                      Sign Out
                    </button>
                  : <Link
                      to="/login"
                      className="nb-pd-item nb-pd-item--primary"
                      style={{ '--i': PROFILE_LINKS.length + 6 }}
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                    >
                      <span className="nb-pd-item-icon"><i className="fa fa-sign-in-alt" /></span>
                      Sign In
                    </Link>
                }
              </ProfileDropdown>
            </div>

            <Link to="/appointment" className="nb-cta">
              <i className="fa fa-calendar-check" />
              <span>Appointment</span>
            </Link>

            <button
              className={`nb-hamburger${mobileOpen ? ' nb-hamburger--open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MOBILE DRAWER ══ */}
      <div
        className={`nb-mobile${mobileOpen ? ' nb-mobile--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="nb-mob-scroll">

          <div className="nb-mob-user">
            <img src={avatarSrc || '/img/noimage.jpg'} alt={userName} className="nb-mob-avatar" />
            <div>
              <div className="nb-mob-name">{userName}</div>
              <div className="nb-mob-sub">{isLoggedIn ? '● Online' : 'Guest'}</div>
            </div>
            {isLoggedIn && (
              <Link to="/profile" className="nb-mob-edit" onClick={() => setMobileOpen(false)}>
                <i className="fa fa-pen" />
              </Link>
            )}
          </div>

          <div className="nb-mob-section">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nb-mob-link${isActive ? ' nb-mob-link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nb-mob-link-icon"><i className={`fa ${icon}`} /></span>
                {label}
                <i className="fa fa-chevron-right nb-mob-link-arrow" />
              </NavLink>
            ))}
          </div>

          {/* <div className="nb-mob-accordion">
            <button
              className={`nb-mob-acc-trigger${mOrdersOpen ? ' nb-mob-acc-trigger--open' : ''}`}
              onClick={() => setMOrdersOpen(o => !o)}
            >
              <span><span className="nb-mob-link-icon"><i className="fa fa-box" /></span> Orders &amp; Bookings</span>
              <i className={`fa fa-chevron-down nb-mob-acc-chevron${mOrdersOpen ? ' nb-mob-acc-chevron--up' : ''}`} />
            </button>
            <div className={`nb-mob-acc-body${mOrdersOpen ? ' nb-mob-acc-body--open' : ''}`}>
              {ORDER_CATEGORIES.map(cat => (
                <Link
                  key={cat.key}
                  to={cat.to}
                  className={`nb-mob-sub-item${cat.key === 'all' ? ' nb-mob-sub-item--all' : ''}`}
                  style={{ '--dot': cat.dot, '--glow': cat.glow }}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nb-mob-sub-dot" />
                  <span className="nb-mob-sub-emoji">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div> */}

          <div className="nb-mob-accordion">
            <button
              className={`nb-mob-acc-trigger${mPagesOpen ? ' nb-mob-acc-trigger--open' : ''}`}
              onClick={() => setMPagesOpen(o => !o)}
            >
              <span><span className="nb-mob-link-icon"><i className="fa fa-file-alt" /></span> Pages</span>
              <i className={`fa fa-chevron-down nb-mob-acc-chevron${mPagesOpen ? ' nb-mob-acc-chevron--up' : ''}`} />
            </button>
            <div className={`nb-mob-acc-body${mPagesOpen ? ' nb-mob-acc-body--open' : ''}`}>
              {PAGES_LINKS.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="nb-mob-sub-item"
                  style={{ '--dot': P, '--glow': 'rgba(6,163,218,.1)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nb-mob-sub-dot" />
                  <i className={`fa ${icon}`} style={{ color: P, fontSize: '12px' }} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="nb-mob-section" style={{ marginTop: 0 }}>
            <NavLink
              to="/contactus"
              className={({ isActive }) => `nb-mob-link${isActive ? ' nb-mob-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nb-mob-link-icon"><i className="fa fa-envelope" /></span>
              Contact Us
              <i className="fa fa-chevron-right nb-mob-link-arrow" />
            </NavLink>
          </div>

          <div className="nb-mob-footer">
            <Link to="/appointment" className="nb-mob-cta" onClick={() => setMobileOpen(false)}>
              <i className="fa fa-calendar-check" /> Book Appointment
            </Link>
            {isLoggedIn
              ? <button className="nb-mob-logout" onClick={logout}>
                  <i className="fa fa-sign-out-alt" /> Sign Out
                </button>
              : <Link to="/login" className="nb-mob-login" onClick={() => setMobileOpen(false)}>
                  <i className="fa fa-sign-in-alt" /> Sign In
                </Link>
            }
          </div>
        </div>
      </div>

      {/* AI FAB */}
      <button className="nb-ai-fab" aria-label="AI Support">
        <i className="fas fa-robot" />
        <span className="nb-ai-pulse" />
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Reset ── */
  .nb-topbar *, .nb-nav *, .nb-sidebar *, .nb-ai-fab { box-sizing: border-box; }
  .nb-topbar, .nb-nav { width: 100%; max-width: 100vw; overflow-x: clip; }

  /* ════════════════════════════════════════════
     OVERLAY
  ════════════════════════════════════════════ */
  .nb-overlay {
    position: fixed; inset: 0;
    background: rgba(11,31,63,0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1040;
    opacity: 0; pointer-events: none;
    transition: opacity .28s ease;
  }
  .nb-overlay--visible { opacity: 1; pointer-events: auto; }

  /* ════════════════════════════════════════════
     SIDEBAR
  ════════════════════════════════════════════ */
  .nb-sidebar {
    position: fixed; top: 0; left: 0;
    width: min(340px, 90vw); height: 100dvh;
    background: #fff;
    z-index: 1200;
    display: flex; flex-direction: column;
    box-shadow: 20px 0 60px -10px rgba(11,31,63,0.2);
    transform: translateX(-100%);
    transition: transform .32s cubic-bezier(.4,0,.2,1);
    will-change: transform;
  }
  .nb-sidebar--open { transform: translateX(0); }

  .nb-sb-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #eef2f8;
    background: linear-gradient(135deg, rgba(6,163,218,.04), rgba(245,126,87,.03));
    flex-shrink: 0;
  }
  .nb-sb-brand { display: flex; align-items: center; gap: 12px; }
  .nb-sb-brand-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 4px 14px rgba(6,163,218,.32); flex-shrink: 0;
  }
  .nb-sb-brand-title {
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; color: #0B1F3F;
  }
  .nb-sb-brand-sub { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #94a3b8; }
  .nb-sb-close {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid #e2e8f0; background: #fff;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #64748b; font-size: 12px;
    transition: all .18s ease; flex-shrink: 0;
  }
  .nb-sb-close:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; transform: rotate(90deg); }

  .nb-sb-nav {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 12px 12px 10px;
    display: flex; flex-direction: column; gap: 3px;
    scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
  }
  .nb-sb-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 13px; border-radius: 12px;
    text-decoration: none; color: #374151;
    font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
    transition: background .15s, color .15s, transform .15s;
    min-width: 0;
  }
  .nb-sb-item:hover {
    background: var(--glow); color: var(--dot);
    transform: translateX(3px);
  }
  .nb-sb-item--all {
    background: rgba(6,163,218,.07); color: #06A3DA;
    border: 1.5px solid rgba(6,163,218,.16);
  }
  .nb-sb-item--all:hover { background: rgba(6,163,218,.13); }
  .nb-sb-emoji { font-size: 17px; width: 22px; text-align: center; flex-shrink: 0; }
  .nb-sb-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--glow, rgba(0,0,0,.04));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: var(--dot, #06A3DA); flex-shrink: 0;
  }
  .nb-sb-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nb-sb-chevron { color: #d1d5db; font-size: 9px; flex-shrink: 0; transition: color .15s; }
  .nb-sb-item:hover .nb-sb-chevron { color: var(--dot); }

  .nb-sb-foot {
    padding: 14px 16px 20px;
    border-top: 1px solid #eef2f8; flex-shrink: 0;
  }
  .nb-sb-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; border-radius: 12px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(6,163,218,.3);
    transition: all .2s; letter-spacing: .01em;
  }
  .nb-sb-cta:hover { opacity: .9; transform: translateY(-1px); color: #fff; box-shadow: 0 6px 20px rgba(6,163,218,.38); }

  /* ════════════════════════════════════════════
     TOPBAR
  ════════════════════════════════════════════ */
  .nb-topbar {
    background: #0B1F3F;
    padding: 8px 0;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
  }
  .nb-topbar-inner {
    max-width: 1340px; margin: 0 auto; padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .nb-topbar-left { display: flex; gap: 18px; overflow: hidden; }
  .nb-topbar-left a {
    color: rgba(255,255,255,.65); text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: color .2s; white-space: nowrap;
  }
  .nb-topbar-left a:hover { color: #06A3DA; }
  .nb-topbar-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
  .nb-topbar-tag {
    color: rgba(255,255,255,.5); font-size: 11px;
    display: flex; align-items: center; gap: 5px; white-space: nowrap;
  }
  .nb-topbar-tag i { color: #06A3DA; }
  .nb-topbar-social { display: flex; gap: 5px; }
  .nb-topbar-social a {
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(255,255,255,.08); color: rgba(255,255,255,.6);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; text-decoration: none;
    transition: background .2s, color .2s;
  }
  .nb-topbar-social a:hover { background: #06A3DA; color: #fff; }

  /* ════════════════════════════════════════════
     NAVBAR
  ════════════════════════════════════════════ */
  .nb-nav {
    position: sticky; top: 0; z-index: 800;
    background: rgba(255,255,255,.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(226,234,242,.8);
    box-shadow: 0 2px 20px rgba(11,31,63,.06);
    transition: box-shadow .3s, background .3s;
  }
  .nb-nav--scrolled {
    background: rgba(255,255,255,.98);
    box-shadow: 0 4px 30px rgba(11,31,63,.12);
  }

  .nb-nav-inner {
    max-width: 1340px; margin: 0 auto; padding: 0 20px;
    display: flex; align-items: center; gap: 6px;
    height: 64px;
    transition: height .3s;
  }
  .nb-nav--scrolled .nb-nav-inner { height: 54px; }

  .nb-brand {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none;
    font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -.03em;
    color: #0B1F3F; flex-shrink: 0; margin-right: 6px;
  }
  .nb-brand-mark {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 15px; box-shadow: 0 4px 14px rgba(6,163,218,.32); flex-shrink: 0;
    transition: transform .2s;
  }
  .nb-brand:hover .nb-brand-mark { transform: rotate(-8deg) scale(1.06); }
  .nb-brand-text em { color: #F57E57; font-style: normal; }

  .nb-links {
    display: flex; align-items: stretch;
    flex: 1 1 0%; min-width: 0;
    overflow: hidden; height: 100%;
  }
  .nb-link {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 0 10px;
    font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
    color: #4a5568; text-decoration: none; background: none; border: none; cursor: pointer;
    border-bottom: 2.5px solid transparent;
    white-space: nowrap; flex-shrink: 0; height: 100%;
    position: relative;
    transition: color .18s, border-color .18s;
  }
  .nb-link::after {
    content: '';
    position: absolute; bottom: -1px; left: 50%; right: 50%;
    height: 2.5px; background: #06A3DA; border-radius: 3px 3px 0 0;
    transition: left .22s ease, right .22s ease;
  }
  .nb-link:hover::after, .nb-link--active::after { left: 10px; right: 10px; }
  .nb-link:hover, .nb-link--active { color: #06A3DA; }
  .nb-link-icon { font-size: 11px; color: #06A3DA; }
  .nb-caret {
    font-size: 8px; color: #a0aec0; margin-left: 2px;
    transition: transform .28s cubic-bezier(.34,1.56,.64,1);
  }
  .nb-caret--up { transform: rotate(180deg); }

  /* Dropdown wrapper */
  .nb-dropdown { position: relative; display: flex; align-items: stretch; flex-shrink: 0; }

  /* ── Dropdown panel — open/close animation ── */
  .nb-dd {
    position: absolute; top: calc(100% + 10px);
    background: #fff;
    border: 1px solid rgba(226,234,242,.9);
    border-radius: 16px;
    padding: 8px;
    box-shadow: 0 20px 60px -8px rgba(11,31,63,.18), 0 4px 16px rgba(11,31,63,.06);
    z-index: 850;
    pointer-events: none;
    /* base state (closed) */
    opacity: 0;
    transform: translateY(12px) scale(.97);
    filter: blur(2px);
    transition:
      opacity 260ms cubic-bezier(.22,1,.36,1),
      transform 260ms cubic-bezier(.22,1,.36,1),
      filter 260ms cubic-bezier(.22,1,.36,1);
    transform-origin: top left;
    will-change: opacity, transform, filter;
  }
  .nb-dd--left  { left: 0; transform-origin: top left; }
  .nb-dd--right { right: 0; transform-origin: top right; }

  /* open state */
  .nb-dd--in {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
    pointer-events: auto;
  }
  /* close state */
  .nb-dd--out {
    opacity: 0;
    transform: translateY(8px) scale(.97);
    filter: blur(1px);
    pointer-events: none;
  }

  /* Pointer arrow on dropdown */
  .nb-dd-arrow, .nb-pd-arrow {
    position: absolute; top: -7px; left: 20px;
    width: 13px; height: 7px; overflow: hidden;
    pointer-events: none;
  }
  .nb-dd-arrow::before, .nb-pd-arrow::before {
    content: '';
    display: block;
    width: 13px; height: 13px;
    background: #fff;
    border: 1px solid rgba(226,234,242,.9);
    border-radius: 2px;
    transform: rotate(45deg) translate(2px, 2px);
    box-shadow: -2px -2px 4px rgba(11,31,63,.04);
  }

  /* Staggered item entrance — each child gets --i set by React */
  .nb-dd--in .nb-dd-item,
  .nb-dd--in .nb-dd-label-row {
    animation: itemSlideIn 280ms cubic-bezier(.22,1,.36,1) both;
    animation-delay: calc(var(--i, 0) * 30ms + 40ms);
  }
  @keyframes itemSlideIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .nb-dd-label-row {
    padding: 6px 10px 8px;
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: #94a3b8;
    display: flex; align-items: center; gap: 6px;
    border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;
  }
  .nb-dd-label-row i { color: #06A3DA; }

  .nb-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    color: #374151; text-decoration: none;
    transition: background .15s ease, color .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
    min-width: 0;
  }
  .nb-dd-item:hover {
    background: var(--glow, #f8fafc);
    color: var(--dot, #0B1F3F);
    transform: translateX(3px);
  }
  .nb-dd-item--all {
    color: #06A3DA; background: rgba(6,163,218,.06);
    border: 1.5px solid rgba(6,163,218,.14); margin-bottom: 4px;
  }
  .nb-dd-item--all:hover { background: rgba(6,163,218,.11); }

  .nb-dd-emoji { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }
  .nb-dd-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; flex-shrink: 0;
    transition: transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .nb-dd-item:hover .nb-dd-icon { transform: scale(1.12) rotate(-4deg); }
  .nb-dd-text { flex: 1; min-width: 0; overflow: hidden; }
  .nb-dd-text-main { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nb-dd-text-sub { display: block; font-size: 11px; font-weight: 400; color: #94a3b8; margin-top: 1px; }
  .nb-dd-badge {
    font-size: 9px; font-weight: 800; letter-spacing: .07em;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; padding: 2px 7px; border-radius: 99px; flex-shrink: 0;
  }

  /* ── Actions ── */
  .nb-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }

  .nb-orders-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 10px;
    border: 1.5px solid #dde6ef; background: #f8fafc;
    font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 700; color: #4a5568;
    cursor: pointer; white-space: nowrap; flex-shrink: 0;
    transition: all .18s ease;
  }
  .nb-orders-btn:hover { border-color: #06A3DA; background: rgba(6,163,218,.07); color: #06A3DA; }
  .nb-orders-btn-lbl { display: none; }

  /* Avatar */
  .nb-profile-wrap { position: relative; flex-shrink: 0; }
  .nb-avatar-btn {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid rgba(6,163,218,.25);
    background: #f1f8fd; cursor: pointer; padding: 0; overflow: visible;
    display: flex; align-items: center; justify-content: center;
    transition: border-color .2s, box-shadow .2s, transform .22s cubic-bezier(.34,1.56,.64,1);
    position: relative;
  }
  .nb-avatar-btn:hover { transform: scale(1.08); }
  .nb-avatar-btn:hover,
  .nb-avatar-btn--open { border-color: #06A3DA; box-shadow: 0 0 0 4px rgba(6,163,218,.12); }
  .nb-avatar-btn--open { transform: scale(1.05); }
  .nb-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .nb-avatar-icon { font-size: 1.55rem; color: #06A3DA; }
  .nb-avatar-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 9px; height: 9px; border-radius: 50%;
    background: #22c55e; border: 2px solid #fff;
  }

  /* ── Profile dropdown — smooth open/close ── */
  .nb-profile-dd {
    position: absolute; top: calc(100% + 12px); right: 0;
    width: min(268px, calc(100vw - 24px));
    background: #fff;
    border: 1px solid rgba(226,234,242,.9);
    border-radius: 18px; padding: 10px;
    box-shadow: 0 24px 64px -10px rgba(11,31,63,.2), 0 4px 16px rgba(11,31,63,.06);
    z-index: 850;
    pointer-events: none;
    /* base (closed) */
    opacity: 0;
    transform: translateY(14px) scale(.96);
    filter: blur(3px);
    transform-origin: top right;
    transition:
      opacity 280ms cubic-bezier(.22,1,.36,1),
      transform 280ms cubic-bezier(.22,1,.36,1),
      filter 280ms cubic-bezier(.22,1,.36,1);
    will-change: opacity, transform, filter;
  }
  .nb-pd-arrow {
    right: 12px; left: auto;
  }
  /* open */
  .nb-profile-dd--in {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
    pointer-events: auto;
  }
  /* close */
  .nb-profile-dd--out {
    opacity: 0;
    transform: translateY(10px) scale(.96);
    filter: blur(2px);
    pointer-events: none;
  }

  /* Staggered profile items */
  .nb-profile-dd--in .nb-pd-item,
  .nb-profile-dd--in .nb-pd-head,
  .nb-profile-dd--in .nb-pd-section,
  .nb-profile-dd--in .nb-pd-div {
    animation: pdItemIn 300ms cubic-bezier(.22,1,.36,1) both;
    animation-delay: calc(var(--i, 0) * 28ms + 50ms);
  }
  .nb-profile-dd--in .nb-pd-head { --i: 0; }
  @keyframes pdItemIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nb-pd-head {
    display: flex; align-items: center; gap: 11px;
    padding: 12px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(6,163,218,.07), rgba(245,126,87,.04));
    margin-bottom: 6px; position: relative;
  }
  .nb-pd-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    object-fit: cover; border: 2.5px solid #06A3DA; flex-shrink: 0;
  }
  .nb-pd-name { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #0B1F3F; }
  .nb-pd-role { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #94a3b8; }
  .nb-pd-status {
    position: absolute; top: 12px; right: 12px;
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,.18);
    animation: statusPulse 2.5s ease-in-out infinite;
  }
  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,.18); }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,.08); }
  }
  .nb-pd-div { height: 1px; background: #f1f5f9; margin: 4px 0; }
  .nb-pd-section {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; color: #94a3b8;
    padding: 5px 12px 3px;
  }
  .nb-pd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; color: #374151;
    text-decoration: none; background: none; border: none; cursor: pointer;
    width: 100%; text-align: left;
    transition: background .15s ease, color .15s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
    position: relative; overflow: hidden;
  }
  /* ripple-like hover fill */
  .nb-pd-item::before {
    content: '';
    position: absolute; inset: 0; border-radius: 10px;
    background: var(--pd-color, #06A3DA);
    opacity: 0;
    transform: scaleX(.85);
    transition: opacity .18s, transform .22s cubic-bezier(.22,1,.36,1);
    pointer-events: none;
  }
  .nb-pd-item:hover::before { opacity: .07; transform: scaleX(1); }
  .nb-pd-item:hover {
    color: var(--pd-color, #06A3DA);
    transform: translateX(2px);
  }
  .nb-pd-item-icon {
    width: 26px; height: 26px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; flex-shrink: 0;
    transition: transform .22s cubic-bezier(.34,1.56,.64,1);
    position: relative; z-index: 1;
  }
  .nb-pd-item:hover .nb-pd-item-icon { transform: scale(1.15) rotate(-5deg); }
  .nb-pd-item-emoji { font-size: 15px; width: 26px; text-align: center; flex-shrink: 0; position: relative; z-index: 1; }
  .nb-pd-item-arrow { color: #d1d5db; font-size: 9px; margin-left: auto; position: relative; z-index: 1; transition: transform .18s, color .18s; }
  .nb-pd-item:hover .nb-pd-item-arrow { transform: translateX(3px); color: var(--pd-color, #06A3DA); }

  .nb-pd-item--danger { color: #ef4444; --pd-color: #ef4444; }
  .nb-pd-item--danger .nb-pd-item-icon { background: rgba(239,68,68,.08); color: #ef4444; }
  .nb-pd-item--primary { color: #06A3DA; --pd-color: #06A3DA; }
  .nb-pd-item--primary .nb-pd-item-icon { background: rgba(6,163,218,.1); color: #06A3DA; }

  /* CTA Button */
  .nb-cta {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; border-radius: 50px;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    text-decoration: none; white-space: nowrap; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(6,163,218,.32);
    transition: all .22s cubic-bezier(.4,0,.2,1);
    letter-spacing: .01em;
  }
  .nb-cta:hover {
    background: linear-gradient(135deg, #F57E57, #d05c35);
    box-shadow: 0 6px 20px rgba(245,126,87,.38);
    color: #fff; transform: translateY(-2px);
  }

  /* Hamburger */
  .nb-hamburger {
    display: none; flex-direction: column; justify-content: space-between;
    width: 38px; height: 38px; padding: 10px 8px;
    background: none; border: 1.5px solid #dde6ef; border-radius: 10px;
    cursor: pointer; flex-shrink: 0; transition: border-color .18s;
  }
  .nb-hamburger:hover { border-color: #06A3DA; }
  .nb-hamburger span {
    display: block; height: 2px; border-radius: 2px;
    background: #0B1F3F; transition: all .26s cubic-bezier(.4,0,.2,1);
    transform-origin: center;
  }
  .nb-hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #06A3DA; }
  .nb-hamburger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nb-hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #06A3DA; }

  /* ════════════════════════════════════════════
     MOBILE DRAWER
  ════════════════════════════════════════════ */
  .nb-mobile {
    position: fixed; inset: 0;
    background: #fff; z-index: 1100;
    transform: translateX(105%);
    transition: transform .34s cubic-bezier(.4,0,.2,1);
    display: flex; flex-direction: column; overflow: hidden;
    will-change: transform;
  }
  .nb-mobile--open { transform: translateX(0); }

  .nb-mob-scroll {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 14px 14px 0;
    display: flex; flex-direction: column; gap: 6px;
    scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
    padding-bottom: 130px;
  }

  .nb-mob-user {
    display: flex; align-items: center; gap: 13px;
    padding: 14px 16px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(6,163,218,.08), rgba(245,126,87,.05));
    margin-bottom: 4px; flex-shrink: 0; position: relative;
  }
  .nb-mob-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    object-fit: cover; border: 2.5px solid #06A3DA; flex-shrink: 0;
  }
  .nb-mob-name { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #0B1F3F; }
  .nb-mob-sub { font-family: 'DM Sans', sans-serif; font-size: 11.5px; color: #22c55e; font-weight: 500; }
  .nb-mob-edit {
    margin-left: auto; width: 32px; height: 32px; border-radius: 9px;
    background: rgba(6,163,218,.1); color: #06A3DA;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 11px; flex-shrink: 0;
  }

  .nb-mob-section {
    display: flex; flex-direction: column; gap: 2px;
    padding-bottom: 6px; border-bottom: 1px solid #f1f5f9;
  }
  .nb-mob-link {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 11px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #374151;
    text-decoration: none;
    transition: background .13s, color .13s;
  }
  .nb-mob-link-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(6,163,218,.08); color: #06A3DA;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .nb-mob-link:hover, .nb-mob-link--active {
    background: rgba(6,163,218,.07); color: #06A3DA;
  }
  .nb-mob-link--active .nb-mob-link-icon { background: rgba(6,163,218,.15); }
  .nb-mob-link-arrow { color: #d1d5db; font-size: 10px; margin-left: auto; flex-shrink: 0; }

  .nb-mob-accordion { border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
  .nb-mob-acc-trigger {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 11px 14px; border-radius: 11px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #374151;
    background: none; border: none; cursor: pointer;
    transition: background .13s;
  }
  .nb-mob-acc-trigger span { display: flex; align-items: center; gap: 12px; }
  .nb-mob-acc-trigger--open { background: rgba(6,163,218,.05); color: #06A3DA; }
  .nb-mob-acc-chevron { color: #a0aec0; font-size: 10px; transition: transform .28s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
  .nb-mob-acc-chevron--up { transform: rotate(180deg); }

  .nb-mob-acc-body {
    max-height: 0; overflow: hidden;
    transition: max-height .32s cubic-bezier(.4,0,.2,1);
    padding: 0 0 0 14px;
  }
  .nb-mob-acc-body--open { max-height: 400px; }

  .nb-mob-sub-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 14px; border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600; color: #4b5563;
    text-decoration: none; min-width: 0;
    transition: background .12s, color .12s, transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .nb-mob-sub-item:hover { background: var(--glow, #f8fafc); color: var(--dot, #0B1F3F); transform: translateX(3px); }
  .nb-mob-sub-item--all { color: #06A3DA; font-weight: 700; }
  .nb-mob-sub-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--dot); flex-shrink: 0;
  }
  .nb-mob-sub-emoji { font-size: 15px; flex-shrink: 0; }

  .nb-mob-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    padding: 12px 16px;
    background: rgba(255,255,255,.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid #f1f5f9;
    box-shadow: 0 -6px 24px rgba(11,31,63,.08);
    display: flex; flex-direction: column; gap: 8px; z-index: 10;
  }
  .nb-mob-cta {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px;
    background: linear-gradient(135deg, #06A3DA, #0484B8);
    color: #fff; border-radius: 13px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(6,163,218,.3);
    transition: opacity .2s, transform .2s;
  }
  .nb-mob-cta:hover { opacity: .9; color: #fff; transform: translateY(-1px); }
  .nb-mob-logout {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px;
    background: none; border: 1.5px solid #fee2e2; color: #ef4444;
    border-radius: 13px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; text-decoration: none;
    transition: background .15s;
  }
  .nb-mob-logout:hover { background: #fff1f1; }
  .nb-mob-login {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px;
    background: rgba(6,163,218,.08); border: 1.5px solid rgba(6,163,218,.2); color: #06A3DA;
    border-radius: 13px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
    text-decoration: none;
    transition: background .15s;
  }
  .nb-mob-login:hover { background: rgba(6,163,218,.13); }

  /* ════════════════════════════════════════════
     AI FAB
  ════════════════════════════════════════════ */
  .nb-ai-fab {
    position: fixed; bottom: 24px; right: 24px;
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #4a90e2, #0056b3);
    color: #fff; border: none; font-size: 20px;
    box-shadow: 0 6px 20px rgba(0,86,179,.38);
    cursor: pointer; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    transition: transform .22s, box-shadow .22s;
  }
  .nb-ai-fab:hover { transform: scale(1.1); box-shadow: 0 10px 28px rgba(0,86,179,.5); }
  .nb-ai-pulse {
    position: absolute; inset: -4px; border-radius: 50%;
    border: 2px solid rgba(74,144,226,.4);
    animation: pulse 2.2s ease-out infinite;
  }
  @keyframes pulse {
    0%   { transform: scale(1);   opacity: .8; }
    80%  { transform: scale(1.5); opacity: 0;  }
    100% { transform: scale(1.5); opacity: 0;  }
  }

  /* ════════════════════════════════════════════
     RESPONSIVE
  ════════════════════════════════════════════ */
  @media (min-width: 1300px) {
    .nb-orders-btn-lbl { display: inline; }
    .nb-link { padding: 0 12px; font-size: 14px; }
  }

  @media (max-width: 1299px) and (min-width: 1024px) {
    .nb-link { padding: 0 8px; font-size: 13px; }
    .nb-brand-text { font-size: 17px; }
    .nb-cta { padding: 8px 14px; font-size: 12.5px; }
  }

  @media (max-width: 1023px) {
    .nb-links  { display: none; }
    .nb-cta    { display: none; }
    .nb-hamburger { display: flex; }
  }

  @media (max-width: 1023px) and (min-width: 768px) {
    .nb-nav-inner { height: 60px; }
    .nb-orders-btn-lbl { display: inline; }
    .nb-topbar-left span { display: none; }
    .nb-topbar-tag { display: none; }
    .nb-profile-dd { right: -60px; }
  }

  @media (max-width: 767px) {
    .nb-topbar { display: none; }
    .nb-nav-inner { height: 54px; padding: 0 14px; gap: 6px; }
    .nb-brand-text { display: none; }
    .nb-brand-mark { width: 34px; height: 34px; }
    .nb-orders-btn { padding: 6px 11px; font-size: 12px; }
    .nb-avatar-btn { width: 36px; height: 36px; }
    .nb-ai-fab { bottom: 90px; right: 16px; width: 44px; height: 44px; font-size: 18px; }
    .nb-profile-dd { right: 0; width: calc(80vw - 28px); }
  }

  @media (max-width: 479px) {
    .nb-nav-inner { padding: 0 10px; gap: 4px; }
    .nb-orders-btn-lbl { display: none !important; }
    .nb-orders-btn { padding: 6px 10px; }
    .nb-hamburger { width: 36px; height: 36px; padding: 9px 7px; }
  }

  @media (max-width: 359px) {
    .nb-brand-mark { width: 30px; height: 30px; font-size: 13px; }
    .nb-orders-btn { padding: 5px 8px; font-size: 11px; }
    .nb-avatar-btn { width: 32px; height: 32px; }
    .nb-hamburger  { width: 32px; height: 32px; padding: 8px 6px; }
  }

  @supports (padding: max(0px)) {
    .nb-nav-inner {
      padding-left:  max(14px, env(safe-area-inset-left));
      padding-right: max(14px, env(safe-area-inset-right));
    }
    .nb-mob-footer { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
    .nb-sidebar { padding-top: env(safe-area-inset-top); }
    .nb-mob-scroll { padding-bottom: max(130px, calc(130px + env(safe-area-inset-bottom))); }
  }
`;