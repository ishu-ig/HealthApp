import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E'

const plans = [
  { img:'img/price-1.jpg', title:'Teeth Whitening', price:'$35', features:['Modern Equipment','Professional Dentist','24/7 Call Support','Free Consultation'] },
  { img:'img/price-2.jpg', title:'Dental Implant',  price:'$49', features:['Modern Equipment','Professional Dentist','24/7 Call Support','Free Consultation'] },
  { img:'img/price-3.jpg', title:'Root Canal',       price:'$99', features:['Modern Equipment','Professional Dentist','24/7 Call Support','Free Consultation'] },
]

function FeatureRow({ label }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, padding:'6px 0', borderBottom:'1px solid rgba(6,163,218,0.08)' }}>
      <span style={{ fontSize:'0.85rem', color:'#6b7a93' }}>{label}</span>
      <div style={{ width:20, height:20, background:'rgba(6,163,218,0.12)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <i className="fa fa-check" style={{ color:P, fontSize:'0.65rem' }} />
      </div>
    </div>
  )
}

export default function PriceSection() {
  const [slidesPerView, setSlidesPerView] = useState(2)
  useEffect(() => {
    const fn = () => setSlidesPerView(window.innerWidth < 900 ? 1 : window.innerWidth < 1200 ? 2 : 2)
    fn(); window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <>
      <style>{`
        .price-card {
          border-radius:20px; overflow:hidden;
          background:#fff;
          box-shadow:0 6px 28px rgba(9,30,62,0.09);
          transition:transform .35s, box-shadow .35s;
          height:100%;
        }
        .price-card:hover { transform:translateY(-10px); box-shadow:0 20px 50px rgba(9,30,62,0.14); }
        .price-badge-hc {
          position:absolute; top:-28px; left:50%; transform:translateX(-50%);
          width:72px; height:72px; background:#fff;
          border-radius:50%;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          box-shadow:0 6px 16px rgba(9,30,62,0.14);
          border:3px solid ${P};
          z-index:2;
        }
        .price-section .swiper-pagination-bullet { background:rgba(6,163,218,0.3) !important; opacity:1; }
        .price-section .swiper-pagination-bullet-active { background:${P} !important; width:18px; border-radius:4px; }
        .price-section .swiper-button-next,
        .price-section .swiper-button-prev {
          width:40px; height:40px; background:#fff;
          border-radius:50%; box-shadow:0 4px 14px rgba(9,30,62,0.14);
          top:44%;
        }
        .price-section .swiper-button-next::after,
        .price-section .swiper-button-prev::after { font-size:.85rem; font-weight:900; color:${DARK}; }
        .price-section .swiper-button-next:hover,
        .price-section .swiper-button-prev:hover { background:${P}; }
        .price-section .swiper-button-next:hover::after,
        .price-section .swiper-button-prev:hover::after { color:#fff; }
      `}</style>

      <div className="container-fluid py-5 price-section wow fadeInUp" data-wow-delay="0.1s"
           style={{ background:'linear-gradient(135deg,#f0f8ff 0%,#fff 100%)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">

            {/* Left text */}
            <div className="col-lg-5">
              <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:14, border:`1px solid rgba(6,163,218,0.22)` }}>
                Pricing Plan
              </span>
              <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'clamp(1.8rem,3vw,2.4rem)', fontWeight:800, color:DARK, marginBottom:14, lineHeight:1.2 }}>
                We Offer Fair Prices for <span style={{color:P}}>Dental Treatment</span>
              </h2>
              <div style={{ width:56, height:4, background:`linear-gradient(90deg,${P},${S})`, borderRadius:4, marginBottom:18 }} />
              <p style={{ color:'#6b7a93', lineHeight:1.8, marginBottom:28, fontSize:'0.9rem' }}>
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit.
              </p>
              <div style={{ background:'rgba(6,163,218,0.06)', borderRadius:14, padding:'18px 20px', border:`1px solid rgba(6,163,218,0.14)` }}>
                <p style={{ margin:'0 0 4px', fontSize:'0.75rem', fontWeight:700, color:P, textTransform:'uppercase', letterSpacing:'0.06em' }}>Call for Appointment</p>
                <p style={{ margin:0, fontFamily:"'Jost',sans-serif", fontWeight:800, fontSize:'1.5rem', color:DARK }}>+012 345 6789</p>
              </div>
            </div>

            {/* Right swiper */}
            <div className="col-lg-7">
              <Swiper
                slidesPerView={slidesPerView}
                spaceBetween={24}
                loop
                autoplay={{ delay:3500, disableOnInteraction:false }}
                pagination={{ clickable:true }}
                navigation
                modules={[Pagination, Autoplay, Navigation]}
                className="pb-5"
              >
                {plans.map(({ img, title, price, features }) => (
                  <SwiperSlide key={title}>
                    <div className="price-card">
                      {/* Image */}
                      <div style={{ position:'relative', overflow:'hidden', height:220 }}>
                        <img src={img} alt={title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
                          onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
                          onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                        />
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(9,30,62,0.05),rgba(9,30,62,0.4))' }} />
                        {/* Price badge */}
                        <div className="price-badge-hc">
                          <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:900, fontSize:'1.1rem', color:P, lineHeight:1 }}>{price}</span>
                        </div>
                      </div>
                      {/* Body */}
                      <div style={{ padding:'44px 24px 28px', textAlign:'center' }}>
                        <h4 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:20 }}>{title}</h4>
                        {features.map(f => <FeatureRow key={f} label={f} />)}
                        <Link to="/appointment" style={{
                          display:'inline-flex', alignItems:'center', gap:7, marginTop:18,
                          background:`linear-gradient(135deg,${P},#0080b0)`,
                          color:'#fff', padding:'11px 24px', borderRadius:50,
                          fontWeight:700, fontSize:'0.85rem', textDecoration:'none',
                          boxShadow:`0 6px 16px rgba(6,163,218,0.35)`, transition:'all .25s',
                        }}
                          onMouseEnter={e=>e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)`}
                          onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)`}
                        >
                          <i className="fa fa-calendar-check" />Appointment
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}