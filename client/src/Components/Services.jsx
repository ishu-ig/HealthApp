import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

const PRIMARY   = '#06A3DA';
const SECONDARY = '#F57E57';
const DARK      = '#091E3E';

function getTo(title, item) {
    if (title === 'Medicine Category')     return `/medicine/shop?mc=${item._id}`;
    if (title === 'Labtest Category')      return `labtest/shop?lc=${item.name}`;
    if (title === 'Doctor Specialization') return `doctors?sp=${item.name}`;
    return `/shop?br=${item.name}`;
}

function getSectionMeta(title) {
    if (title?.includes('Medicine'))      return { icon: 'fa-pills',    eyebrow: 'Pharmacy',    accent: '#06A3DA' };
    if (title?.includes('Labtest'))       return { icon: 'fa-flask',    eyebrow: 'Diagnostics', accent: '#1D9E75' };
    if (title?.includes('Doctor'))        return { icon: 'fa-user-md',  eyebrow: 'Specialists', accent: '#7c3aed' };
    if (title?.includes('Nurse'))         return { icon: 'fa-user-nurse',eyebrow: 'Care',        accent: '#db2777' };
    return { icon: 'fa-th-large', eyebrow: 'Our Services', accent: PRIMARY };
}

export default function Services({ data, title }) {
    const meta = getSectionMeta(title);

    const displayTitle = title
        ?.replace(' Category', '')
        ?.replace(' Specialization', '');

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

                /* ── Section ── */
                .svc-section {
                    padding: 88px 0 100px;
                    background: #f0f8ff;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Sora', sans-serif;
                }

                /* Decorative mesh */
                .svc-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        radial-gradient(circle at 12% 20%, rgba(6,163,218,0.07) 0%, transparent 50%),
                        radial-gradient(circle at 88% 80%, rgba(245,126,87,0.06) 0%, transparent 50%);
                    pointer-events: none;
                }

                /* ── Header ── */
                .svc-header { text-align: center; margin-bottom: 52px; position: relative; }

                .svc-eyebrow {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(6,163,218,0.09);
                    color: ${PRIMARY};
                    font-size: 0.7rem; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    padding: 6px 18px; border-radius: 50px;
                    margin-bottom: 18px;
                    border: 1px solid rgba(6,163,218,0.22);
                }

                .svc-heading {
                    font-size: clamp(1.9rem, 3.5vw, 2.6rem);
                    font-weight: 800;
                    color: ${DARK};
                    line-height: 1.15;
                    margin-bottom: 0;
                    letter-spacing: -0.02em;
                }
                .svc-heading em {
                    font-style: normal;
                    color: ${PRIMARY};
                    position: relative;
                }
                .svc-heading em::after {
                    content: '';
                    position: absolute;
                    left: 0; bottom: -4px;
                    width: 100%; height: 3px;
                    background: linear-gradient(90deg, ${PRIMARY}, ${SECONDARY});
                    border-radius: 2px;
                }

                .svc-divider-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 20px;
                }
                .svc-divider-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: ${PRIMARY}; opacity: 0.4;
                }
                .svc-divider-bar {
                    width: 52px; height: 3px;
                    background: linear-gradient(90deg, ${PRIMARY}, ${SECONDARY});
                    border-radius: 3px;
                }

                /* ── Swiper container ── */
                .svc-swiper-outer {
                    position: relative;
                    /* side padding so arrows don't overlap cards */
                    padding: 0 48px;
                }
                @media (max-width: 576px) { .svc-swiper-outer { padding: 0 10px; } }

                .svc-swiper-outer .mySwiper { padding-bottom: 54px !important; }

                /* ── CARD — fixed size ── */
                .svc-card {
                    /* Fixed dimensions — never flex, never shrink */
                    display: block;
                    width: 100%;          /* fills SwiperSlide, slide width is set by breakpoints */
                    height: 300px;        /* ← FIXED TOTAL HEIGHT */
                    border-radius: 20px;
                    overflow: hidden;
                    background: #fff;
                    text-decoration: none;
                    position: relative;
                    box-shadow:
                        0 1px 3px rgba(9,30,62,0.05),
                        0 6px 24px rgba(9,30,62,0.09);
                    transition:
                        transform 0.32s cubic-bezier(.4,0,.2,1),
                        box-shadow 0.32s cubic-bezier(.4,0,.2,1);
                    flex-shrink: 0;
                }
                .svc-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow:
                        0 2px 6px rgba(9,30,62,0.06),
                        0 20px 52px rgba(9,30,62,0.16);
                }

                /* ── Image area — fixed height ── */
                .svc-img-wrap {
                    position: relative;
                    width: 100%;
                    height: 210px;        /* ← FIXED IMAGE HEIGHT */
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .svc-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                    transition: transform 0.48s cubic-bezier(.4,0,.2,1);
                }
                .svc-card:hover .svc-img-wrap img { transform: scale(1.1); }

                /* gradient overlay */
                .svc-img-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(9,30,62,0.0) 20%,
                        rgba(9,30,62,0.5) 100%
                    );
                    transition: background 0.32s;
                }
                .svc-card:hover .svc-img-overlay {
                    background: linear-gradient(
                        180deg,
                        rgba(6,163,218,0.12) 0%,
                        rgba(9,30,62,0.65) 100%
                    );
                }

                /* floating category tag top-left */
                .svc-tag {
                    position: absolute;
                    top: 12px; left: 12px;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(8px);
                    color: ${DARK};
                    font-size: 0.62rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.6);
                    box-shadow: 0 2px 10px rgba(9,30,62,0.12);
                    z-index: 2;
                }

                /* circular arrow — slides up on hover */
                .svc-arrow {
                    position: absolute;
                    bottom: 14px; right: 14px;
                    width: 36px; height: 36px;
                    background: ${SECONDARY};
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 0.8rem;
                    transform: translateY(14px);
                    opacity: 0;
                    transition: transform 0.28s cubic-bezier(.4,0,.2,1),
                                opacity  0.28s;
                    z-index: 2;
                    box-shadow: 0 4px 14px rgba(245,126,87,0.45);
                }
                .svc-card:hover .svc-arrow {
                    transform: translateY(0);
                    opacity: 1;
                }

                /* ── Card body — fixed height (remaining 90px) ── */
                .svc-body {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 90px;         /* ← 300 - 210 = 90 */
                    padding: 0 18px;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    border-top: 1px solid rgba(9,30,62,0.06);
                    transition: background 0.22s;
                }
                .svc-card:hover .svc-body { background: #fafcfe; }

                .svc-name {
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: ${DARK};
                    text-transform: capitalize;
                    margin: 0;
                    line-height: 1.35;
                    /* clamp to 2 lines max */
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.2s;
                    flex: 1;
                    min-width: 0;
                }
                .svc-card:hover .svc-name { color: ${PRIMARY}; }

                .svc-pill {
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.66rem;
                    font-weight: 800;
                    color: ${PRIMARY};
                    background: rgba(6,163,218,0.09);
                    border: 1px solid rgba(6,163,218,0.22);
                    border-radius: 50px;
                    padding: 5px 12px;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
                    white-space: nowrap;
                }
                .svc-card:hover .svc-pill {
                    background: ${PRIMARY};
                    color: #fff;
                    border-color: ${PRIMARY};
                    transform: translateX(3px);
                }

                /* ── Swiper nav buttons ── */
                .swiper-button-prev.svc-prev,
                .swiper-button-next.svc-next {
                    width: 40px; height: 40px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 4px 18px rgba(9,30,62,0.14);
                    top: calc(50% - 27px);   /* center on image area */
                    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                    border: 1px solid rgba(9,30,62,0.07);
                }
                .swiper-button-prev.svc-prev { left: 0; }
                .swiper-button-next.svc-next { right: 0; }

                .swiper-button-prev.svc-prev::after,
                .swiper-button-next.svc-next::after {
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: ${DARK};
                    transition: color 0.2s;
                }
                .swiper-button-prev.svc-prev:hover,
                .swiper-button-next.svc-next:hover {
                    background: ${PRIMARY};
                    transform: scale(1.1);
                    box-shadow: 0 6px 22px rgba(6,163,218,0.3);
                    border-color: ${PRIMARY};
                }
                .swiper-button-prev.svc-prev:hover::after,
                .swiper-button-next.svc-next:hover::after { color: #fff; }

                /* ── Pagination ── */
                .svc-section .swiper-pagination-bullet {
                    background: rgba(9,30,62,0.18) !important;
                    opacity: 1;
                    width: 7px; height: 7px;
                    transition: all 0.3s !important;
                }
                .svc-section .swiper-pagination-bullet-active {
                    background: ${PRIMARY} !important;
                    width: 24px !important;
                    border-radius: 4px !important;
                }

                /* ── Count badge in header ── */
                .svc-count-badge {
                    display: inline-flex; align-items: center; justify-content: center;
                    background: ${PRIMARY};
                    color: #fff;
                    font-size: 0.68rem; font-weight: 800;
                    border-radius: 50px;
                    padding: 3px 10px;
                    margin-left: 10px;
                    vertical-align: middle;
                    letter-spacing: 0.04em;
                }
            `}</style>

            <div className="svc-section wow fadeInUp" data-wow-delay="0.1s">
                <div className="container">

                    {/* ── Section header ── */}
                    <div className="svc-header">
                        <div>
                            <span className="svc-eyebrow">
                                <i className={`fa ${meta.icon}`} />
                                {meta.eyebrow}
                            </span>
                        </div>
                        <h2 className="svc-heading">
                            Browse{' '}
                            <em>{displayTitle}</em>
                            {' '}Categories
                            {data?.length > 0 && (
                                <span className="svc-count-badge">{data.length}</span>
                            )}
                        </h2>
                        <div className="svc-divider-row">
                            <span className="svc-divider-dot" />
                            <span className="svc-divider-bar" />
                            <span className="svc-divider-dot" />
                        </div>
                    </div>

                    {/* ── Swiper ── */}
                    <div className="svc-swiper-outer">
                        <Swiper
                            modules={[Pagination, Autoplay, Navigation]}
                            pagination={{ clickable: true }}
                            navigation={{ nextEl: '.svc-next', prevEl: '.svc-prev' }}
                            autoplay={{ delay: 3400, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            slidesPerView={1}
                            spaceBetween={20}
                            loop
                            breakpoints={{
                                480:  { slidesPerView: 1, spaceBetween: 16 },
                                640:  { slidesPerView: 2, spaceBetween: 18 },
                                900:  { slidesPerView: 3, spaceBetween: 20 },
                                1200: { slidesPerView: 4, spaceBetween: 22 },
                            }}
                            className="mySwiper"
                        >
                            {data?.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <Link
                                        to={getTo(title, item)}
                                        className="svc-card"
                                        aria-label={`View ${item.name}`}
                                    >
                                        {/* Floating tag */}
                                        <div className="svc-tag">{displayTitle}</div>

                                        {/* Image */}
                                        <div className="svc-img-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                alt={item.name || 'Service'}
                                                loading="lazy"
                                            />
                                            <div className="svc-img-overlay" />
                                            <div className="svc-arrow">
                                                <i className="fa fa-arrow-right" />
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="svc-body">
                                            <h5 className="svc-name">{item.name}</h5>
                                            <span className="svc-pill">
                                                View
                                                <i className="fa fa-chevron-right" style={{ fontSize: '0.55rem' }} />
                                            </span>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom nav */}
                        <div className="swiper-button-prev svc-prev" />
                        <div className="swiper-button-next svc-next" />
                    </div>

                </div>
            </div>
        </>
    );
}