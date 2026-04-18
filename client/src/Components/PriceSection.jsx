import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';

export default function PriceSection() {
  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(window.innerWidth < 1000 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Pricing Start */}
      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row g-5">
            {/* Left Text Section */}
            <div className="col-lg-5">
              <div className="section-title mb-4">
                <h5 className="text-primary text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px" }}>
                  Pricing Plan
                </h5>
                <h1 className="display-5 fw-semibold mb-3">
                  We Offer Fair Prices for Dental Treatment
                </h1>
                <span
                  className="d-block"
                  style={{
                    width: "70px",
                    height: "4px",
                    backgroundColor: "#0d6efd",
                    borderRadius: "2px",
                  }}
                ></span>
              </div>
              <p className="mb-4 text-muted">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.
                Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo magna dolore erat amet.
              </p>
              <h5 className="text-uppercase text-primary mb-2">Call for Appointment</h5>
              <h1 className="fw-bold">+012 345 6789</h1>
            </div>

            {/* Right Swiper Section */}
            <div className="col-lg-7">
              <div className="price-carousel wow zoomIn" data-wow-delay="0.6s">
                <Swiper
                  slidesPerView={slidesPerView}
                  spaceBetween={30}
                  loop={true}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay]}
                  className="mySwiper pb-5"
                >
                  {/* Slide 1 */}
                  <SwiperSlide>
                    <div className="price-item shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-effect">
                      <div className="position-relative">
                        <img
                          className="img-fluid w-100"
                          src="img/price-1.jpg"
                          alt="Teeth Whitening"
                          style={{ height: "260px", objectFit: "cover" }}
                        />
                        <div className="price-badge">
                          <h2 className="text-primary m-0 fw-bold">$35</h2>
                        </div>
                      </div>
                      <div className="text-center py-5 px-4 bg-light">
                        <h4 className="fw-bold">Teeth Whitening</h4>
                        <hr className="text-primary w-50 mx-auto" />
                        <Feature label="Modern Equipment" />
                        <Feature label="Professional Dentist" />
                        <Feature label="24/7 Call Support" />
                        <a href="appointment.html" className="btn btn-primary rounded-pill py-2 px-4 mt-3">
                          Appointment
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 2 */}
                  <SwiperSlide>
                    <div className="price-item shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-effect">
                      <div className="position-relative">
                        <img
                          className="img-fluid w-100"
                          src="img/price-2.jpg"
                          alt="Dental Implant"
                          style={{ height: "260px", objectFit: "cover" }}
                        />
                        <div className="price-badge">
                          <h2 className="text-primary m-0 fw-bold">$49</h2>
                        </div>
                      </div>
                      <div className="text-center py-5 px-4 bg-light">
                        <h4 className="fw-bold">Dental Implant</h4>
                        <hr className="text-primary w-50 mx-auto" />
                        <Feature label="Modern Equipment" />
                        <Feature label="Professional Dentist" />
                        <Feature label="24/7 Call Support" />
                        <a href="appointment.html" className="btn btn-primary rounded-pill py-2 px-4 mt-3">
                          Appointment
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 3 */}
                  <SwiperSlide>
                    <div className="price-item shadow-sm rounded-4 overflow-hidden h-100 bg-white hover-effect">
                      <div className="position-relative">
                        <img
                          className="img-fluid w-100"
                          src="img/price-3.jpg"
                          alt="Root Canal"
                          style={{ height: "260px", objectFit: "cover" }}
                        />
                        <div className="price-badge">
                          <h2 className="text-primary m-0 fw-bold">$99</h2>
                        </div>
                      </div>
                      <div className="text-center py-5 px-4 bg-light">
                        <h4 className="fw-bold">Root Canal</h4>
                        <hr className="text-primary w-50 mx-auto" />
                        <Feature label="Modern Equipment" />
                        <Feature label="Professional Dentist" />
                        <Feature label="24/7 Call Support" />
                        <a href="appointment.html" className="btn btn-primary rounded-pill py-2 px-4 mt-3">
                          Appointment
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Feature({ label }) {
  return (
    <div className="d-flex justify-content-between mb-2">
      <span>{label}</span>
      <i className="fa fa-check text-primary pt-1"></i>
    </div>
  );
}
