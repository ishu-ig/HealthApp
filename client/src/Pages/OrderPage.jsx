import React, { useEffect, useState, useRef } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicineCheckout }  from '../Redux/ActionCreators/MedicineCheckoutActionCreators'
import { getLabtestCheckout }   from '../Redux/ActionCreators/LabtestCheckoutActionCreators'
import { getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators'
import { getNurseAppointment }  from '../Redux/ActionCreators/NurseAppointmentActionCreators'
import HealthOrder from '../Components/HealthOrder'

const TABS = [
  {
    key: 'all',
    label: 'All Orders',
    shortLabel: 'All',
    icon: '🗂️',
    dot: '#7c3aed',
    glow: 'rgba(124,58,237,0.13)',
    bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    desc: 'Everything in one place',
  },
  {
    key: 'MedicineOrder',
    label: 'Medicine Orders',
    shortLabel: 'Medicines',
    icon: '💊',
    dot: '#059669',
    glow: 'rgba(5,150,105,0.13)',
    bg: 'linear-gradient(135deg,#059669,#34d399)',
    desc: 'Pharma & OTC purchases',
  },
  {
    key: 'LabtestOrder',
    label: 'Lab Test Bookings',
    shortLabel: 'Lab Tests',
    icon: '🧪',
    dot: '#2563eb',
    glow: 'rgba(37,99,235,0.13)',
    bg: 'linear-gradient(135deg,#2563eb,#60a5fa)',
    desc: 'Diagnostic test bookings',
  },
  {
    key: 'DoctorAppointment',
    label: 'Doctor Appointments',
    shortLabel: 'Doctors',
    icon: '🩺',
    dot: '#7c3aed',
    glow: 'rgba(124,58,237,0.13)',
    bg: 'linear-gradient(135deg,#7c3aed,#c084fc)',
    desc: 'Consultations & visits',
  },
  {
    key: 'NurseAppointment',
    label: 'Nurse Appointments',
    shortLabel: 'Nurses',
    icon: '👩‍⚕️',
    dot: '#db2777',
    glow: 'rgba(219,39,119,0.13)',
    bg: 'linear-gradient(135deg,#db2777,#f472b6)',
    desc: 'Home care & nursing',
  },
]

const SECTION_TABS = TABS.filter(t => t.key !== 'all')

export default function OrderPage() {
  const [active,  setActive]  = useState('all')
  const [animKey, setAnimKey] = useState(0)
  const [open,    setOpen]    = useState(false)
  const [mounted, setMounted] = useState(false)
  const wrapRef = useRef(null)

  const MedicineCheckoutStateData  = useSelector(s => s.MedicineCheckoutStateData)  || []
  const LabtestCheckoutStateData   = useSelector(s => s.LabtestCheckoutStateData)   || []
  const DoctorAppointmentStateData = useSelector(s => s.DoctorAppointmentStateData) || []
  const NurseAppointmentStateData  = useSelector(s => s.NurseAppointmentStateData)  || []
  const dispatch = useDispatch()

  // ✅ Fixed: all four fetch on mount once, no infinite loop risk
  useEffect(() => {
    dispatch(getMedicineCheckout())
    dispatch(getLabtestCheckout())
    dispatch(getDoctorAppointment())
    dispatch(getNurseAppointment())
  }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const h = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const dataMap = {
    MedicineOrder:     MedicineCheckoutStateData,
    LabtestOrder:      LabtestCheckoutStateData,
    DoctorAppointment: DoctorAppointmentStateData,
    NurseAppointment:  NurseAppointmentStateData,
  }

  const totalAll = Object.values(dataMap).reduce((a, d) => a + (Array.isArray(d) ? d.length : 0), 0)
  const current  = TABS.find(t => t.key === active)

  function switchTab(key) {
    setActive(key)
    setAnimKey(k => k + 1)
    setOpen(false)
  }

  const countFor = key => key === 'all' ? totalAll : (Array.isArray(dataMap[key]) ? dataMap[key].length : 0)

  return (
    <>
      <style>{STYLES}</style>

      <div className={`op-root${mounted ? ' op-mounted' : ''}`}>
        <HeroSection title="My Orders" />

        {/* ══════════════════════════════════════════
            STICKY HEADER
        ══════════════════════════════════════════ */}
        <header className="op-header">
          <div className="op-header-inner">
            <div className="op-header-top">
              <p className="op-eyebrow">📋 My Orders &amp; Bookings</p>

              {/* Summary chips row */}
              <div className="op-chips-row">
                {SECTION_TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`op-chip${active === tab.key ? ' op-chip--active' : ''}`}
                    style={{ '--c': tab.dot, '--g': tab.glow }}
                    onClick={() => switchTab(tab.key)}
                  >
                    <span className="op-chip-icon">{tab.icon}</span>
                    <span className="op-chip-label">{tab.shortLabel}</span>
                    <span className="op-chip-cnt">{countFor(tab.key)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector row */}
            <div className="op-selector-row">

              {/* Dropdown */}
              <div className="op-select-wrap" ref={wrapRef}>
                <button
                  className={`op-select-btn${open ? ' open' : ''}`}
                  onClick={() => setOpen(o => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                >
                  <span className="op-dot" style={{ background: current.dot }} />
                  <span className="op-icon-lg">{current.icon}</span>
                  <span className="op-select-label">{current.label}</span>
                  <span
                    className="op-select-cnt"
                    style={{ background: current.glow, color: current.dot }}
                  >
                    {countFor(active)}
                  </span>
                  <svg
                    className={`op-chevron${open ? ' open' : ''}`}
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {open && (
                  <ul className="op-dropdown" role="listbox">
                    {TABS.map(tab => {
                      const cnt = countFor(tab.key)
                      const isActive = active === tab.key
                      return (
                        <li
                          key={tab.key}
                          className={`op-option${isActive ? ' active' : ''}`}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => switchTab(tab.key)}
                          style={{ '--c': tab.dot, '--g': tab.glow }}
                        >
                          <span className="op-option-icon">{tab.icon}</span>
                          <div className="op-option-text">
                            <span className="op-option-label">{tab.label}</span>
                            <span className="op-option-desc">{tab.desc}</span>
                          </div>
                          <span
                            className="op-option-cnt"
                            style={{ background: tab.glow, color: tab.dot }}
                          >
                            {cnt}
                          </span>
                          {isActive && (
                            <svg
                              width="13" height="13" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor"
                              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                              style={{ color: tab.dot, flexShrink: 0 }}
                            >
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Pill strip */}
              <div className="op-pill-strip" role="tablist">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`op-pill${active === tab.key ? ' op-pill--on' : ''}`}
                    style={active === tab.key ? { '--c': tab.dot, '--g': tab.glow } : {}}
                    role="tab"
                    aria-selected={active === tab.key}
                    onClick={() => switchTab(tab.key)}
                  >
                    {tab.icon}
                    <span className="op-pill-lbl">{tab.shortLabel}</span>
                    <span
                      className="op-pill-cnt"
                      style={active === tab.key ? { background: tab.glow, color: tab.dot } : {}}
                    >
                      {countFor(tab.key)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════
            CONTENT
        ══════════════════════════════════════════ */}
        <div key={animKey} className="op-content-enter">

          {active === 'all' ? (
            /* ── ALL VIEW ── */
            <div className="op-all-wrap">

              {/* Total summary banner */}
              <div className="op-total-banner">
                <div className="op-total-left">
                  <span className="op-total-icon">🗂️</span>
                  <div>
                    <div className="op-total-num">{totalAll}</div>
                    <div className="op-total-label">Total Records Across All Categories</div>
                  </div>
                </div>
                <div className="op-total-chips">
                  {SECTION_TABS.map(tab => (
                    <div
                      key={tab.key}
                      className="op-total-chip"
                      style={{ '--c': tab.dot, '--g': tab.glow }}
                    >
                      <span>{tab.icon}</span>
                      <span style={{ color: tab.dot, fontWeight: 800 }}>{countFor(tab.key)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat cards */}
              <div className="op-stat-grid">
                {SECTION_TABS.map((tab, i) => {
                  const cnt = countFor(tab.key)
                  return (
                    <button
                      key={tab.key}
                      className="op-stat-card"
                      style={{
                        '--c': tab.dot,
                        '--g': tab.glow,
                        '--bg': tab.bg,
                        animationDelay: `${i * 0.07}s`,
                      }}
                      onClick={() => switchTab(tab.key)}
                    >
                      <div className="op-stat-top">
                        <span className="op-stat-icon">{tab.icon}</span>
                        <span className="op-stat-badge">{cnt} record{cnt !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="op-stat-num">{cnt}</div>
                      <div className="op-stat-label">{tab.label}</div>
                      <div className="op-stat-desc">{tab.desc}</div>
                      <div className="op-stat-arrow">View all →</div>
                      <div className="op-stat-orb" />
                    </button>
                  )
                })}
              </div>

              {/* Section blocks */}
              {SECTION_TABS.map((tab, i) => (
                <React.Fragment key={tab.key}>
                  <div className="op-section" style={{ '--c': tab.dot, '--g': tab.glow }}>
                    <div
                      className="op-section-bar"
                      style={{ background: `linear-gradient(90deg, ${tab.dot}, transparent)` }}
                    />
                    <div className="op-section-hd">
                      <div className="op-section-left">
                        <div
                          className="op-section-icon-wrap"
                          style={{ background: tab.glow, border: `1px solid ${tab.dot}30` }}
                        >
                          <span className="op-section-emoji">{tab.icon}</span>
                        </div>
                        <div>
                          <h2 className="op-section-title" style={{ color: tab.dot }}>{tab.label}</h2>
                          <p className="op-section-sub">{tab.desc}</p>
                        </div>
                      </div>
                      <div className="op-section-right">
                        <span
                          className="op-section-cnt"
                          style={{ background: tab.glow, color: tab.dot }}
                        >
                          {countFor(tab.key)} record{countFor(tab.key) !== 1 ? 's' : ''}
                        </span>
                        <button
                          className="op-section-btn"
                          style={{ color: tab.dot, borderColor: `${tab.dot}30`, background: tab.glow }}
                          onClick={() => switchTab(tab.key)}
                        >
                          View only
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="op-section-body">
                      <HealthOrder title={tab.key} data={dataMap[tab.key] || []} />
                    </div>
                  </div>

                  {i < SECTION_TABS.length - 1 && (
                    <div className="op-divider">
                      <span className="op-divider-line" />
                      <span className="op-divider-pill">
                        <span>{SECTION_TABS[i + 1].icon}</span>
                        {SECTION_TABS[i + 1].shortLabel}
                      </span>
                      <span className="op-divider-line" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

          ) : (
            /* ── SINGLE TAB VIEW ── */
            <div className="op-single-wrap">
              <div className="op-single-hd" style={{ '--c': current.dot, '--g': current.glow, '--bg': current.bg }}>
                <div className="op-single-hd-inner">
                  <div className="op-single-icon">{current.icon}</div>
                  <div>
                    <h1 className="op-single-title">{current.label}</h1>
                    <p className="op-single-sub">{current.desc}</p>
                  </div>
                  <span className="op-single-cnt">
                    {countFor(active)} record{countFor(active) !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="op-single-orb" />
              </div>
              <HealthOrder title={active} data={dataMap[active] || []} />
            </div>
          )}

        </div>
      </div>
    </>
  )
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .op-root * { box-sizing: border-box; }

  .op-root {
    font-family: 'Sora', sans-serif;
    background: #f5f8fb;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .op-root.op-mounted { opacity: 1; }

  /* ══ HEADER ══ */
  .op-header {
    position: sticky;
    top: 0;
    z-index: 110;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid #e8eef5;
    box-shadow: 0 2px 20px rgba(9,30,62,0.06);
  }
  .op-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
  }
  .op-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }
  .op-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b7a93;
    margin: 0;
  }

  /* Chips */
  .op-chips-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .op-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px 4px 7px; border-radius: 999px;
    border: 1.5px solid #e2eaf2; background: #f9fbfd;
    font-size: 11px; font-weight: 600; color: #6b7a93;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .op-chip:hover { border-color: var(--c); color: var(--c); background: var(--g); }
  .op-chip--active { border-color: var(--c); background: var(--g); color: var(--c); }
  .op-chip-icon { font-size: 13px; }
  .op-chip-cnt {
    background: rgba(0,0,0,0.07); border-radius: 99px; padding: 0 5px;
    min-width: 16px; height: 16px;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 0.6rem; font-weight: 800;
  }
  .op-chip--active .op-chip-cnt { background: var(--c); color: #fff; }

  /* Selector row */
  .op-selector-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

  /* Dropdown */
  .op-select-wrap { position: relative; min-width: 260px; }
  .op-select-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; background: #fff;
    border: 1.5px solid #dde5ef; border-radius: 12px;
    cursor: pointer; font-family: inherit;
    font-size: 13.5px; font-weight: 600; color: #0d1b2a;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .op-select-btn:hover,
  .op-select-btn.open { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .op-dot     { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .op-icon-lg { font-size: 16px; line-height: 1; }
  .op-select-label { flex: 1; text-align: left; }
  .op-select-cnt {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1px 8px; border-radius: 99px;
    font-size: 0.68rem; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }
  .op-chevron { color: #6b7a93; transition: transform 0.22s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0; }
  .op-chevron.open { transform: rotate(180deg); }

  .op-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
    background: #fff; border: 1px solid #e2eaf2;
    border-radius: 14px; box-shadow: 0 12px 40px rgba(9,30,62,0.14);
    z-index: 300; padding: 6px; list-style: none; margin: 0; min-width: 280px;
    animation: ddFadeIn 0.2s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes ddFadeIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  .op-option {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; cursor: pointer;
    transition: background 0.12s, transform 0.15s;
  }
  .op-option:hover  { background: #f7f5ff; transform: translateX(2px); }
  .op-option.active { background: var(--g); }
  .op-option-icon   { font-size: 18px; flex-shrink: 0; }
  .op-option-text   { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .op-option-label  { font-size: 13px; font-weight: 600; color: #0d1b2a; }
  .op-option.active .op-option-label { color: var(--c); }
  .op-option-desc   { font-size: 11px; color: #94a3b8; margin-top: 1px; }
  .op-option-cnt {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 1px 8px; border-radius: 99px;
    font-size: 0.66rem; font-weight: 800;
    font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
  }

  /* Pill strip */
  .op-pill-strip { display: flex; gap: 5px; flex-wrap: wrap; }
  .op-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 999px;
    border: 1.5px solid #e2eaf2; background: #f5f8fb;
    font-size: 12px; font-weight: 600; color: #6b7a93;
    cursor: pointer; font-family: inherit; transition: all 0.18s;
  }
  .op-pill:hover { border-color: #7c3aed; background: #f3eeff; color: #0d1b2a; }
  .op-pill--on   { background: var(--g); border-color: var(--c); color: var(--c); }
  .op-pill-lbl   { font-size: 11px; }
  .op-pill-cnt {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 99px; font-size: 0.62rem; font-weight: 800;
    background: rgba(0,0,0,0.07); color: inherit;
    font-family: 'JetBrains Mono', monospace; transition: all 0.18s;
  }

  /* ══ FADE IN on tab switch ══ */
  .op-content-enter {
    animation: opFade 0.38s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes opFade {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ══ TOTAL BANNER ══ */
  .op-total-banner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    background: #fff; border: 1px solid #e8eef5;
    border-radius: 16px; padding: 18px 22px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(9,30,62,0.05);
  }
  .op-total-left { display: flex; align-items: center; gap: 16px; }
  .op-total-icon { font-size: 28px; }
  .op-total-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2rem; font-weight: 700; color: #0d1b2a;
    line-height: 1; letter-spacing: -0.03em;
  }
  .op-total-label { font-size: 11px; font-weight: 600; color: #94a3b8; margin-top: 2px; }
  .op-total-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .op-total-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 99px;
    background: var(--g); font-size: 12px; font-weight: 700;
    border: 1px solid transparent;
  }

  /* ══ ALL VIEW ══ */
  .op-all-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 16px 80px;
  }

  /* Stat cards */
  .op-stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
    margin-bottom: 36px;
  }
  .op-stat-card {
    position: relative; border-radius: 16px; border: none;
    background: var(--bg); padding: 20px 18px 16px;
    cursor: pointer; text-align: left; font-family: inherit;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: cardIn 0.45s ease both;
    box-shadow: 0 4px 20px var(--g);
  }
  .op-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px var(--g); }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  .op-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .op-stat-icon { font-size: 24px; }
  .op-stat-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.75);
    background: rgba(255,255,255,0.18);
    border-radius: 99px; padding: 2px 8px;
  }
  .op-stat-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.6rem; font-weight: 700; color: #fff;
    line-height: 1; margin-bottom: 6px; letter-spacing: -0.03em;
  }
  .op-stat-label { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 2px; }
  .op-stat-desc  { font-size: 0.68rem; color: rgba(255,255,255,0.6); }
  .op-stat-arrow {
    margin-top: 14px; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.7);
    text-transform: uppercase; transition: color 0.15s, letter-spacing 0.15s;
  }
  .op-stat-card:hover .op-stat-arrow { color: #fff; letter-spacing: 0.1em; }
  .op-stat-orb {
    position: absolute; bottom: -30px; right: -30px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,0.1); pointer-events: none;
    transition: transform 0.3s;
  }
  .op-stat-card:hover .op-stat-orb { transform: scale(1.25); }

  /* Section blocks */
  .op-section {
    background: #fff; border: 1px solid #e8eef5;
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 2px 14px rgba(9,30,62,0.05);
    transition: box-shadow 0.2s;
  }
  .op-section:hover { box-shadow: 0 6px 28px rgba(9,30,62,0.09); }
  .op-section-bar { height: 2.5px; width: 100%; }

  .op-section-hd {
    display: flex; align-items: center; justify-content: space-between;
    gap: 14px; padding: 18px 22px 14px; flex-wrap: wrap;
    border-bottom: 1px solid #f0f4f8;
  }
  .op-section-left  { display: flex; align-items: center; gap: 14px; min-width: 0; }
  .op-section-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .op-section-emoji { font-size: 20px; }
  .op-section-title { font-size: 0.9rem; font-weight: 800; letter-spacing: 0.01em; margin: 0 0 2px; }
  .op-section-sub   { font-size: 0.72rem; color: #94a3b8; margin: 0; font-weight: 400; }
  .op-section-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .op-section-cnt {
    padding: 3px 12px; border-radius: 99px;
    font-size: 0.7rem; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
  }
  .op-section-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 99px; border: 1.5px solid;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; cursor: pointer; font-family: inherit; transition: all 0.15s;
  }
  .op-section-btn:hover { filter: brightness(1.08); transform: translateX(2px); }
  .op-section-body { padding: 4px 0 8px; }

  /* Divider */
  .op-divider { display: flex; align-items: center; gap: 14px; padding: 20px 22px; }
  .op-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #dde5ef, transparent); }
  .op-divider-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; background: #fff; border: 1px solid #e2eaf2;
    border-radius: 99px; font-size: 11px; font-weight: 700; color: #6b7a93;
    letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap;
    box-shadow: 0 1px 6px rgba(9,30,62,0.05);
  }

  /* ══ SINGLE TAB VIEW ══ */
  .op-single-wrap { max-width: 1180px; margin: 0 auto; padding: 20px 16px 80px; }
  .op-single-hd {
    position: relative; border-radius: 18px;
    background: var(--bg); overflow: hidden;
    margin-bottom: 24px; box-shadow: 0 6px 28px var(--g);
  }
  .op-single-hd-inner {
    display: flex; align-items: center; gap: 16px;
    padding: 22px 26px; position: relative; z-index: 1; flex-wrap: wrap;
  }
  .op-single-icon  { font-size: 34px; }
  .op-single-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0 0 3px; letter-spacing: -0.02em; }
  .op-single-sub   { font-size: 0.78rem; color: rgba(255,255,255,0.65); margin: 0; }
  .op-single-cnt {
    margin-left: auto; padding: 5px 16px; border-radius: 99px;
    font-size: 0.78rem; font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(255,255,255,0.2); color: #fff;
  }
  .op-single-orb {
    position: absolute; width: 220px; height: 220px; border-radius: 50%;
    background: rgba(255,255,255,0.08); bottom: -80px; right: -60px; pointer-events: none;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 768px) {
    .op-select-wrap  { min-width: 100%; }
    .op-selector-row { flex-direction: column; align-items: stretch; }
    .op-header-top   { flex-direction: column; align-items: flex-start; }
    .op-stat-grid    { grid-template-columns: repeat(2, 1fr); }
    .op-section-hd   { padding: 14px 16px 12px; }
    .op-section-right { width: 100%; justify-content: flex-end; }
    .op-single-hd-inner { padding: 18px; }
    .op-single-cnt   { margin-left: 0; }
    .op-all-wrap     { padding: 16px 12px 60px; }
    .op-total-banner { flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .op-stat-grid  { grid-template-columns: 1fr 1fr; gap: 10px; }
    .op-stat-num   { font-size: 2rem; }
    .op-chips-row  { display: none; }
    .op-total-chips { display: none; }
  }
`