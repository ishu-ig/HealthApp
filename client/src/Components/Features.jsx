import React, { useRef, useEffect, useState } from 'react'

const features = [
  {
    icon: 'fa-handshake',
    tag: '10+ Years',
    title: 'Trusted Company',
    desc: 'Built on a foundation of integrity, our track record speaks through thousands of satisfied patients and healthcare partners nationwide.',
    stat: '50K+',
    statLabel: 'Happy Patients',
    accent: '#06A3DA',
    accentLight: 'rgba(6,163,218,0.08)',
  },
  {
    icon: 'fa-shield-alt',
    tag: 'No Questions',
    title: 'Money-Back Guarantee',
    desc: 'Your peace of mind matters. If we fall short of expectations, we make it right — fast, simple, and completely hassle-free.',
    stat: '100%',
    statLabel: 'Refund Rate',
    accent: '#7C3AED',
    accentLight: 'rgba(124,58,237,0.08)',
  },
  {
    icon: 'fa-sliders-h',
    tag: 'Personalised',
    title: 'Flexible Plans',
    desc: 'From individual coverage to full-family protection, every plan is designed around your life — not the other way around.',
    stat: '30+',
    statLabel: 'Plan Options',
    accent: '#059669',
    accentLight: 'rgba(5,150,105,0.08)',
  },
  {
    icon: 'fa-headset',
    tag: 'Always On',
    title: '24 / 7 Fast Support',
    desc: 'Medical questions don\'t follow office hours. Our expert support team is ready any hour of any day, every day of the year.',
    stat: '<2 min',
    statLabel: 'Avg Response',
    accent: '#DC2626',
    accentLight: 'rgba(220,38,38,0.08)',
  },
]

