import React from 'react'
import { Link } from 'react-router-dom'

const checks = [
  { icon:'fa-trophy',      label:'Award Winning'    },
  { icon:'fa-user-md',     label:'Professional Staff'},
  { icon:'fa-clock',       label:'24/7 Opened'      },
  { icon:'fa-hand-holding-usd', label:'Fair Prices'  },
]

export default function About() {
  return (
    <>
      <style>{`
        .about-img-wrap { position:relative; }
        .about-img-wrap::before {
          content:''; position:absolute;
          top:-16px; left:-16px;
          width:60%; height:60%;
          border:3px solid #06A3DA;
          border-radius:12px;
          z-index:0;
        }
        .about-img-wrap img { position:relative; z-index:1; }
        .about-stat {
          background:#EEF9FF;
          border-radius:12px;
          padding:18px 20px;
          border-left:4px solid #06A3DA;
          transition:transform .3s;
        }
        .about-stat:hover { transform:translateY(-4px); }
      `}</style>

      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s"
           style={{ background:'#f7fbff' }}>
        <div className="container">
          <div className="row g-5 align-items-center">

            {/* ── Text column ── */}
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2s">
              <span style={{
                display:'inline-block', background:'rgba(6,163,218,0.10)',
                color:'#06A3DA', fontSize:'0.75rem', fontWeight:800,
                letterSpacing:'0.09em', textTransform:'uppercase',
                padding:'5px 18px', borderRadius:50, marginBottom:14,
                border:'1px solid rgba(6,163,218,0.22)',
              }}>About Us</span>

              <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#091E3E', marginBottom:16, lineHeight:1.2 }}>
                The World's Best Dental Clinic <span style={{color:'#06A3DA'}}>That You Can Trust</span>
              </h2>

              <p style={{ fontSize:'1.05rem', fontStyle:'italic', color:'#5a6a85', marginBottom:16, lineHeight:1.7 }}>
                Diam dolor diam ipsum sit. Clita erat ipsum et lorem stet no lorem sit clita duo justo magna dolore.
              </p>
              <p style={{ color:'#6b7a93', lineHeight:1.8, marginBottom:28 }}>
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit.
              </p>

              {/* Feature checks */}
              <div className="row g-3 mb-4">
                {checks.map(({ icon, label }) => (
                  <div key={label} className="col-6">
                    <div className="about-stat d-flex align-items-center gap-3">
                      <div style={{
                        width:38, height:38, flexShrink:0,
                        background:'rgba(6,163,218,0.12)',
                        borderRadius:'50%',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <i className={`fa ${icon}`} style={{ color:'#06A3DA', fontSize:'0.95rem' }} />
                      </div>
                      <span style={{ fontWeight:700, fontSize:'0.88rem', color:'#091E3E' }}>{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/appointment" style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'linear-gradient(135deg,#06A3DA,#0080b0)',
                color:'#fff', padding:'13px 28px', borderRadius:50,
                fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
                boxShadow:'0 6px 18px rgba(6,163,218,0.35)', transition:'all .25s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#F57E57,#d05c35)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='linear-gradient(135deg,#06A3DA,#0080b0)'}}
              >
                <i className="fa fa-calendar-check" />Make Appointment
              </Link>
            </div>

            {/* ── Image column ── */}
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.4s">
              <div className="about-img-wrap">
                <img
                  src="img/about.jpg"
                  alt="About HealthCare"
                  style={{ width:'100%', borderRadius:16, boxShadow:'0 20px 60px rgba(9,30,62,0.18)', objectFit:'cover', minHeight:380 }}
                />
                {/* floating badge */}
                <div style={{
                  position:'absolute', bottom:28, left:-24,
                  background:'#fff', borderRadius:14,
                  padding:'14px 20px',
                  boxShadow:'0 8px 30px rgba(9,30,62,0.16)',
                  display:'flex', alignItems:'center', gap:14,
                  zIndex:2,
                }}>
                  <div style={{
                    width:48, height:48,
                    background:'linear-gradient(135deg,#06A3DA,#0080b0)',
                    borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <i className="fa fa-award" style={{ color:'#fff', fontSize:'1.2rem' }} />
                  </div>
                  <div>
                    <p style={{ margin:0, fontWeight:800, fontSize:'1.3rem', color:'#091E3E', lineHeight:1 }}>15+</p>
                    <p style={{ margin:0, fontSize:'0.75rem', color:'#6b7a93', fontWeight:500 }}>Years of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}