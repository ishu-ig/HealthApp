import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicineCategory } from "../Redux/ActionCreators/MedicineCategoryActionCreators"
import Medicine from '../Components/Medicine'
import { getMedicine } from '../Redux/ActionCreators/MedicineActionCreators'
import SecondaryNavbar from '../Components/SecondaryNavbar'

export default function MedicineShopPage() {
    let [data, setData] = useState([])
    let [mc, setMc] = useState("All")
    let [flag, setFlag] = useState(false)
    let [search, setSearch] = useState("")
    let [min, setMin] = useState(-1)
    let [max, setMax] = useState(-1)

    // ✅ Safe fallbacks
    let MedicineCategoryStateData = useSelector(state => state.MedicineCategoryStateData) || []
    let MedicineStateData = useSelector(state => state.MedicineStateData) || []
    let dispatch = useDispatch()
    let [searchParams] = useSearchParams()

    useEffect(() => {
        dispatch(getMedicineCategory())
        dispatch(getMedicine())
    }, [dispatch])

    function filter(mcId = "All", minVal = -1, maxVal = -1) {
        setSearch("")
        const filtered = MedicineStateData.filter((p) => {
            // ✅ Compare by medicineCategory._id since it's a populated object
            const mcMatch = mcId === "All" || p.medicineCategory?._id === mcId
            const minMatch = minVal === -1 || p.finalPrice >= Number(minVal)
            const maxMatch = maxVal === -1 || p.finalPrice <= Number(maxVal)
            return mcMatch && minMatch && maxMatch
        })
        setData(filtered)
    }

    function applyPriceFilter(e) {
        e.preventDefault()
        filter(mc, min, max)
    }

    useEffect(() => {
        if (MedicineStateData.length) {
            // ✅ Read mc as _id from URL (set by MedicinePage)
            let mcId = searchParams.get("mc") ?? "All"
            setMc(mcId)
            filter(mcId, min, max)
        }
    }, [MedicineStateData, searchParams])

    function postSearch(e) {
        e.preventDefault()
        const ch = search.toLowerCase()
        setData(
            MedicineStateData.filter(x =>
                x.active && (
                    // ✅ Use medicineCategory.name for search (it's an object)
                    x.medicineCategory?.name?.toLowerCase().includes(ch) ||
                    x.description?.toLowerCase().includes(ch) ||
                    x.name?.toLowerCase().includes(ch)
                )
            )
        )
    }

    function sortFilter(option) {
        // ✅ Use spread to avoid mutating state directly
        const sorted = [...data]
        if (option === "1")
            sorted.sort((x, y) => y._id.localeCompare(x._id))
        else if (option === "2")
            sorted.sort((x, y) => y.finalPrice - x.finalPrice)
        else
            sorted.sort((x, y) => x.finalPrice - y.finalPrice)

        setData(sorted)
        setFlag(!flag)
    }

    return (
        <>
            <SecondaryNavbar title="medicine" />
            <HeroSection title="Medicine Shop" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="list-group mb-3">
                            <Link className="list-group-item list-group-item-action active" to="#">
                                Medicine Category
                            </Link>
                            <Link to={`/medicine/shop?mc=All`} className="list-group-item list-group-item-action">
                                All
                            </Link>
                            {MedicineCategoryStateData.filter(x => x.active).map(item => (
                                // ✅ Pass item._id in URL so filter can match medicineCategory._id
                                <Link
                                    to={`/medicine/shop?mc=${item._id}`}
                                    key={item._id}
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
                                        placeholder='Min'
                                        onChange={(e) => setMin(e.target.value === "" ? -1 : Number(e.target.value))}
                                        className='form-control border-3 border-primary'
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label>Maximum</label>
                                    <input
                                        type="number"
                                        value={max === -1 ? "" : max}
                                        placeholder='Max'
                                        onChange={(e) => setMax(e.target.value === "" ? -1 : Number(e.target.value))}
                                        className='form-control border-3 border-primary'
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <button type="submit" className='btn btn-primary w-100'>Apply Filter</button>
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
                                            placeholder='Search'
                                            onChange={(e) => setSearch(e.target.value)}
                                            value={search}
                                            className='form-control border-3 border-primary'
                                            style={{ borderRadius: "10px 0 0 10px" }}
                                        />
                                        <button type='submit' className='btn btn-primary'>Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <select
                                    onChange={(e) => sortFilter(e.target.value)}
                                    className='form-select border-3 border-primary'
                                >
                                    <option value="1">Latest</option>
                                    <option value="2">Price : High to Low</option>
                                    <option value="3">Price : Low to High</option>
                                </select>
                            </div>
                        </div>

                        <Medicine data={data} />
                    </div>
                </div>
            </div>
        </>
    )
}