export default function Features() {
  const [visible, setVisible] = useState([])
  const cardRefs = useRef([])

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(v => [...new Set([...v, i])]), i * 120)
            obs.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <>
      <style>{CSS}</style>

      <section className="feat-section">
        {/* Background grid pattern */}
        <div className="feat-grid-bg" aria-hidden="true" />

        <div className="feat-container">

          {/* ── Header ── */}
          <div className="feat-header">
            <div className="feat-eyebrow">
              <span className="feat-eyebrow-dot" />
              Why Choose Us
              <span className="feat-eyebrow-dot" />
            </div>
            <h2 className="feat-title">
              Healthcare that puts
              <br />
              <em>you</em> at the centre
            </h2>
            <p className="feat-subtitle">
              We combine clinical expertise with compassionate service so every interaction — from first consultation to final claim — feels effortless.
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="feat-grid">
            {features.map(({ icon, tag, title, desc, stat, statLabel, accent, accentLight }, i) => (
              <div
                key={title}
                ref={el => cardRefs.current[i] = el}
                className={`feat-card${visible.includes(i) ? ' feat-card--visible' : ''}`}
                style={{ '--accent': accent, '--accent-light': accentLight }}
              >
                {/* Top row: tag + icon */}
                <div className="feat-card-top">
                  <span className="feat-tag" style={{ color: accent, background: accentLight }}>
                    {tag}
                  </span>
                  <div className="feat-icon-wrap" style={{ background: accentLight }}>
                    <i className={`fa ${icon}`} style={{ color: accent }} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="feat-card-title">{title}</h3>

                {/* Divider */}
                <div className="feat-card-divider" style={{ background: accent }} />

                {/* Desc */}
                <p className="feat-card-desc">{desc}</p>

                {/* Stat */}
                <div className="feat-stat-row">
                  <div className="feat-stat">
                    <span className="feat-stat-value" style={{ color: accent }}>{stat}</span>
                    <span className="feat-stat-label">{statLabel}</span>
                  </div>
                  <a
                    href="#"
                    className="feat-learn-btn"
                    style={{ '--btn-accent': accent }}
                    onClick={e => e.preventDefault()}
                  >
                    Learn more
                    <i className="fa fa-arrow-right feat-btn-arrow" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom strip ── */}
          <div className="feat-bottom-strip">
            {['ISO Certified', 'HIPAA Compliant', 'Govt. Recognised', '5-Star Rated'].map(badge => (
              <div key={badge} className="feat-badge">
                <i className="fa fa-check-circle feat-badge-icon" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  .feat-section {
    font-family: 'Sora', sans-serif;
    background: #f8f7f4;
    position: relative;
    padding: 100px 0 80px;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Subtle dot-grid background */
  .feat-grid-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(9,30,62,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .feat-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
  }

  /* ── Header ── */
  .feat-header {
    text-align: center;
    margin-bottom: 64px;
  }

  .feat-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #06A3DA;
    margin-bottom: 20px;
  }

  .feat-eyebrow-dot {
    width: 20px;
    height: 1.5px;
    background: #06A3DA;
    display: inline-block;
    border-radius: 2px;
  }

  .feat-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    color: #091E3E;
    line-height: 1.18;
    margin: 0 0 20px;
  }

  .feat-title em {
    font-style: italic;
    color: #06A3DA;
  }

  .feat-subtitle {
    font-size: 0.95rem;
    color: #6b7a93;
    line-height: 1.8;
    max-width: 520px;
    margin: 0 auto;
    font-weight: 400;
  }

  /* ── Card Grid ── */
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 48px;
  }

  /* ── Card ── */
  .feat-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px 24px 24px;
    border: 1px solid rgba(9,30,62,0.08);
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.55s cubic-bezier(.4,0,.2,1),
      transform 0.55s cubic-bezier(.4,0,.2,1),
      box-shadow 0.3s,
      border-color 0.3s;
  }

  .feat-card--visible {
    opacity: 1;
    transform: none;
  }

  /* Accent corner glow */
  .feat-card::after {
    content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: var(--accent-light);
    pointer-events: none;
    transition: transform 0.35s;
  }

  .feat-card:hover {
    box-shadow: 0 20px 56px rgba(9,30,62,0.12);
    border-color: var(--accent);
    transform: translateY(-6px);
  }

  .feat-card:hover::after {
    transform: scale(2.2);
  }

  /* Top row */
  .feat-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .feat-tag {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 50px;
  }

  .feat-icon-wrap {
    width: 46px; height: 46px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
    transition: transform 0.3s;
    flex-shrink: 0;
  }

  .feat-card:hover .feat-icon-wrap {
    transform: rotate(-8deg) scale(1.1);
  }

  /* Title */
  .feat-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #091E3E;
    margin: 0 0 12px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  /* Divider */
  .feat-card-divider {
    height: 2px;
    width: 32px;
    border-radius: 2px;
    margin-bottom: 14px;
    transition: width 0.35s;
  }

  .feat-card:hover .feat-card-divider { width: 56px; }

  /* Desc */
  .feat-card-desc {
    font-size: 0.82rem;
    color: #6b7a93;
    line-height: 1.75;
    margin: 0 0 20px;
    font-weight: 400;
    flex: 1;
  }

  /* Stat row */
  .feat-stat-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid rgba(9,30,62,0.07);
    padding-top: 16px;
    margin-top: auto;
  }

  .feat-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .feat-stat-value {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .feat-stat-label {
    font-size: 0.67rem;
    font-weight: 600;
    color: #a0aab8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* Learn more button */
  .feat-learn-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--btn-accent);
    text-decoration: none;
    letter-spacing: 0.04em;
    padding: 7px 14px;
    border-radius: 50px;
    border: 1.5px solid currentColor;
    opacity: 0.75;
    transition: opacity 0.2s, background 0.2s, color 0.2s, transform 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .feat-learn-btn:hover {
    opacity: 1;
    background: var(--btn-accent);
    color: #fff;
    transform: scale(1.04);
  }

  .feat-btn-arrow {
    font-size: 0.6rem;
    transition: transform 0.2s;
  }

  .feat-learn-btn:hover .feat-btn-arrow { transform: translateX(3px); }

  /* ── Bottom trust strip ── */
  .feat-bottom-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    padding: 20px 32px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(9,30,62,0.07);
    box-shadow: 0 2px 12px rgba(9,30,62,0.05);
  }

  .feat-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
  }

  .feat-badge-icon {
    color: #06A3DA;
    font-size: 1rem;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .feat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 600px) {
    .feat-section { padding: 64px 0 56px; }
    .feat-container { padding: 0 20px; }
    .feat-grid { grid-template-columns: 1fr; gap: 16px; }
    .feat-header { margin-bottom: 40px; }
    .feat-bottom-strip { gap: 20px; padding: 16px 20px; }
  }
`