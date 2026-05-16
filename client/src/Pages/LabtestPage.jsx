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

    useEffect(() => { dispatch(getLabtestCategory()); }, []);
    useEffect(() => { dispatch(getLabtest()); }, [LabtestStateData.length]);

    return (
        <>
            <SecondaryNavbar title="labtest" />
            <HeroSection title="Labtests" />

            {/* Categories Section */}
            <div className="labtest-category-section py-5">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <span className="section-badge badge-blue">Our Labtest Store</span>
                        <h1 className="section-title">Explore Labtests by Category</h1>
                        <p className="section-subtitle">
                            Find the best lab test categories for your health needs across a wide range of quality-tested options.
                        </p>
                    </div>
                    <div className="row g-4">
                        {LabtestCategoryStateData?.map((item, index) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={index}>
                                <Link to={`/labtest/shop?lc=${item.name}`} className="text-decoration-none">
                                    <div className="labtest-category-card">
                                        <div className="labtest-cat-img-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                alt={item.name}
                                                className="labtest-cat-img"
                                            />
                                            <div className="labtest-cat-overlay">
                                                <i className="bi bi-arrow-right-circle-fill overlay-icon"></i>
                                            </div>
                                        </div>
                                        <div className="labtest-cat-footer">
                                            <h5 className="labtest-cat-name">{item.name}</h5>
                                            <span className="labtest-cat-explore">Explore <i className="bi bi-chevron-right"></i></span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Labtest title="Available Lab Tests" data={LabtestStateData.filter(x => x.active).slice(0, 6)} />
        </>
    );
}