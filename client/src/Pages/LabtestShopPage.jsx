import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLabtestCategory } from "../Redux/ActionCreators/LabtestCategoryActionCreators"
import Labtest from '../Components/Labtest'
import { getLabtest } from '../Redux/ActionCreators/LabtestActionCreators'
import SecondaryNavbar from '../Components/SecondaryNavbar'
import { getLab } from '../Redux/ActionCreators/LabActionCreators'

export default function LabtestShopPage() {
    let [data, setData] = useState([])
    let [lc, setLc] = useState("")
    let [flag, setFlag] = useState(false)
    let [search, setSearch] = useState("")
    let [min, setMin] = useState(0)
    let [max, setMax] = useState(1000)

    let LabtestCategoryStateData = useSelector(state => state.LabtestCategoryStateData)
    let LabStateData = useSelector(state => state.LabStateData)
    let LabtestStateData = useSelector(state => state.LabtestStateData)
    let dispatch = useDispatch()
    let [searchParams] = useSearchParams()

    // ✅ FIX 1: Added () to getLab so the thunk is dispatched, not the function reference
    useEffect(() => {
        dispatch(getLabtestCategory())
        dispatch(getLabtest())
        dispatch(getLab())
    }, [dispatch])

    // 🔎 Search by text
    function postSearch(e) {
        e.preventDefault()
        let ch = search.toLowerCase()

        setData(
            LabtestStateData.filter(x => {
                const categoryName = (typeof x.labtestCategory === 'object'
                    ? x.labtestCategory?.name
                    : x.labtestCategory
                )?.toLowerCase() ?? ""

                const labName = (typeof x.lab === 'object'
                    ? x.lab?.name
                    : x.lab
                )?.toLowerCase() ?? ""

                return (
                    x.active &&
                    (
                        categoryName.includes(ch) ||
                        labName.includes(ch) ||
                        x.description?.toLowerCase().includes(ch) ||
                        x.name?.toLowerCase().includes(ch)
                    )
                )
            })
        )
    }

    // 🔎 Sorting
    function sortFilter(option) {
        if (option === "1")
            setData([...data].sort((x, y) => y._id.localeCompare(x._id)))
        else if (option === "2")
            setData([...data].sort((x, y) => y.finalPrice - x.finalPrice))
        else
            setData([...data].sort((x, y) => x.finalPrice - y.finalPrice))

        setFlag(!flag)
    }

    // ✅ FIX 2: Renamed to filterByCategory — no longer conflicts with filterByLab
    function filterByCategory(lc = "All", min = -1, max = -1) {
        setSearch("")
        const filtered = LabtestStateData.filter((p) => {
            const category = (typeof p.labtestCategory === 'object'
                ? p.labtestCategory?.name
                : p.labtestCategory
            )?.toLowerCase().trim() ?? ""

            const selected = lc.toLowerCase().trim()

            return (
                (selected === "all" || selected === category) &&
                (min === -1 || p.finalPrice >= min) &&
                (max === -1 || p.finalPrice <= max)
            )
        })
        setData(filtered)
    }

    // ✅ FIX 2: Renamed to filterByLab — no longer overwritten by filterByCategory
    function filterByLab(lb = "All", min = -1, max = -1) {
        setSearch("")
        const filtered = LabtestStateData.filter((p) => {
            const lab = (typeof p.lab === 'object'
                ? p.lab?.name
                : p.lab
            )?.toLowerCase().trim() ?? ""

            const selected = lb.toLowerCase().trim()

            return (
                (selected === "all" || selected === lab) &&
                (min === -1 || p.finalPrice >= min) &&
                (max === -1 || p.finalPrice <= max)
            )
        })
        setData(filtered)
    }

    function applyPriceFilter(e) {
        e.preventDefault()
        const lb = searchParams.get("lb") ?? "All"
        const lcParam = searchParams.get("lc") ?? "All"
        if (lb !== "All") {
            filterByLab(lb, min, max)
        } else {
            filterByCategory(lcParam, min, max)
        }
    }

    // ✅ FIX 3: Now reads both ?lc= and ?lb= from URL params
    useEffect(() => {
        if (LabtestStateData.length) {
            const lcParam = searchParams.get("lc") ?? "All"
            const lbParam = searchParams.get("lb") ?? "All"
            setLc(lcParam)
            if (lbParam !== "All") {
                filterByLab(lbParam, min, max)
            } else {
                filterByCategory(lcParam, min, max)
            }
        }
    }, [LabtestStateData, searchParams])

    return (
        <>
            <SecondaryNavbar title="labtest" />
            <HeroSection title="Labtest Shop" />
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-2">
                        {/* Category Filter */}
                        <div className="list-group mb-3">
                            <Link
                                to="#"
                                className="list-group-item list-group-item-action active"
                                aria-current="true"
                            >
                                Labtest Category
                            </Link>
                            <Link to={`/labtest/shop?lc=All`} className="list-group-item list-group-item-action">All</Link>
                            {LabtestCategoryStateData.filter(x => x.active).map(item => (
                                <Link
                                    key={item._id}
                                    to={`/labtest/shop?lc=${encodeURIComponent(item.name)}`}
                                    className="list-group-item list-group-item-action"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* ✅ FIX 4: Lab sidebar now uses LabStateData, not LabtestCategoryStateData */}
                        <div className="list-group mb-3">
                            <Link
                                to="#"
                                className="list-group-item list-group-item-action active"
                                aria-current="true"
                            >
                                Lab
                            </Link>
                            <Link to={`/labtest/shop?lb=All`} className="list-group-item list-group-item-action">All</Link>
                            {LabStateData.filter(x => x.active).map(item => (
                                <Link
                                    key={item._id}
                                    to={`/labtest/shop?lb=${encodeURIComponent(item.name)}`}
                                    className="list-group-item list-group-item-action"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <form onSubmit={applyPriceFilter}>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label>Minimum</label>
                                    <input
                                        type="number"
                                        name="min"
                                        value={min}
                                        placeholder="Min"
                                        onChange={(e) => setMin(Number(e.target.value))}
                                        className="form-control border-3 border-primary"
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label>Maximum</label>
                                    <input
                                        type="number"
                                        name="max"
                                        value={max}
                                        placeholder="Max"
                                        onChange={(e) => setMax(Number(e.target.value))}
                                        className="form-control border-3 border-primary"
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <button type="submit" className="btn btn-primary w-100">
                                    Apply Filter
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-10">
                        <div className="row">
                            {/* Search */}
                            <div className="col-md-9 mb-3">
                                <form onSubmit={postSearch}>
                                    <div className="btn-group w-100">
                                        <input
                                            type="search"
                                            name="search"
                                            placeholder="Search"
                                            onChange={(e) => setSearch(e.target.value)}
                                            value={search}
                                            className="form-control border-3 border-primary"
                                            style={{ borderRadius: "10px 0 0 10px" }}
                                        />
                                        <button type="submit" className="btn btn-primary">Search</button>
                                    </div>
                                </form>
                            </div>

                            {/* Sort */}
                            <div className="col-md-3">
                                <select
                                    name="sortFilter"
                                    onChange={(e) => sortFilter(e.target.value)}
                                    className="form-select border-3 border-primary"
                                >
                                    <option value="1">Latest</option>
                                    <option value="2">Price : High to Low</option>
                                    <option value="3">Price : Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Labtest Grid */}
                        <Labtest data={data} />
                    </div>
                </div>
            </div>
        </>
    )
}