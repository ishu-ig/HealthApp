import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SWIPER_TITLE = 'Meet Our Trusted Doctors';

/* ── Single card (shared) ─────────────────────────────────────────────────── */
function DoctorCard({ item }) {
  return (
    <div className="dc-card">
      <div className="dc-img-wrap">
        <img
          src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
          alt={item.name}
          className="dc-img"
        />
        <div className="dc-spec-pill">
          {item.specialization?.name || 'General'}
        </div>
      </div>
      <div className="dc-body">
        <h5 className="dc-name">{item.name}</h5>
        <div className="dc-stats">
          <div className="dc-stat">
            <span className="dc-stat-val">{item.experience}+</span>
            <span className="dc-stat-lbl">Yrs Exp</span>
          </div>
          <div className="dc-stat-div" />
          <div className="dc-stat">
            <span className="dc-stat-val">₹{item.fees}</span>
            <span className="dc-stat-lbl">Fees</span>
          </div>
        </div>
        <Link to={`/doctors/${item._id}`} className="dc-btn">
          Book Appointment
          <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function Doctor({ data, title }) {
  const isSwiper = title === SWIPER_TITLE;

  return (
    <>
      <style>{CSS}</style>

      {/* ── Section header (both modes) ── */}
      {title && (
        isSwiper ? (
          /* Swiper mode: editorial dark header */
          <div className="dc-swiper-hero">
            <div className="dc-swiper-hero-inner">
              <span className="dc-eyebrow">Our Specialists</span>
              <h2 className="dc-swiper-title">{title}</h2>
              <p className="dc-swiper-sub">
                Highly qualified, compassionate professionals dedicated to your health and well-being.
              </p>
            </div>
          </div>
        ) : (
          /* Grid mode: original hero */
          <div className="page-hero doctor-hero">
            <div className="page-hero-overlay" />
            <div className="page-hero-content">
              <span className="hero-eyebrow">Our Specialists</span>
              <h1 className="hero-heading">{title}</h1>
              <p className="hero-sub">
                Highly qualified, compassionate professionals dedicated to your health and well-being.
              </p>
            </div>
          </div>
        )
      )}

      {/* ── Swiper mode ── */}
      {isSwiper ? (
        <div className="dc-swiper-section">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              nextEl: '.dc-nav-next',
              prevEl: '.dc-nav-prev',
            }}
            pagination={{ clickable: true, el: '.dc-pagination' }}
            loop={data.length > 3}
            breakpoints={{
              560:  { slidesPerView: 2 },
              900:  { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="dc-swiper"
          >
            {data.map(item => (
              <SwiperSlide key={item._id}>
                <DoctorCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom nav */}
          <div className="dc-nav-row">
            <button className="dc-nav-btn dc-nav-prev" aria-label="Previous">
              <i className="bi bi-arrow-left" />
            </button>
            <div className="dc-pagination" />
            <button className="dc-nav-btn dc-nav-next" aria-label="Next">
              <i className="bi bi-arrow-right" />
            </button>
          </div>

          <div className="text-center mt-4">
            <Link to="/doctors" className="btn-view-more">
              View All Doctors <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      ) : (
        /* ── Grid mode (unchanged behaviour) ── */
        <div className="container-fluid py-5">
          <div className="container">
            <div className="row g-4">
              {data.map(item => (
                <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                  <DoctorCard item={item} />
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to="/doctors" className="btn-view-more">
                View More Doctors <i className="bi bi-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── CSS ──────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@400;500;600;700&display=swap');

  /* ── Swiper hero header ── */
  .dc-swiper-hero {
    // background: #0c1a2e;
    padding: 64px 32px 52px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .dc-swiper-hero::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(6,163,218,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .dc-swiper-hero-inner { position: relative; z-index: 1; }

  .dc-eyebrow {
    display: inline-block;
    font-family: 'Outfit', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #06A3DA;
    margin-bottom: 14px;
    padding: 5px 16px;
    border: 1px solid rgba(6,163,218,0.3);
    border-radius: 999px;
    background: rgba(6,163,218,0.08);
  }

  .dc-swiper-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    color: #f1f5f9;
    margin: 0 0 14px;
    line-height: 1.15;
  }

  .dc-swiper-sub {
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    color: #64748b;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ── Swiper section wrapper ── */
  .dc-swiper-section {
    // background: #0c1a2e;
    padding: 0 24px 56px;
  }

  .dc-swiper {
    padding-bottom: 8px !important;
  }

  /* ── Card ── */
  .dc-card {
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(6,163,218,0.12);
    box-shadow: 0 4px 24px rgba(9,30,62,0.10);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .dc-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(6,163,218,0.18);
  }

  /* Image */
  .dc-img-wrap {
    position: relative;
    overflow: hidden;
    height: 220px;
    flex-shrink: 0;
  }

  .dc-img {
    width: 100%;
    // height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .dc-card:hover .dc-img { transform: scale(1.06); }

  .dc-spec-pill {
    position: absolute;
    bottom: 12px; left: 12px;
    background: rgba(9,30,62,0.82);
    backdrop-filter: blur(6px);
    color: #06A3DA;
    font-family: 'Outfit', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid rgba(6,163,218,0.3);
  }

  /* Body */
  .dc-body {
    padding: 18px 18px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 12px;
  }

  .dc-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    color: #091E3E;
    margin: 0;
    line-height: 1.25;
  }

  /* Stats row */
  .dc-stats {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: rgba(6,163,218,0.06);
    border-radius: 10px;
    border: 1px solid rgba(6,163,218,0.12);
  }

  .dc-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 1px;
  }

  .dc-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    color: #091E3E;
    line-height: 1;
  }

  .dc-stat-lbl {
    font-family: 'Outfit', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .dc-stat-div {
    width: 1px;
    height: 28px;
    background: rgba(6,163,218,0.2);
    flex-shrink: 0;
  }

  /* Book button */
  .dc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #06A3DA, #0080b0);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    border-radius: 999px;
    text-decoration: none;
    transition: all 0.25s;
    box-shadow: 0 4px 14px rgba(6,163,218,0.3);
    margin-top: auto;
  }

  .dc-btn:hover {
    background: linear-gradient(135deg, #F57E57, #d05c35);
    box-shadow: 0 6px 20px rgba(245,126,87,0.35);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ── Custom navigation ── */
  .dc-nav-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }

  .dc-nav-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 1.5px solid rgba(6,163,218,0.35);
    background: rgba(6,163,218,0.08);
    color: #06A3DA;
    font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .dc-nav-btn:hover {
    background: #06A3DA;
    color: #fff;
    border-color: #06A3DA;
  }

  .dc-nav-btn.swiper-button-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Swiper pagination dots */
  .dc-pagination {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dc-pagination .swiper-pagination-bullet {
    width: 7px; height: 7px;
    background: rgba(6,163,218,0.3);
    border-radius: 999px;
    transition: all 0.3s;
    opacity: 1;
  }

  .dc-pagination .swiper-pagination-bullet-active {
    background: #06A3DA;
    width: 22px;
  }

  /* ── btn-view-more (reuse existing or define here) ── */
  .btn-view-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    border: 1.5px solid rgba(6,163,218,0.4);
    border-radius: 999px;
    color: #06A3DA;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.22s;
    background: rgba(6,163,218,0.07);
  }

  .btn-view-more:hover {
    background: #06A3DA;
    color: #fff;
    border-color: #06A3DA;
  }

  /* Override swiper default nav arrows (hide them, we use custom) */
  .dc-swiper .swiper-button-next,
  .dc-swiper .swiper-button-prev { display: none; }
  .dc-swiper .swiper-pagination   { display: none; }
`;