import React, { useEffect } from 'react'
import About from '../Components/About'
import Appointment from '../Components/Appointment'
import Services from '../Components/Services'
import Offers from '../Components/Offers'
import PriceSection from '../Components/PriceSection'
import Testimonials from '../Components/Testimonials'
import Doctors from '../Components/Doctors'
import Features from '../Components/Features'

import { getDoctor } from "../Redux/ActionCreators/DoctorActionCreators"
import { useDispatch, useSelector } from 'react-redux'
import { getSpecialization } from '../Redux/ActionCreators/SpecializationActionCreators'
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators'
import { getLabtestCategory } from '../Redux/ActionCreators/LabtestCategoryActionCreators'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';

export default function HomePage() {
    const DoctorStateData = useSelector(state => state.DoctorStateData)
    const SpecializationStateData = useSelector(state => state.SpecializationStateData)
    const MedicineCategoryStateData = useSelector(state => state.MedicineCategoryStateData)
    const LabtestCategoryStateData = useSelector(state => state.LabtestCategoryStateData)


    let dispatch = useDispatch()
    useEffect(() => {
        (() => {
            dispatch(getDoctor())
        })()
    }, [DoctorStateData.length])


    useEffect(() => {
        (() => {
            dispatch(getSpecialization())
        })()
    }, [SpecializationStateData.length])

    useEffect(() => {
        (() => {
            dispatch(getMedicineCategory());
        })()
    }, [MedicineCategoryStateData.length])
    useEffect(() => {
        (() => {
            dispatch(getLabtestCategory());
        })()
    }, [MedicineCategoryStateData.length])
    return (
        <>
            {/* <!-- Carousel Start --> */}
            <div className="container-fluid p-0">
                <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="w-100" src="img/carousel-1.jpg" alt="Image" height={650} />
                            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                <div className="p-3" style={{ maxWidth: 850 }}>
                                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">Keep Your Teeth Healthy</h5>
                                    <h1 className="display-1 text-white mb-md-4 animated zoomIn">Take The Best Quality Dental Treatment</h1>
                                    <a href="appointment.html" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Appointment</a>
                                    <a href="" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Contact Us</a>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="w-100" src="img/carousel-2.jpg" alt="Image" height={650} />
                            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                <div className="p-3" style={{ maxWidth: 850 }}>
                                    <h5 className="text-white text-uppercase mb-3 animated slideInDown">Keep Your Teeth Healthy</h5>
                                    <h1 className="display-1 text-white mb-md-4 animated zoomIn">Take The Best Quality Dental Treatment</h1>
                                    <a href="appointment.html" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Appointment</a>
                                    <a href="" className="btn btn-secondary py-md-3 px-md-5 animated slideInRight">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
                        data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
                        data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            {/* <!-- Carousel End --> */}


            {/* <!-- Banner Start --> */}
            <div className="container-fluid banner mb-5">
                <div className="container">
                    <Swiper
                        autoplay={{
                            delay: 3000, // ⏱ timespan in ms (3 sec)
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            576: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                        }}
                        spaceBetween={30}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        <SwiperSlide>
                            <div className="bg-primary d-flex flex-column p-5 me-3 mt-md-3 pt-3" style={{ height: 340 }}>
                                <p><i className='fas fa-clock text-light' style={{ fontSize: "50px" }}></i></p>
                                <h3 className="text-white mb-3">Opening Hours</h3>
                                <div className="d-flex justify-content-between text-white mb-3">
                                    <h6 className="text-white mb-0">Mon - Fri</h6>
                                    <p className="mb-0"> 8:00am - 9:00pm</p>
                                </div>
                                <div className="d-flex justify-content-between text-white mb-3">
                                    <h6 className="text-white mb-0">Saturday</h6>
                                    <p className="mb-0"> 8:00am - 7:00pm</p>
                                </div>
                                <div className="d-flex justify-content-between text-white mb-3">
                                    <h6 className="text-white mb-0">Sunday</h6>
                                    <p className="mb-0"> 8:00am - 5:00pm</p>
                                </div>
                                <a className="btn btn-light" href="">Appointment</a>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide><div className="bg-dark d-flex flex-column p-5 me-3 mt-md-3 pt-4" style={{ height: 340 }}>
                            <p><i className='fas fa-user-md text-light' style={{ fontSize: "50px" }}></i></p>
                            <h3 className="text-white mb-3">Search A Doctor</h3>
                            <div className="date mb-3" id="date" data-target-input="nearest">
                                <input type="text" className="form-control bg-light border-0 datetimepicker-input"
                                    placeholder="Appointment Date" data-target="#date" data-toggle="datetimepicker" style={{ height: 40 }} />
                            </div>
                            <select className="form-select bg-light border-0 mb-3" style={{ height: 40 }}>
                                <option selected>Select A Service</option>
                                <option value="1">Service 1</option>
                                <option value="2">Service 2</option>
                                <option value="3">Service 3</option>
                            </select>
                            <a className="btn btn-light" href="">Search Doctor</a>
                        </div></SwiperSlide>
                        <SwiperSlide>
                            <div className="bg-secondary d-flex flex-column p-5 me-3 mt-md-3 pt-4" style={{ height: 340 }}>
                                <p className="mb-3">
                                    <i className="fas fa-headset text-light" style={{ fontSize: "50px" }}></i>
                                </p>
                                <h3 className="text-white mb-3">Make Appointment</h3>
                                <p className="text-white">Ipsum erat ipsum dolor clita rebum no rebum dolores labore, ipsum magna at eos et eos amet.</p>
                                <h2 className="text-white mb-0">+012 345 6789</h2>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            {/* <!-- Banner Start --> */}

            <About />
            <Services title="Doctor Specialization" data={SpecializationStateData.filter(x => x.active)} />
            <Features />
            {/* <Appointment /> */}
            <Services title="Medicine Category" data={MedicineCategoryStateData.filter(x => x.active)} />
            <Offers />
            <PriceSection />
            <Testimonials />
            <Services title="Labtest Category" data={LabtestCategoryStateData.filter(x => x.active)} />
            <Doctors title="Meet Our Trusted Doctors" data={DoctorStateData.filter(x => x.active).slice(0, 6)} />
        </>
    )
}
