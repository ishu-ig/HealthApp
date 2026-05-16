import React, { useEffect } from 'react';
import HeroSection from '../Components/HeroSection';
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators';
import { getMedicine } from '../Redux/ActionCreators/MedicineActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import Medicine from '../Components/Medicine';
import { Link } from 'react-router-dom';
import SecondaryNavbar from '../Components/SecondaryNavbar';

export default function MedicinePage() {
    const MedicineCategoryStateData = useSelector(state => state.MedicineCategoryStateData);
    const MedicineStateData = useSelector(state => state.MedicineStateData);
    const dispatch = useDispatch();

    useEffect(() => { dispatch(getMedicineCategory()); }, []);
    useEffect(() => { dispatch(getMedicine()); }, [MedicineStateData?.length]);

    return (
        <>
            <SecondaryNavbar title="medicine" />
            <HeroSection title="Medicines" />

            {/* Category Section */}
            <div className="medicine-category-section py-5">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <span className="section-badge badge-green">Our Medicine Store</span>
                        <h1 className="section-title">Explore Medicines by Category</h1>
                        <p className="section-subtitle">
                            Find the best medicine categories for your health needs. We provide a wide range of quality-tested medicines.
                        </p>
                    </div>

                    <div className="row g-4">
                        {MedicineCategoryStateData?.map((item, index) => (
                            <div className="col-12 col-sm-6 col-lg-4" key={index}>
                                <Link to={`/medicine/shop?mc=${item.name}`} className="text-decoration-none">
                                    <div className="medicine-category-card">
                                        <div className="medicine-cat-img-wrap">
                                            <img
                                                src={`${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`}
                                                alt={item.name}
                                                className="medicine-cat-img"
                                            />
                                            <div className="medicine-cat-overlay">
                                                <span className="medicine-cat-cta">
                                                    Shop Now <i className="bi bi-arrow-right"></i>
                                                </span>
                                            </div>
                                            <div className="medicine-cat-gradient" />
                                        </div>
                                        <div className="medicine-cat-footer">
                                            <h5 className="medicine-cat-name">{item.name}</h5>
                                            <span className="medicine-cat-explore">
                                                Browse <i className="bi bi-chevron-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Medicine title="Popular Medicines" data={MedicineStateData.filter(x => x.active).slice(0, 6)} />
        </>
    );
}