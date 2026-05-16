import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import About from '../Components/About'
import Services from '../Components/Services'
import Offers from '../Components/Offers'
import PriceSection from '../Components/PriceSection'
import Testimonials from '../Components/Testimonials'
import Doctors from '../Components/Doctors'
import Features from '../Components/Features'

import { getDoctor } from '../Redux/ActionCreators/DoctorActionCreators'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecialization } from '../Redux/ActionCreators/SpecializationActionCreators'
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators'
import { getLabtestCategory } from '../Redux/ActionCreators/LabtestCategoryActionCreators'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E'

const slides = [
  { img:'img/carousel-1.jpg', tag:'Keep Your Teeth Healthy',   heading:'Take The Best Quality Dental Treatment' },
  { img:'img/carousel-2.jpg', tag:'Expert Care, Every Visit',  heading:'Your Health Is Our Top Priority' },
]

const bannerCards = [
  {
    bg: `linear-gradient(135deg,${P},#0080b0)`,
    icon: 'fa-clock',
    title: 'Opening Hours',
    content: (
      <div style={{ flex:1 }}>
        {[['Mon – Fri','8:00am – 9:00pm'],['Saturday','8:00am – 7:00pm'],['Sunday','8:00am – 5:00pm']].map(([d,t]) => (
          <div key={d} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.15)', fontSize:'0.85rem' }}>
            <span style={{ color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{d}</span>
            <span style={{ color:'#fff' }}>{t}</span>
          </div>
        ))}
      </div>
    ),
    cta: { label:'Book Appointment', to:'/appointment' },
  },
  {
    bg: `linear-gradient(135deg,${DARK},#0d2a5e)`,
    icon: 'fa-user-md',
    title: 'Find a Doctor',
    content: (
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <input type="text" placeholder="Appointment Date" style={{ padding:'10px 14px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'0.85rem', outline:'none', backdropFilter:'blur(4px)' }} />
        <select style={{ padding:'10px 14px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'0.85rem', outline:'none' }}>
          <option>Select a Specialization</option>
        </select>
      </div>
    ),
    cta: { label:'Search Doctor', to:'/doctors' },
  },
  {
    bg: `linear-gradient(135deg,${S},#d05c35)`,
    icon: 'fa-headset',
    title: 'Make Appointment',
    content: (
      <div style={{ flex:1 }}>
        <p style={{ color:'rgba(255,255,255,0.82)', fontSize:'0.85rem', lineHeight:1.7, marginBottom:12 }}>
          Our team of specialists is ready to help. Call us or book online for a seamless experience.
        </p>
        <p style={{ color:'#fff', fontWeight:800, fontSize:'1.4rem', fontFamily:"'Jost',sans-serif", margin:0 }}>
          +012 345 6789
        </p>
      </div>
    ),
    cta: { label:'Contact Us', to:'/contactus' },
  },
]

export default function HomePage() {
  const DoctorStateData           = useSelector(s => s.DoctorStateData)
  const SpecializationStateData   = useSelector(s => s.SpecializationStateData)
  const MedicineCategoryStateData = useSelector(s => s.MedicineCategoryStateData)
  const LabtestCategoryStateData  = useSelector(s => s.LabtestCategoryStateData)
  const dispatch = useDispatch()

  useEffect(() => { dispatch(getDoctor()) },           [DoctorStateData.length])
  useEffect(() => { dispatch(getSpecialization()) },   [SpecializationStateData.length])
  useEffect(() => { dispatch(getMedicineCategory()) }, [MedicineCategoryStateData.length])
  useEffect(() => { dispatch(getLabtestCategory()) },  [MedicineCategoryStateData.length])

  return (
    <>
      <style>{`
        /* ── Hero carousel ── */
        .hc-hero { position:relative; height:680px; overflow:hidden; }
        .hc-hero img { width:100%; height:100%; object-fit:cover; }
        .hc-hero-overlay {
          position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(9,30,62,0.88) 0%,rgba(6,163,218,0.65) 100%);
          display:flex; align-items:center; justify-content:center;
        }
        @media(max-width:576px){ .hc-hero{ height:480px; } }

        /* ── Hero slide transition ── */
        .carousel-item { transition:opacity .7s ease-in-out; }

        /* ── Banner card ── */
        .banner-card {
          border-radius:20px; overflow:hidden;
          padding:28px 26px 22px;
          display:flex; flex-direction:column; gap:16px;
          min-height:300px;
          box-shadow:0 12px 36px rgba(9,30,62,0.18);
          transition:transform .3s; cursor:default;
        }
        .banner-card:hover { transform:translateY(-6px); }

        /* ── Stat number ── */
        .hc-stat { text-align:center; }
        .hc-stat span { font-family:"'Jost',sans-serif"; font-weight:800; font-size:2.2rem; color:${P}; }
        .hc-stat p   { font-size:.8rem; color:#6b7a93; margin:0; }
      `}</style>

      {/* ══ Hero Carousel ══ */}
      <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div key={i} className={`carousel-item ${i===0?'active':''}`}>
              <div className="hc-hero">
                <img src={s.img} alt="slide" />
                <div className="hc-hero-overlay">
                  <div style={{ textAlign:'center', maxWidth:820, padding:'0 24px', position:'relative', zIndex:1 }}>

                    {/* Decorative ring */}
                    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:440, height:440, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', pointerEvents:'none' }} />

                    <span style={{ display:'inline-block', background:'rgba(245,126,87,0.25)', color:'#F57E57', fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', padding:'6px 20px', borderRadius:50, marginBottom:18, border:'1px solid rgba(245,126,87,0.4)', backdropFilter:'blur(4px)' }}>
                      {s.tag}
                    </span>
                    <h1 style={{ fontFamily:"'Jost',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:28 }}>
                      {s.heading}
                    </h1>
                    <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
                      <Link to="/appointment" style={{ display:'inline-flex', alignItems:'center', gap:8, background:P, color:'#fff', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:'0.9rem', textDecoration:'none', boxShadow:`0 6px 20px rgba(6,163,218,0.4)`, transition:'all .25s' }}
                        onMouseEnter={e=>e.currentTarget.style.background=S}
                        onMouseLeave={e=>e.currentTarget.style.background=P}>
                        <i className="fa fa-calendar-check" />Appointment
                      </Link>
                      <Link to="/contactus" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', color:'#fff', padding:'13px 28px', borderRadius:50, fontWeight:700, fontSize:'0.9rem', textDecoration:'none', border:'1.5px solid rgba(255,255,255,0.35)', backdropFilter:'blur(4px)', transition:'all .25s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.22)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}>
                        <i className="fa fa-phone" />Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
        </button>
      </div>

      {/* ══ Stats bar ══ */}
      <div style={{ background:'#fff', padding:'28px 0', borderBottom:'1px solid rgba(6,163,218,0.1)', boxShadow:'0 4px 20px rgba(9,30,62,0.06)' }}>
        <div className="container">
          <div className="row g-3 justify-content-center">
            {[['5000+','Happy Patients'],['20+','Specialists'],['15+','Years Experience'],['24/7','Support Available']].map(([n,l]) => (
              <div key={l} className="col-6 col-md-3 text-center">
                <p style={{ fontFamily:"'Jost',sans-serif", fontWeight:900, fontSize:'2rem', color:P, margin:'0 0 2px', lineHeight:1 }}>{n}</p>
                <p style={{ fontSize:'0.78rem', color:'#6b7a93', margin:0, fontWeight:500 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Banner cards ══ */}
      <div style={{ background:'#EEF9FF', padding:'40px 0 0' }}>
        <div className="container">
          <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{ delay:3800, disableOnInteraction:false }}
            pagination={{ clickable:true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640:{ slidesPerView:2 }, 992:{ slidesPerView:3 } }}
            loop
            className="pb-5"
          >
            {bannerCards.map((card, i) => (
              <SwiperSlide key={i}>
                <div className="banner-card" style={{ background:card.bg }}>
                  {/* Icon */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:52, height:52, background:'rgba(255,255,255,0.15)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, backdropFilter:'blur(4px)' }}>
                      <i className={`fa ${card.icon}`} style={{ color:'#fff', fontSize:'1.3rem' }} />
                    </div>
                    <h4 style={{ fontFamily:"'Jost',sans-serif", fontWeight:800, color:'#fff', margin:0, fontSize:'1.1rem' }}>{card.title}</h4>
                  </div>
                  {card.content}
                  <Link to={card.cta.to} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', background:'rgba(255,255,255,0.18)', color:'#fff', borderRadius:50, fontWeight:700, fontSize:'0.82rem', textDecoration:'none', border:'1px solid rgba(255,255,255,0.3)', backdropFilter:'blur(4px)', transition:'all .25s', alignSelf:'flex-start' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.30)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}>
                    {card.cta.label} <i className="fa fa-arrow-right" style={{fontSize:'0.72rem'}} />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ══ Page sections ══ */}
      <About />
      <Services title="Doctor Specialization" data={SpecializationStateData.filter(x=>x.active)} />
      <Features />
      <Services title="Medicine Category"  data={MedicineCategoryStateData.filter(x=>x.active)} />
      <Offers />
      <PriceSection />
      <Testimonials />
      <Services title="Labtest Category" data={LabtestCategoryStateData.filter(x=>x.active)} />
      <Doctors title="Meet Our Trusted Doctors" data={DoctorStateData.filter(x=>x.active).slice(0,6)} />
    </>
  )
}