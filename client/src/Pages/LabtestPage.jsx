import React, { useEffect } from 'react'
import { getLabtestCategory } from '../Redux/ActionCreators/LabtestCategoryActionCreators';
import { getLabtest } from '../Redux/ActionCreators/LabtestActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import Labtest from '../Components/Labtest';
import Testimonials from '../Components/Testimonials';
import HeroSection from '../Components/HeroSection';
import SecondaryNavbar from '../Components/SecondaryNavbar';
import { Link } from 'react-router-dom';

export default function LabtestPage() {
    const LabtestCategoryStateData = useSelector(state => state.LabtestCategoryStateData);
    const LabtestStateData = useSelector(state => state.LabtestStateData);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLabtestCategory());
    }, []);

    useEffect(() => {
        dispatch(getLabtest());
    }, [LabtestStateData.length]);
    console.log("Labtest", LabtestStateData)

    return (
        <>
            <SecondaryNavbar title="labtest" />

            {/* Hero Section */}
            <HeroSection title="Labtests" />

            {/* Labtest Store Section */}
            <div className="container-fluid py-5 wow fadeInUp bg-light" data-wow-delay="0.1s">
                <div className="container">
                    <div className="section-title mb-5 text-center">
                        <h5 className="position-relative d-inline-block text-primary text-uppercase">Our Labtest Store</h5>
                        <h1 className="display-6 fw-bold mb-4">Explore Labtests by Category</h1>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Find the best Labtest categories for your health needs. We provide a wide range of quality-tested Labtests.
                        </p>
                    </div>
                    <div className="row g-4">
                        {
                            LabtestCategoryStateData?.map((item, index) => (
                                <div className="col-12 col-sm-6 col-lg-4" key={index}>
                                    <Link to={`/labtest/shop?lc=${item.name}`}>
                                        <div
                                            className="service-item shadow rounded bg-white overflow-hidden h-100"
                                            style={{ cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
                                            }}
                                        >
                                            <div className="overflow-hidden">
                                                <img
                                                    className="img-fluid w-100"
                                                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                    alt={item.name}
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "cover",
                                                        transition: 'transform 0.5s ease'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                                                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                            <div className="text-center p-4">
                                                <h5 className="text-primary fw-bold m-0">{item.name}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <Labtest title="Available Lab Tests" data={LabtestStateData.filter(x => x.active).slice(0, 6)} />
            {/* <Testimonials /> */}
        </>
    );
}