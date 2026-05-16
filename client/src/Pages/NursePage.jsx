import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNurse } from '../Redux/ActionCreators/NurseActionCreators';
import Nurse from '../Components/Nurse';

export default function NursePage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1000);

    const NurseStateData = useSelector((state) => state.NurseStateData);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => { dispatch(getNurse()); }, [dispatch]);

    useEffect(() => {
        if (NurseStateData.length) {
            setData(NurseStateData.filter((x) => x.active));
        }
    }, [NurseStateData]);

    const postSearch = (e) => {
        e.preventDefault();
        const ch = search.toLowerCase();
        const filtered = NurseStateData.filter(
            (x) => x.active && (
                x.name?.toLowerCase().includes(ch) ||
                x.description?.toLowerCase().includes(ch) ||
                x.specialization?.toLowerCase().includes(ch)
            )
        );
        setData(filtered);
    };

    const sortFilter = (option) => {
        let sorted = [...data];
        if (option === '1') sorted.sort((x, y) => y._id.toString().localeCompare(x._id.toString()));
        else if (option === '2') sorted.sort((x, y) => Number(y.fees) - Number(x.fees));
        else sorted.sort((x, y) => Number(x.fees) - Number(y.fees));
        setData(sorted);
    };

    const filter = (minVal = -1, maxVal = -1) => {
        setSearch('');
        const filtered = NurseStateData.filter((p) => {
            const price = Number(p.fees);
            return p.active && (minVal === -1 || price >= minVal) && (maxVal === -1 || price <= maxVal);
        });
        setData(filtered);
    };

    const applyPriceFilter = (e) => {
        e.preventDefault();
        filter(min, max);
    };

    return (
        <>
            <HeroSection title="Nurse Shop" />
            <div className="shop-page-layout container-fluid py-4">
                <div className="row g-4">
                    {/* Sidebar */}
                    <div className="col-md-3">
                        <div className="shop-sidebar">
                            <div className="sidebar-section">
                                <h6 className="sidebar-section-title">
                                    <i className="bi bi-funnel me-2"></i>Filter by Fees
                                </h6>
                                <form onSubmit={applyPriceFilter} className="price-filter-form">
                                    <div className="price-inputs">
                                        <div className="price-input-group">
                                            <label>Min (₹)</label>
                                            <input
                                                type="number"
                                                name="min"
                                                value={min}
                                                placeholder="0"
                                                onChange={(e) => setMin(e.target.value)}
                                                className="form-control price-input"
                                            />
                                        </div>
                                        <span className="price-sep">—</span>
                                        <div className="price-input-group">
                                            <label>Max (₹)</label>
                                            <input
                                                type="number"
                                                name="max"
                                                value={max}
                                                placeholder="1000"
                                                onChange={(e) => setMax(e.target.value)}
                                                className="form-control price-input"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-apply-filter w-100 mt-3">
                                        <i className="bi bi-funnel-fill me-2"></i>Apply Filter
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        <div className="shop-toolbar mb-4">
                            <form onSubmit={postSearch} className="search-form flex-grow-1">
                                <div className="search-input-group">
                                    <i className="bi bi-search search-icon"></i>
                                    <input
                                        type="search"
                                        name="search"
                                        placeholder="Search by name, specialization..."
                                        onChange={(e) => setSearch(e.target.value)}
                                        value={search}
                                        className="form-control search-input"
                                    />
                                    <button type="submit" className="btn-search">Search</button>
                                </div>
                            </form>
                            <div className="sort-wrap ms-3">
                                <select
                                    name="sortFilter"
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
                            <span className="results-count">{data.length} nurses found</span>
                        </div>

                        <Nurse data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}