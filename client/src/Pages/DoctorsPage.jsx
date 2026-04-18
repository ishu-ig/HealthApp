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
            // ✅ Compare against specialization.name (string) instead of the object
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
                // ✅ Use specialization.name for string search
                x.specialization?.name?.toLowerCase().includes(ch) ||
                x.description?.toLowerCase().includes(ch) ||
                x.name?.toLowerCase().includes(ch)
            )
        );
        setData(filtered);
    };

    const sortFilter = (option) => {
        const sorted = [...data];
        if (option === "1") {
            sorted.sort((x, y) => y._id.toString().localeCompare(x._id.toString()));
        } else if (option === "2") {
            sorted.sort((x, y) => y.fees - x.fees);
        } else {
            sorted.sort((x, y) => x.fees - y.fees);
        }
        setData(sorted);
    };

    return (
        <>
            <HeroSection title="Doctor Shop" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="list-group mb-3">
                            <Link className="list-group-item list-group-item-action active" to="#">
                                Doctor
                            </Link>
                            <Link to={`/doctors?sp=All`} className="list-group-item list-group-item-action">
                                All
                            </Link>
                            {SpecializationStateData.filter(x => x.active).map(item => (
                                <Link
                                    key={item._id}
                                    // ✅ Pass item.name in URL (string, not object)
                                    to={`/doctors?sp=${item.name}`}
                                    className="list-group-item list-group-item-action"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <form onSubmit={applyPriceFilter}>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label>Minimum</label>
                                    <input
                                        type="number"
                                        value={min === -1 ? "" : min}
                                        onChange={(e) => setMin(e.target.value === "" ? -1 : Number(e.target.value))}
                                        className="form-control border-3 border-primary"
                                        placeholder="Min"
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label>Maximum</label>
                                    <input
                                        type="number"
                                        value={max === -1 ? "" : max}
                                        onChange={(e) => setMax(e.target.value === "" ? -1 : Number(e.target.value))}
                                        className="form-control border-3 border-primary"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <button type="submit" className="btn btn-primary w-100">Apply Filter</button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-md-9 mb-3">
                                <form onSubmit={postSearch}>
                                    <div className="btn-group w-100">
                                        <input
                                            type="search"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="form-control border-3 border-primary"
                                            style={{ borderRadius: "10px 0 0 10px" }}
                                        />
                                        <button type="submit" className="btn btn-primary">Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <select
                                    onChange={(e) => sortFilter(e.target.value)}
                                    className="form-select border-3 border-primary"
                                >
                                    <option value="1">Latest</option>
                                    <option value="2">Price : High to Low</option>
                                    <option value="3">Price : Low to High</option>
                                </select>
                            </div>
                        </div>

                        <Doctor data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}