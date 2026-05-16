import React from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection({ title }) {
  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(9,30,62,0.92) 0%, rgba(6,163,218,0.85) 100%), url(/img/carousel-1.jpg) center/cover no-repeat',
        padding: '72px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(245,126,87,0.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(6,163,218,0.15)', pointerEvents:'none' }} />

        <div className="container text-center" style={{ position:'relative', zIndex:1 }}>
          <span style={{
            display:'inline-block', background:'rgba(6,163,218,0.25)',
            color:'#7dd9f5', fontSize:'0.72rem', fontWeight:700,
            letterSpacing:'0.10em', textTransform:'uppercase',
            padding:'5px 18px', borderRadius:50, marginBottom:14,
            border:'1px solid rgba(6,163,218,0.35)',
          }}>
            HealthCare
          </span>
          <h1 style={{
            fontFamily:"'Jost',sans-serif", fontSize:'clamp(2rem,5vw,3rem)',
            fontWeight:800, color:'#fff', margin:'0 0 16px', lineHeight:1.15,
          }}>
            {title}
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0" style={{ background:'none', padding:0 }}>
              <li className="breadcrumb-item">
                <Link to="/" style={{ color:'rgba(255,255,255,0.70)', textDecoration:'none', fontSize:'0.9rem' }}>Home</Link>
              </li>
              <li className="breadcrumb-item active" style={{ color:'#F57E57', fontSize:'0.9rem', fontWeight:600 }}>
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </>
  )
}