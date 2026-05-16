import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cart from '../Components/Cart';

const TABS = [
  { key: 'all',      label: 'All Carts',      dot: '#8b5cf6', icon: '🛒' },
  { key: 'medicine', label: 'Medicine Cart',   dot: '#06A3DA', icon: '💊' },
  { key: 'labtest',  label: 'Lab Test Cart',   dot: '#1D9E75', icon: '🧪' },
];

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params   = new URLSearchParams(location.search);

  // Default to 'all' if no valid type param
  const initTab  = TABS.some(t => t.key === params.get('type'))
    ? params.get('type')
    : 'all';

  const [active, setActive] = useState(initTab);
  const [open,   setOpen]   = useState(false);
  const wrapRef             = useRef(null);

  const current = TABS.find(t => t.key === active);

  const switchTab = (key) => {
    setActive(key);
    setOpen(false);
    navigate(key === 'all' ? '/cart' : `/cart?type=${key}`, { replace: true });
  };

  // Sync with URL changes (e.g. back/forward navigation)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const t = p.get('type');
    if (!t) setActive('all');
    else if (TABS.some(tab => tab.key === t)) setActive(t);
  }, [location.search]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <header className="cp-header">
        <div className="cp-header-inner">
          <p className="cp-eyebrow">🛒 My Cart</p>

          <div className="cp-select-wrap" ref={wrapRef}>
            <button
              className={`cp-select-btn${open ? ' open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="cp-dot" style={{ background: current.dot }} />
              <span className="cp-icon">{current.icon}</span>
              <span>{current.label}</span>
              <i className={`ti ti-chevron-down cp-chevron${open ? ' open' : ''}`} aria-hidden="true" />
            </button>

            {open && (
              <ul className="cp-dropdown" role="listbox">
                {TABS.map(tab => (
                  <li
                    key={tab.key}
                    className={`cp-option${active === tab.key ? ' active' : ''}`}
                    role="option"
                    aria-selected={active === tab.key}
                    onClick={() => switchTab(tab.key)}
                  >
                    <span className="cp-dot" style={{ background: tab.dot }} />
                    <span className="cp-icon">{tab.icon}</span>
                    {tab.label}
                    {active === tab.key && (
                      <i className="ti ti-check cp-check" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tab pills — quick switcher */}
          <div className="cp-tab-pills" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`cp-pill${active === tab.key ? ' cp-pill--active' : ''}`}
                style={active === tab.key ? { '--pill-color': tab.dot } : {}}
                role="tab"
                aria-selected={active === tab.key}
                onClick={() => switchTab(tab.key)}
              >
                <span>{tab.icon}</span>
                <span className="cp-pill-label">{tab.label}</span>
                {active === tab.key && <span className="cp-pill-dot" style={{ background: tab.dot }} />}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        {active === 'all' && (
          <div className="cp-all-wrap">
            {/* Medicine section */}
            <div className="cp-section">
              <div className="cp-section-header" style={{ '--accent': '#06A3DA' }}>
                <span className="cp-section-icon">💊</span>
                <span className="cp-section-title">Medicine Cart</span>
                <span
                  className="cp-section-switch"
                  onClick={() => switchTab('medicine')}
                  title="View medicine cart only"
                >
                  View only →
                </span>
              </div>
              <Cart title="medicine" />
            </div>

            {/* Divider */}
            <div className="cp-section-divider">
              <span className="cp-divider-line" />
              <span className="cp-divider-label">🧪 Lab Tests</span>
              <span className="cp-divider-line" />
            </div>

            {/* Labtest section */}
            <div className="cp-section">
              <div className="cp-section-header" style={{ '--accent': '#1D9E75' }}>
                <span className="cp-section-icon">🧪</span>
                <span className="cp-section-title">Lab Test Cart</span>
                <span
                  className="cp-section-switch"
                  onClick={() => switchTab('labtest')}
                  title="View lab test cart only"
                >
                  View only →
                </span>
              </div>
              <Cart title="labtest" />
            </div>
          </div>
        )}

        {active === 'medicine' && <Cart title="medicine" />}
        {active === 'labtest'  && <Cart title="labtest"  />}
      </main>
    </>
  );
}

const STYLES = `
  /* ── Header ── */
  .cp-header {
    position: sticky;
    top: 0;
    z-index: 110;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(14px);
    border-bottom: 0.5px solid rgba(6,163,218,0.14);
    box-shadow: 0 2px 16px rgba(9,30,62,0.06);
  }
  .cp-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 20px 10px;
  }
  .cp-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b7a93;
    margin: 0 0 10px;
  }

  /* ── Dropdown select ── */
  .cp-select-wrap {
    position: relative;
    display: inline-block;
    min-width: 230px;
    margin-bottom: 12px;
  }
  .cp-select-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    background: #fff;
    border: 1px solid rgba(6,163,218,0.2);
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: #091E3E;
    width: 100%;
    transition: border-color 0.15s;
  }
  .cp-select-btn:hover, .cp-select-btn.open { border-color: #06A3DA; }
  .cp-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cp-icon { font-size: 15px; line-height: 1; }
  .cp-chevron { margin-left: auto; font-size: 14px; color: #6b7a93; transition: transform 0.2s; }
  .cp-chevron.open { transform: rotate(180deg); }

  .cp-dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0; right: 0;
    background: #fff;
    border: 1px solid rgba(6,163,218,0.18);
    border-radius: 12px;
    box-shadow: 0 8px 28px rgba(9,30,62,0.12);
    z-index: 200;
    padding: 6px;
    list-style: none;
    margin: 0;
  }
  .cp-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #091E3E;
    cursor: pointer;
    transition: background 0.12s;
  }
  .cp-option:hover  { background: #f4f8ff; }
  .cp-option.active { background: #e8f6fc; color: #06A3DA; font-weight: 600; }
  .cp-check { margin-left: auto; font-size: 13px; color: #06A3DA; }

  /* ── Tab pills (quick switcher bar) ── */
  .cp-tab-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .cp-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 14px;
    border-radius: 999px;
    border: 1.5px solid #e2eaf2;
    background: #f5f8fb;
    font-size: 12px;
    font-weight: 600;
    color: #6b7a93;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    position: relative;
  }
  .cp-pill:hover { border-color: #06A3DA; color: #091E3E; background: #eaf6fb; }
  .cp-pill--active {
    background: color-mix(in srgb, var(--pill-color, #06A3DA) 12%, white);
    border-color: var(--pill-color, #06A3DA);
    color: var(--pill-color, #06A3DA);
  }
  .cp-pill-label { font-size: 12px; }
  .cp-pill-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    display: inline-block;
    margin-left: 2px;
  }

  /* ── All view wrapper ── */
  .cp-all-wrap {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0;
  }

  /* ── Section block ── */
  .cp-section {
    position: relative;
  }
  .cp-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 20px 4px;
    max-width: 1180px;
    margin: 0 auto;
  }
  .cp-section-icon { font-size: 18px; }
  .cp-section-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent, #06A3DA);
    border-left: 3px solid var(--accent, #06A3DA);
    padding-left: 10px;
  }
  .cp-section-switch {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    color: var(--accent, #06A3DA);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s;
    letter-spacing: 0.04em;
    text-decoration: none;
  }
  .cp-section-switch:hover { opacity: 1; text-decoration: underline; }

  /* ── Divider between sections ── */
  .cp-section-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 20px;
    max-width: 1180px;
    margin: 0 auto;
  }
  .cp-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2eaf2, transparent);
  }
  .cp-divider-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7a90a4;
    white-space: nowrap;
  }
`;