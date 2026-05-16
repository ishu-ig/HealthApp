import React from 'react'
import { Link } from 'react-router-dom'

export default function Offers() {
  return (
    <>
      <div style={{
        background:'linear-gradient(135deg,rgba(9,30,62,0.88) 0%,rgba(6,163,218,0.80) 100%), url(/img/carousel-1.jpg) center/cover no-repeat',
        padding:'80px 0',
        position:'relative', overflow:'hidden',
      }} className="wow fadeInUp" data-wow-delay="0.1s">

        {/* decorative rings */}
        {[220,320].map((s,i) => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:s, height:s, borderRadius:'50%',
            border:'1px solid rgba(255,255,255,0.08)',
            pointerEvents:'none',
          }} />
        ))}

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center wow zoomIn" data-wow-delay="0.3s">

              <span style={{
                display:'inline-block', background:'rgba(245,126,87,0.25)',
                color:'#F57E57', fontSize:'0.72rem', fontWeight:800,
                letterSpacing:'0.10em', textTransform:'uppercase',
                padding:'5px 18px', borderRadius:50, marginBottom:18,
                border:'1px solid rgba(245,126,87,0.35)',
              }}>Limited Time Offer</span>

              <h2 style={{
                fontFamily:"'Jost',sans-serif",
                fontSize:'clamp(1.8rem,4vw,2.8rem)',
                fontWeight:800, color:'#fff', marginBottom:18, lineHeight:1.2,
              }}>
                Save <span style={{color:'#F57E57'}}>30%</span> On Your First Dental Checkup
              </h2>

              <p style={{ color:'rgba(255,255,255,0.80)', lineHeight:1.8, marginBottom:32, fontSize:'1rem' }}>
                Eirmod sed tempor lorem ut dolores sit kasd ipsum. Dolor ea et dolore et at sea ea at dolor justo ipsum duo rebum sea.
              </p>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/appointment" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'#F57E57', color:'#fff',
                  padding:'13px 28px', borderRadius:50,
                  fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
                  boxShadow:'0 6px 20px rgba(245,126,87,0.45)',
                  transition:'all .25s',
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='#d05c35'}
                  onMouseLeave={e=>e.currentTarget.style.background='#F57E57'}
                >
                  <i className="fa fa-calendar-check" />Book Appointment
                </Link>
                <Link to="/about" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'rgba(255,255,255,0.12)', color:'#fff',
                  padding:'13px 28px', borderRadius:50,
                  fontWeight:700, fontSize:'0.9rem', textDecoration:'none',
                  border:'1.5px solid rgba(255,255,255,0.35)',
                  transition:'all .25s', backdropFilter:'blur(4px)',
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.22)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                >
                  <i className="fa fa-info-circle" />Read More
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}