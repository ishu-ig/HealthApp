import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const testimonials = [
    {
        id: 1,
        name: "Emily Johnson",
        img: "img/testimonial-1.jpg",
        review: "Amazing service! The doctors were professional, and the environment was comfortable. Highly recommend!"
    },
    {
        id: 2,
        name: "Michael Brown",
        img: "img/testimonial-2.jpg",
        review: "Exceptional care and friendly staff. The treatment was smooth and effective. Thank you!"
    },
    {
        id: 3,
        name: "Sarah Wilson",
        img: "img/testimonial-1.jpg",
        review: "One of the best experiences! The team was knowledgeable and very accommodating. Will visit again!"
    }
];

export default function Testimonials() {
    return (
        <div className="container-fluid bg-testimonial py-5 my-5">
            <div className="container py-5">
                {/* Section Heading */}
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h5 className="text-uppercase text-primary fw-bold mb-3">
                            Testimonials
                        </h5>
                        <h1 className="display-5 fw-semibold text-dark mb-3">
                            What Our Clients Say
                        </h1>
                        <p className="text-muted fs-5">
                            Our patients’ experiences speak for themselves. Here's what they have to say about our services.
                        </p>
                    </div>
                </div>

                {/* Testimonial Slider */}
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <Swiper
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop={true}
                            grabCursor={true}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper"
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial._id}>
                                    <div className="testimonial-item text-center shadow-lg rounded p-5">
                                        <img
                                            className="testimonial-img img-fluid rounded-circle mb-4"
                                            src={testimonial.img}
                                            alt={testimonial.name}
                                        />
                                        <p className="fs-5 fst-italic text-muted">
                                            "{testimonial.review}"
                                        </p>
                                        <hr className="mx-auto w-25 my-3" />
                                        <h4 className="fw-bold text-primary">{testimonial.name}</h4>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

            {/* CSS Styling */}
            <style>{`
                .testimonial-item {
                    background: #ffffff;
                    border: 1px solid #eee;
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .testimonial-item:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
                }

                .testimonial-img {
                    width: 90px;
                    height: 90px;
                    object-fit: cover;
                    border: 4px solid #0d6efd;
                    transition: transform 0.4s ease;
                }

                .testimonial-item:hover .testimonial-img {
                    transform: scale(1.1) rotate(3deg);
                }

                .swiper-pagination-bullet {
                    background: #0d6efd !important;
                    opacity: 0.6;
                    width: 10px;
                    height: 10px;
                }

                .swiper-pagination-bullet-active {
                    background: #0b5ed7 !important;
                    opacity: 1;
                    transform: scale(1.3);
                }
            `}</style>
        </div>
    );
}
