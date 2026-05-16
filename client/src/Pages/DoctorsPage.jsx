import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecialization } from "../Redux/ActionCreators/SpecializationActionCreators";
import { getDoctor } from '../Redux/ActionCreators/DoctorActionCreators';
import Doctor from '../Components/Doctors';

export default function DoctorShopPage() {
    const [data, setData] = useState([]);
    const [sp, setSp] = useState("All");
    const [search, setSearch] = useState("");
    const [min, setMin] = useState(-1);
    const [max, setMax] = useState(-1);
    const SpecializationStateData = useSelector(state => state.SpecializationStateData);
    const DoctorStateData = useSelector(state => state.DoctorStateData);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        dispatch(getSpecialization());
        dispatch(getDoctor());
    }, [dispatch]);

    useEffect(() => {
        if (DoctorStateData.length) {
            const specializationFromURL = searchParams.get("sp") ?? "All";
            setSp(specializationFromURL);
            filter(specializationFromURL, min, max);
        }
    }, [DoctorStateData, searchParams]);

    function filter(sp = "All", min = -1, max = -1) {
        setSearch("");
        const filtered = DoctorStateData.filter((p) => {
            const spMatch = sp === "All" || p.specialization?.name === sp;
            const minMatch = min === -1 || p.fees >= Number(min);
            const maxMatch = max === -1 || p.fees <= Number(max);
            return spMatch && minMatch && maxMatch;
        });
        setData(filtered);
    }

    const applyPriceFilter = (e) => {
        e.preventDefault();
        filter(sp, min, max);
    };

    const postSearch = (e) => {
        e.preventDefault();
        const ch = search.toLowerCase();
        const filtered = DoctorStateData.filter(x =>
            x.active && (
                x.specialization?.name?.toLowerCase().includes(ch) ||
                x.description?.toLowerCase().includes(ch) ||
                x.name?.toLowerCase().includes(ch)
            )
        );
        setData(filtered);
    };

    const sortFilter = (option) => {
        const sorted = [...data];
        if (option === "1") sorted.sort((x, y) => y._id.toString().localeCompare(x._id.toString()));
        else if (option === "2") sorted.sort((x, y) => y.fees - x.fees);
        else sorted.sort((x, y) => x.fees - y.fees);
        setData(sorted);
    };

    return (
        <>
            <HeroSection title="Doctor Shop" />
            <div className="shop-page-layout container-fluid py-4">
                <div className="row g-4">
                    {/* Sidebar */}
                    <div className="col-md-3 col-lg-2">
                        <div className="shop-sidebar">
                            <div className="sidebar-section">
                                <h6 className="sidebar-section-title">
                                    <i className="bi bi-grid me-2"></i>Specialization
                                </h6>
                                <div className="sidebar-filter-list">
                                    <Link
                                        to="/doctors?sp=All"
                                        className={`sidebar-filter-item ${sp === "All" ? "active" : ""}`}
                                    >
                                        All Doctors
                                    </Link>
                                    {SpecializationStateData.filter(x => x.active).map(item => (
                                        <Link
                                            key={item._id}
                                            to={`/doctors?sp=${item.name}`}
                                            className={`sidebar-filter-item ${sp === item.name ? "active" : ""}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-section mt-4">
                                <h6 className="sidebar-section-title">
                                    <i className="bi bi-funnel me-2"></i>Filter by Fees
                                </h6>
                                <form onSubmit={applyPriceFilter} className="price-filter-form">
                                    <div className="price-inputs">
                                        <div className="price-input-group">
                                            <label>Min (₹)</label>
                                            <input
                                                type="number"
                                                value={min === -1 ? "" : min}
                                                onChange={(e) => setMin(e.target.value === "" ? -1 : Number(e.target.value))}
                                                className="form-control price-input"
                                                placeholder="0"
                                            />
                                        </div>
                                        <span className="price-sep">—</span>
                                        <div className="price-input-group">
                                            <label>Max (₹)</label>
                                            <input
                                                type="number"
                                                value={max === -1 ? "" : max}
                                                onChange={(e) => setMax(e.target.value === "" ? -1 : Number(e.target.value))}
                                                className="form-control price-input"
                                                placeholder="∞"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-apply-filter w-100 mt-3">
                                        Apply Filter
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9 col-lg-10">
                        <div className="shop-toolbar mb-4">
                            <form onSubmit={postSearch} className="search-form flex-grow-1">
                                <div className="search-input-group">
                                    <i className="bi bi-search search-icon"></i>
                                    <input
                                        type="search"
                                        placeholder="Search by name, specialization..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="form-control search-input"
                                    />
                                    <button type="submit" className="btn-search">Search</button>
                                </div>
                            </form>
                            <div className="sort-wrap ms-3">
                                <select
                                    onChange={(e) => sortFilter(e.target.value)}
                                    className="form-select sort-select"
                                >
                                    <option value="1">Latest</option>
                                    <option value="2">Price: High → Low</option>
                                    <option value="3">Price: Low → High</option>
                                </select>
                            </div>
                        </div>

                        <div className="results-meta mb-3">
                            <span className="results-count">{data.length} doctors found</span>
                        </div>

                        <Doctor data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}