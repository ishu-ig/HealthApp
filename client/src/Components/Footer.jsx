import React from 'react'
import { Link } from 'react-router-dom'

const quickLinks = ['Home','About Us','Our Services','Doctors','Contact Us']
const services   = ['Teeth Whitening','Dental Implant','Root Canal','Lab Tests','Nurse Care']
const socials    = [
  { icon:'fab fa-facebook-f', href:'#' },
  { icon:'fab fa-twitter',    href:'#' },
  { icon:'fab fa-instagram',  href:'#' },
  { icon:'fab fa-linkedin-in',href:'#' },
]

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          color:rgba(255,255,255,0.65);
          text-decoration:none;
          font-size:0.875rem;
          display:inline-flex; align-items:center; gap:8px;
          transition:color .2s, gap .2s;
          line-height:2;
        }
        .footer-link:hover { color:#06A3DA; gap:12px; }
        .footer-link i { color:#06A3DA; font-size:0.7rem; }
        .footer-social {
          width:38px; height:38px;
          background:rgba(255,255,255,0.08);
          border-radius:50%;
          display:inline-flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,0.75); font-size:0.85rem;
          text-decoration:none;
          transition:background .2s, color .2s, transform .2s;
        }
        .footer-social:hover { background:#06A3DA; color:#fff; transform:translateY(-3px); }
        .footer-divider { border-color:rgba(255,255,255,0.10); }
      `}</style>

      {/* Main footer */}
      <footer style={{ background:'#091E3E', paddingTop:64, paddingBottom:32 }} className="wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row g-5">

            {/* Brand column */}
            <div className="col-lg-4 col-md-6">
              <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:42, height:42, background:'linear-gradient(135deg,#06A3DA,#0080b0)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(6,163,218,0.4)' }}>
                  <i className="fa fa-heartbeat" style={{ color:'#fff', fontSize:'1.1rem' }} />
                </div>
                <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:800, fontSize:'1.3rem', color:'#fff' }}>
                  Health<span style={{ color:'#F57E57' }}>Care</span>
                </span>
              </Link>
              <p style={{ color:'rgba(255,255,255,0.60)', fontSize:'0.875rem', lineHeight:1.8, marginBottom:20 }}>
                Providing world-class dental and healthcare services with a team of experienced professionals dedicated to your well-being.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                {socials.map(s => <a key={s.icon} href={s.href} className="footer-social"><i className={s.icon} /></a>)}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 style={{ color:'#fff', fontWeight:700, fontSize:'1rem', marginBottom:18, letterSpacing:'0.03em' }}>
                Quick Links
              </h6>
              <div className="d-flex flex-column">
                {quickLinks.map(l => (
                  <a key={l} href="#" className="footer-link">
                    <i className="fa fa-chevron-right" />{l}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="col-lg-2 col-md-6">
              <h6 style={{ color:'#fff', fontWeight:700, fontSize:'1rem', marginBottom:18, letterSpacing:'0.03em' }}>
                Our Services
              </h6>
              <div className="d-flex flex-column">
                {services.map(s => (
                  <a key={s} href="#" className="footer-link">
                    <i className="fa fa-chevron-right" />{s}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="col-lg-4 col-md-6">
              <h6 style={{ color:'#fff', fontWeight:700, fontSize:'1rem', marginBottom:18, letterSpacing:'0.03em' }}>
                Get In Touch
              </h6>
              {[
                { icon:'fa-map-marker-alt', text:'123 Street, New York, USA' },
                { icon:'fa-envelope',       text:'info@example.com' },
                { icon:'fa-phone',          text:'+012 345 67890' },
                { icon:'fa-clock',          text:'Mon–Sat: 9am – 8pm' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
                  <div style={{ width:34, height:34, flexShrink:0, background:'rgba(6,163,218,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className={`fa ${icon}`} style={{ color:'#06A3DA', fontSize:'0.8rem' }} />
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.875rem', lineHeight:1.6 }}>{text}</span>
                </div>
              ))}
            </div>

          </div>

          <hr className="footer-divider mt-5 mb-4" />

          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p style={{ color:'rgba(255,255,255,0.50)', fontSize:'0.82rem', margin:0 }}>
                &copy; {new Date().getFullYear()} <Link to="/" style={{ color:'#06A3DA', textDecoration:'none', fontWeight:600 }}>Health<span style={{color:'#F57E57'}}>Care</span></Link>. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p style={{ color:'rgba(255,255,255,0.50)', fontSize:'0.82rem', margin:0 }}>
                Designed with <i className="fa fa-heart" style={{ color:'#F57E57', margin:'0 4px' }} /> by <span style={{ color:'#06A3DA', fontWeight:600 }}>Ishaan</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}