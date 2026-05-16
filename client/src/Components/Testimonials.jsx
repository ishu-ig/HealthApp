import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  { id:1, name:'Emily Johnson',  role:'Patient',     img:'img/testimonial-1.jpg', rating:5, review:'Amazing service! The doctors were professional, and the environment was comfortable. Highly recommend to anyone looking for quality dental care!' },
  { id:2, name:'Michael Brown',  role:'Patient',     img:'img/testimonial-2.jpg', rating:5, review:'Exceptional care and friendly staff. The treatment was smooth and effective. Thank you to the entire HealthCare team!' },
  { id:3, name:'Sarah Wilson',   role:'Patient',     img:'img/testimonial-1.jpg', rating:5, review:'One of the best experiences! The team was knowledgeable and very accommodating. Will definitely visit again.' },
  { id:4, name:'James Taylor',   role:'Patient',     img:'img/testimonial-2.jpg', rating:4, review:'Great facilities and modern equipment. I felt completely at ease throughout my treatment. Highly recommended!' },
]

export default function Testimonials() {
  return (
    <>
      <style>{`
        .testi-section {
          background: linear-gradient(135deg,rgba(9,30,62,0.90) 0%,rgba(6,163,218,0.80) 100%), url(/img/carousel-2.jpg) center/cover no-repeat;
          padding: 80px 0 100px;
          position: relative; overflow: hidden;
        }
        .testi-section::before {
          content:''; position:absolute;
          top:-80px; right:-80px;
          width:300px; height:300px;
          border-radius:50%;
          background:rgba(245,126,87,0.10);
          pointer-events:none;
        }
        .testi-card {
          background: rgba(255,255,255,0.96);
          border-radius: 20px;
          padding: 36px 32px;
          text-align: left;
          box-shadow: 0 12px 40px rgba(9,30,62,0.14);
          position: relative;
          transition: transform .35s;
          margin-bottom: 8px;
        }
        .testi-card:hover { transform: translateY(-6px); }
        .testi-card::before {
          content: '"';
          position: absolute;
          top: 16px; right: 24px;
          font-size: 5rem; line-height:1;
          color: rgba(6,163,218,0.15);
          font-family: Georgia, serif;
        }
        .testi-stars { color: #F57E57; font-size: 0.82rem; }
        .testi-section .swiper-pagination-bullet { background: rgba(255,255,255,0.4) !important; opacity:1; transition:all .3s; }
        .testi-section .swiper-pagination-bullet-active { background: #fff !important; width: 20px; border-radius: 4px; }
      `}</style>

      <div className="testi-section">
        <div className="container">

          {/* Header */}
          <div className="text-center mb-5">
            <span style={{
              display:'inline-block', background:'rgba(255,255,255,0.15)',
              color:'rgba(255,255,255,0.9)', fontSize:'0.72rem', fontWeight:800,
              letterSpacing:'0.10em', textTransform:'uppercase',
              padding:'5px 18px', borderRadius:50, marginBottom:14,
              border:'1px solid rgba(255,255,255,0.25)',
            }}>Testimonials</span>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#fff', marginBottom:12 }}>
              What Our Patients Say
            </h2>
            <div style={{ width:56, height:4, background:'linear-gradient(90deg,#fff,#F57E57)', borderRadius:4, margin:'0 auto' }} />
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable:true }}
            autoplay={{ delay:3500, disableOnInteraction:false }}
            loop
            grabCursor
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView:2 },
              1100:{ slidesPerView:3 },
            }}
            className="pb-5"
          >
            {testimonials.map(t => (
              <SwiperSlide key={t.id}>
                <div className="testi-card">
                  {/* Stars */}
                  <div className="testi-stars mb-3">
                    {Array(t.rating).fill(0).map((_,i) => <i key={i} className="fa fa-star me-1" />)}
                  </div>
                  {/* Review */}
                  <p style={{ color:'#5a6a85', lineHeight:1.8, fontSize:'0.9rem', marginBottom:24, fontStyle:'italic' }}>
                    "{t.review}"
                  </p>
                  {/* Author */}
                  <div style={{ display:'flex', alignItems:'center', gap:14, borderTop:'1px solid rgba(6,163,218,0.12)', paddingTop:18 }}>
                    <img
                      src={t.img} alt={t.name}
                      style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'3px solid #06A3DA', flexShrink:0 }}
                    />
                    <div>
                      <p style={{ margin:0, fontWeight:700, color:'#091E3E', fontSize:'0.9rem' }}>{t.name}</p>
                      <p style={{ margin:0, fontSize:'0.75rem', color:'#06A3DA', fontWeight:500 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
    </>
  )
}