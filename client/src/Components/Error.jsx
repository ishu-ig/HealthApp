import React from 'react'
import { Link } from 'react-router-dom'

export default function Error() {
  return (
    <>
      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'80vh', display:'flex', alignItems:'center', padding:'60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center wow fadeInUp" data-wow-delay="0.2s">

              {/* Big 404 */}
              <div style={{ position:'relative', marginBottom:24 }}>
                <h1 style={{
                  fontFamily:"'Jost',sans-serif",
                  fontSize:'clamp(6rem,15vw,10rem)',
                  fontWeight:900,
                  color:'transparent',
                  WebkitTextStroke:'3px #06A3DA',
                  lineHeight:1,
                  margin:0,
                  letterSpacing:'-0.04em',
                }}>404</h1>
                <div style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)',
                  width:90, height:90,
                  background:'rgba(6,163,218,0.10)',
                  borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <i className="fa fa-heartbeat" style={{ fontSize:'2rem', color:'#06A3DA' }} />
                </div>
              </div>

              <h2 style={{ fontFamily:"'Jost',sans-serif", fontWeight:800, color:'#091E3E', marginBottom:14 }}>
                Page Not Found
              </h2>
              <p style={{ color:'#6b7a93', lineHeight:1.8, marginBottom:32, fontSize:'0.95rem' }}>
                We're sorry, the page you're looking for doesn't exist. It may have been moved or removed.
              </p>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'linear-gradient(135deg,#06A3DA,#0080b0)',
                  color:'#fff', padding:'13px 28px', borderRadius:50,
                  fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
                  boxShadow:'0 6px 18px rgba(6,163,218,0.35)', transition:'all .25s',
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='linear-gradient(135deg,#F57E57,#d05c35)'}
                  onMouseLeave={e=>e.currentTarget.style.background='linear-gradient(135deg,#06A3DA,#0080b0)'}
                >
                  <i className="fa fa-home" />Go Back Home
                </Link>
                <Link to="/contactus" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'transparent', color:'#06A3DA',
                  padding:'13px 28px', borderRadius:50,
                  fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
                  border:'1.5px solid rgba(6,163,218,0.35)', transition:'all .25s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#06A3DA';e.currentTarget.style.color='#fff'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color='#06A3DA'}}
                >
                  <i className="fa fa-envelope" />Contact Support
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}