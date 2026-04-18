import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

export default function Services({ data, title }) {
    return (
        <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                {/* Section Title */}
                <div className="section-title mb-5 text-center">
                    <h5 className="text-primary text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>
                        Our Services
                    </h5>
                    <h1 className="display-5 fw-semibold mb-3">
                        {title}
                    </h1>
                    <span
                        className="d-block mx-auto"
                        style={{
                            width: "70px",
                            height: "4px",
                            backgroundColor: "#0d6efd",
                            borderRadius: "2px",
                        }}
                    ></span>
                </div>

                {/* Swiper */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000, // ⏱ timespan in ms (3 sec)
                        disableOnInteraction: false,
                    }}
                    slidesPerView={1}
                    spaceBetween={24}
                    breakpoints={{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                    }}
                    loop={true}
                    className="mySwiper pb-5"
                >
                    {data?.map((item) => (
                        <SwiperSlide key={item._id} className="slider-card">
                            <div
                                className="service-item shadow-sm border rounded-4 overflow-hidden h-100"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <Link
                                    to={
                                        title === "Medicine Category" ? `/medicine/shop?mc=${item._id}` :
                                        title === "Labtest Category" ? `labtest/shop?lc=${item.name}` :
                                        title === "Doctor Specialization" ? `doctors?sp=${item.name}` :
                                        `/shop?br=${item.name}`
                                    }
                                    className="text-decoration-none"
                                    aria-label={`View ${item.name}`}
                                >
                                    {/* Image Section with Overlay */}
                                    <div className="position-relative overflow-hidden">
                                        <img
                                            className="img-fluid w-100"
                                            src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                            alt={item.name || "Service Image"}
                                            style={{
                                                height: "230px",
                                                objectFit: "cover",
                                                transition: 'transform 0.4s ease-in-out',
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                        <div
                                            className="position-absolute top-0 start-0 w-100 h-100"
                                            style={{
                                                background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-white text-center py-3 px-3">
                                        <h5 className="m-0 text-dark fw-semibold text-capitalize">
                                            {item.name}
                                        </h5>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Custom Swiper Pagination */}
            <style>
                {`
                .swiper-pagination-bullet {
                    background: #cfd8dc;
                    opacity: 1;
                    transition: all 0.3s;
                }
                .swiper-pagination-bullet-active {
                    background: #0d6efd;
                    width: 12px;
                    height: 12px;
                }
                .service-item:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 20px rgba(0,0,0,0.12);
                }
                `}
            </style>
        </div>
    );
}
