import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicineCategory } from "../Redux/ActionCreators/MedicineCategoryActionCreators"
import Medicine from '../Components/Medicine'
import { getMedicine } from '../Redux/ActionCreators/MedicineActionCreators'
import SecondaryNavbar from '../Components/SecondaryNavbar'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

  .med-shop * { box-sizing: border-box; }

  .med-shop {
    font-family: 'Outfit', sans-serif;
    background: #f4f7f6;
    min-height: 100vh;
  }

  /* ── Hero Banner ── */
  .med-hero {
    background: #0c2340;
    padding: 56px 48px 52px;
    position: relative;
    overflow: hidden;
  }

  .med-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -40px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .med-hero::after {
    content: '💊';
    position: absolute;
    right: 52px; top: 50%;
    transform: translateY(-50%);
    font-size: 96px;
    opacity: 0.1;
    pointer-events: none;
  }

  .med-hero-eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin: 0 0 12px;
  }

  .med-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    color: #f0fdf4;
    margin: 0 0 10px;
    line-height: 1.15;
  }

  .med-hero-sub {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
  }

  /* ── Layout ── */
  .med-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 36px 32px 64px;
  }

  /* ── Sidebar ── */
  .med-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .med-sidebar-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2ece9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .med-sidebar-header {
    background: #0c2340;
    color: #f0fdf4;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .med-sidebar-header-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #14b8a6;
    flex-shrink: 0;
  }

  .med-filter-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 18px;
    font-size: 0.84rem;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
    border-bottom: 1px solid #f0f7f5;
    transition: background 0.15s, color 0.15s, padding-left 0.15s;
    cursor: pointer;
  }

  .med-filter-link:last-child { border-bottom: none; }

  .med-filter-link:hover {
    background: #f0fdfa;
    color: #0d9488;
    padding-left: 24px;
  }

  .med-filter-link.active-link {
    background: #f0fdfa;
    color: #0d9488;
    border-left: 3px solid #14b8a6;
    padding-left: 15px;
  }

  .med-filter-link-icon {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c7d8d4;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .med-filter-link:hover .med-filter-link-icon,
  .med-filter-link.active-link .med-filter-link-icon {
    background: #14b8a6;
  }

  /* Price filter card */
  .med-price-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2ece9;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .med-price-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ca3af;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .med-price-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2ece9;
  }

  .med-price-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .med-price-input-wrap label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .med-price-input-wrap input {
    width: 100%;
    padding: 9px 12px;
    border: 1.5px solid #e2ece9;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    color: #0c2340;
    background: #f4f7f6;
    outline: none;
    transition: border-color 0.2s;
  }

  .med-price-input-wrap input:focus {
    border-color: #14b8a6;
    background: #fff;
  }

  .med-apply-btn {
    width: 100%;
    padding: 11px;
    background: #0c2340;
    color: #f0fdf4;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.03em;
  }

  .med-apply-btn:hover { background: #14b8a6; color: #0c2340; }
  .med-apply-btn:active { transform: scale(0.98); }

  /* ── Main Content ── */
  .med-main { display: flex; flex-direction: column; gap: 20px; }

  /* Toolbar */
  .med-toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    background: #ffffff;
    border-radius: 16px;
    padding: 14px 16px;
    border: 1px solid #e2ece9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .med-search-wrap {
    flex: 1;
    display: flex;
    gap: 0;
  }

  .med-search-input {
    flex: 1;
    padding: 10px 16px;
    border: 1.5px solid #e2ece9;
    border-right: none;
    border-radius: 10px 0 0 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    color: #0c2340;
    background: #f4f7f6;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .med-search-input:focus {
    border-color: #14b8a6;
    background: #fff;
  }

  .med-search-btn {
    padding: 10px 20px;
    background: #14b8a6;
    color: #0c2340;
    border: none;
    border-radius: 0 10px 10px 0;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .med-search-btn:hover { background: #0d9488; color: #fff; }

  .med-divider { width: 1px; height: 36px; background: #e2ece9; flex-shrink: 0; }

  .med-sort-select {
    padding: 10px 14px;
    border: 1.5px solid #e2ece9;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    color: #374151;
    background: #f4f7f6;
    outline: none;
    cursor: pointer;
    min-width: 180px;
    transition: border-color 0.2s;
  }

  .med-sort-select:focus { border-color: #14b8a6; }

  /* Results count */
  .med-results-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }

  .med-results-count {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 500;
  }

  .med-results-count strong { color: #0c2340; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .med-layout { grid-template-columns: 1fr; }
    .med-hero { padding: 36px 24px; }
    .med-hero-title { font-size: 1.9rem; }
    .med-hero::after { display: none; }
    .med-layout { padding: 24px 16px 48px; }
    .med-toolbar { flex-wrap: wrap; }
    .med-sort-select { min-width: 140px; }
  }
`

export default function MedicineShopPage() {
  let [data,   setData]   = useState([])
  let [mc,     setMc]     = useState("All")
  let [flag,   setFlag]   = useState(false)
  let [search, setSearch] = useState("")
  let [min,    setMin]    = useState(-1)
  let [max,    setMax]    = useState(-1)

  let MedicineCategoryStateData = useSelector(state => state.MedicineCategoryStateData) || []
  let MedicineStateData         = useSelector(state => state.MedicineStateData) || []
  let dispatch                  = useDispatch()
  let [searchParams]            = useSearchParams()

  useEffect(() => {
    dispatch(getMedicineCategory())
    dispatch(getMedicine())
  }, [dispatch])

  function filter(mcId = "All", minVal = -1, maxVal = -1) {
    setSearch("")
    setData(MedicineStateData.filter(p => {
      const mcMatch  = mcId === "All" || p.medicineCategory?._id === mcId
      const minMatch = minVal === -1 || p.finalPrice >= Number(minVal)
      const maxMatch = maxVal === -1 || p.finalPrice <= Number(maxVal)
      return mcMatch && minMatch && maxMatch
    }))
  }

  function applyPriceFilter(e) {
    e.preventDefault()
    filter(mc, min, max)
  }

  useEffect(() => {
    if (MedicineStateData.length) {
      const mcId = searchParams.get("mc") ?? "All"
      setMc(mcId)
      filter(mcId, min, max)
    }
  }, [MedicineStateData, searchParams])

  function postSearch(e) {
    e.preventDefault()
    const ch = search.toLowerCase()
    setData(MedicineStateData.filter(x =>
      x.active && (
        x.medicineCategory?.name?.toLowerCase().includes(ch) ||
        x.description?.toLowerCase().includes(ch) ||
        x.name?.toLowerCase().includes(ch)
      )
    ))
  }

  function sortFilter(option) {
    const sorted = [...data]
    if (option === "1")      sorted.sort((x, y) => y._id.localeCompare(x._id))
    else if (option === "2") sorted.sort((x, y) => y.finalPrice - x.finalPrice)
    else                     sorted.sort((x, y) => x.finalPrice - y.finalPrice)
    setData(sorted)
    setFlag(!flag)
  }

  const activeMc = searchParams.get("mc") ?? "All"

  return (
    <>
      <style>{CSS}</style>
      <SecondaryNavbar title="medicine" />

      <div className="med-shop">
        {/* Hero */}
        <div className="med-hero">
          <p className="med-hero-eyebrow">Pharmacy &amp; Wellness</p>
          <h1 className="med-hero-title">Medicine Shop</h1>
          <p className="med-hero-sub">Genuine medicines delivered fast, right to your door</p>
        </div>

        <div className="med-layout">
          {/* ── Sidebar ── */}
          <aside className="med-sidebar">
            <div className="med-sidebar-card">
              <div className="med-sidebar-header">
                <span className="med-sidebar-header-dot" />
                Medicine Category
              </div>
              <Link
                to="/medicine/shop?mc=All"
                className={`med-filter-link${activeMc === "All" ? " active-link" : ""}`}
              >
                <span className="med-filter-link-icon" /> All Medicines
              </Link>
              {MedicineCategoryStateData.filter(x => x.active).map(item => (
                <Link
                  key={item._id}
                  to={`/medicine/shop?mc=${item._id}`}
                  className={`med-filter-link${activeMc === item._id ? " active-link" : ""}`}
                >
                  <span className="med-filter-link-icon" /> {item.name}
                </Link>
              ))}
            </div>

            <div className="med-price-card">
              <p className="med-price-label">Price Range</p>
              <form onSubmit={applyPriceFilter}>
                <div className="med-price-inputs">
                  <div className="med-price-input-wrap">
                    <label>Min (₹)</label>
                    <input
                      type="number"
                      value={min === -1 ? "" : min}
                      placeholder="Any"
                      onChange={e => setMin(e.target.value === "" ? -1 : Number(e.target.value))}
                    />
                  </div>
                  <div className="med-price-input-wrap">
                    <label>Max (₹)</label>
                    <input
                      type="number"
                      value={max === -1 ? "" : max}
                      placeholder="Any"
                      onChange={e => setMax(e.target.value === "" ? -1 : Number(e.target.value))}
                    />
                  </div>
                </div>
                <button type="submit" className="med-apply-btn">Apply Filter</button>
              </form>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="med-main">
            <div className="med-toolbar">
              <form onSubmit={postSearch} className="med-search-wrap">
                <input
                  type="search"
                  placeholder="Search medicines, categories…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="med-search-input"
                />
                <button type="submit" className="med-search-btn">Search</button>
              </form>
              <div className="med-divider" />
              <select
                className="med-sort-select"
                onChange={e => sortFilter(e.target.value)}
              >
                <option value="1">Latest</option>
                <option value="2">Price: High to Low</option>
                <option value="3">Price: Low to High</option>
              </select>
            </div>

            <div className="med-results-info">
              <span className="med-results-count">
                Showing <strong>{data.length}</strong> result{data.length !== 1 ? "s" : ""}
              </span>
            </div>

            <Medicine data={data} />
          </main>
        </div>
      </div>
    </>
  )
}