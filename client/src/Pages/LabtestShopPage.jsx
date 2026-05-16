import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLabtestCategory } from "../Redux/ActionCreators/LabtestCategoryActionCreators"
import Labtest from '../Components/Labtest'
import { getLabtest } from '../Redux/ActionCreators/LabtestActionCreators'
import SecondaryNavbar from '../Components/SecondaryNavbar'
import { getLab } from '../Redux/ActionCreators/LabActionCreators'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

  .lt-shop * { box-sizing: border-box; }

  .lt-shop {
    font-family: 'Outfit', sans-serif;
    background: #f7f6f2;
    min-height: 100vh;
  }

  /* ── Hero Banner ── */
  .lt-hero {
    background: #0c2340;
    padding: 56px 48px 52px;
    position: relative;
    overflow: hidden;
  }

  .lt-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .lt-hero::after {
    content: '🧪';
    position: absolute;
    right: 48px; top: 50%;
    transform: translateY(-50%);
    font-size: 96px;
    opacity: 0.12;
    pointer-events: none;
  }

  .lt-hero-eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2dd4bf;
    margin: 0 0 12px;
  }

  .lt-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    color: #f0fdf4;
    margin: 0 0 10px;
    line-height: 1.15;
  }

  .lt-hero-sub {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
  }

  /* ── Layout ── */
  .lt-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 36px 32px 64px;
  }

  /* ── Sidebar ── */
  .lt-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .lt-sidebar-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e8e6df;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .lt-sidebar-header {
    background: #1a1a2e;
    color: #f7f6f2;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lt-sidebar-header-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #14b8a6;
    flex-shrink: 0;
  }

  .lt-filter-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 18px;
    font-size: 0.84rem;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
    border-bottom: 1px solid #f3f2ee;
    transition: background 0.15s, color 0.15s, padding-left 0.15s;
    cursor: pointer;
  }

  .lt-filter-link:last-child { border-bottom: none; }

  .lt-filter-link:hover {
    background: #fffbf0;
    color: #0d9488;
    padding-left: 24px;
  }

  .lt-filter-link.active-link {
    background: #f0fdfa;
    color: #0d9488;
    border-left: 3px solid #14b8a6;
    padding-left: 15px;
  }

  .lt-filter-link-icon {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c7d8d4;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .lt-filter-link:hover .lt-filter-link-icon,
  .lt-filter-link.active-link .lt-filter-link-icon {
    background: #14b8a6;
  }

  /* Price filter card */
  .lt-price-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e8e6df;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .lt-price-label {
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

  .lt-price-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e6df;
  }

  .lt-price-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .lt-price-input-wrap label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .lt-price-input-wrap input {
    width: 100%;
    padding: 9px 12px;
    border: 1.5px solid #e8e6df;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    color: #1a1a2e;
    background: #f7f6f2;
    outline: none;
    transition: border-color 0.2s;
  }

  .lt-price-input-wrap input:focus {
    border-color: #14b8a6;
    background: #fff;
  }

  .lt-apply-btn {
    width: 100%;
    padding: 11px;
    background: #1a1a2e;
    color: #f7f6f2;
    border: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.03em;
  }

  .lt-apply-btn:hover { background: #14b8a6; color: #1a1a2e; }
  .lt-apply-btn:active { transform: scale(0.98); }

  /* ── Main Content ── */
  .lt-main { display: flex; flex-direction: column; gap: 20px; }

  /* Search + Sort bar */
  .lt-toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    background: #ffffff;
    border-radius: 16px;
    padding: 14px 16px;
    border: 1px solid #e8e6df;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .lt-search-wrap {
    flex: 1;
    display: flex;
    gap: 0;
  }

  .lt-search-input {
    flex: 1;
    padding: 10px 16px;
    border: 1.5px solid #e8e6df;
    border-right: none;
    border-radius: 10px 0 0 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem;
    color: #1a1a2e;
    background: #f7f6f2;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .lt-search-input:focus {
    border-color: #14b8a6;
    background: #fff;
  }

  .lt-search-btn {
    padding: 10px 20px;
    background: #14b8a6;
    color: #1a1a2e;
    border: none;
    border-radius: 0 10px 10px 0;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .lt-search-btn:hover { background: #0d9488; color: #fff; }

  .lt-divider { width: 1px; height: 36px; background: #e8e6df; flex-shrink: 0; }

  .lt-sort-select {
    padding: 10px 14px;
    border: 1.5px solid #e8e6df;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem;
    color: #374151;
    background: #f7f6f2;
    outline: none;
    cursor: pointer;
    min-width: 180px;
    transition: border-color 0.2s;
  }

  .lt-sort-select:focus { border-color: #14b8a6; }

  /* Results count */
  .lt-results-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }

  .lt-results-count {
    font-size: 0.8rem;
    color: #9ca3af;
    font-weight: 500;
  }

  .lt-results-count strong { color: #1a1a2e; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .lt-layout { grid-template-columns: 1fr; }
    .lt-hero { padding: 36px 24px; }
    .lt-hero-title { font-size: 1.9rem; }
    .lt-hero::after { display: none; }
    .lt-layout { padding: 24px 16px 48px; }
    .lt-toolbar { flex-wrap: wrap; }
    .lt-sort-select { min-width: 140px; }
  }
`

export default function LabtestShopPage() {
  let [data,   setData]   = useState([])
  let [lc,     setLc]     = useState("")
  let [flag,   setFlag]   = useState(false)
  let [search, setSearch] = useState("")
  let [min,    setMin]    = useState(0)
  let [max,    setMax]    = useState(1000)

  let LabtestCategoryStateData = useSelector(state => state.LabtestCategoryStateData)
  let LabStateData             = useSelector(state => state.LabStateData)
  let LabtestStateData         = useSelector(state => state.LabtestStateData)
  let dispatch                 = useDispatch()
  let [searchParams]           = useSearchParams()

  useEffect(() => {
    dispatch(getLabtestCategory())
    dispatch(getLabtest())
    dispatch(getLab())
  }, [dispatch])

  function postSearch(e) {
    e.preventDefault()
    const ch = search.toLowerCase()
    setData(
      LabtestStateData.filter(x => {
        const categoryName = (typeof x.labtestCategory === 'object'
          ? x.labtestCategory?.name : x.labtestCategory)?.toLowerCase() ?? ""
        const labName = (typeof x.lab === 'object'
          ? x.lab?.name : x.lab)?.toLowerCase() ?? ""
        return x.active && (
          categoryName.includes(ch) || labName.includes(ch) ||
          x.description?.toLowerCase().includes(ch) ||
          x.name?.toLowerCase().includes(ch)
        )
      })
    )
  }

  function sortFilter(option) {
    const sorted = [...data]
    if (option === "1")      sorted.sort((x, y) => y._id.localeCompare(x._id))
    else if (option === "2") sorted.sort((x, y) => y.finalPrice - x.finalPrice)
    else                     sorted.sort((x, y) => x.finalPrice - y.finalPrice)
    setData(sorted)
    setFlag(!flag)
  }

  function filterByCategory(lc = "All", min = -1, max = -1) {
    setSearch("")
    setData(LabtestStateData.filter(p => {
      const category = (typeof p.labtestCategory === 'object'
        ? p.labtestCategory?.name : p.labtestCategory)?.toLowerCase().trim() ?? ""
      const selected = lc.toLowerCase().trim()
      return (
        (selected === "all" || selected === category) &&
        (min === -1 || p.finalPrice >= min) &&
        (max === -1 || p.finalPrice <= max)
      )
    }))
  }

  function filterByLab(lb = "All", min = -1, max = -1) {
    setSearch("")
    setData(LabtestStateData.filter(p => {
      const lab = (typeof p.lab === 'object'
        ? p.lab?.name : p.lab)?.toLowerCase().trim() ?? ""
      const selected = lb.toLowerCase().trim()
      return (
        (selected === "all" || selected === lab) &&
        (min === -1 || p.finalPrice >= min) &&
        (max === -1 || p.finalPrice <= max)
      )
    }))
  }

  function applyPriceFilter(e) {
    e.preventDefault()
    const lb      = searchParams.get("lb") ?? "All"
    const lcParam = searchParams.get("lc") ?? "All"
    lb !== "All" ? filterByLab(lb, min, max) : filterByCategory(lcParam, min, max)
  }

  useEffect(() => {
    if (LabtestStateData.length) {
      const lcParam = searchParams.get("lc") ?? "All"
      const lbParam = searchParams.get("lb") ?? "All"
      setLc(lcParam)
      lbParam !== "All" ? filterByLab(lbParam, min, max) : filterByCategory(lcParam, min, max)
    }
  }, [LabtestStateData, searchParams])

  const activeLc = searchParams.get("lc") ?? "All"
  const activeLb = searchParams.get("lb") ?? "All"

  return (
    <>
      <style>{CSS}</style>
      <SecondaryNavbar title="labtest" />

      <div className="lt-shop">
        {/* Hero */}
        <div className="lt-hero">
          <p className="lt-hero-eyebrow">Diagnostics &amp; Testing</p>
          <h1 className="lt-hero-title">Lab Test Shop</h1>
          <p className="lt-hero-sub">Book accurate, affordable diagnostics from certified labs</p>
        </div>

        <div className="lt-layout">
          {/* ── Sidebar ── */}
          <aside className="lt-sidebar">

            {/* Category Filter */}
            <div className="lt-sidebar-card">
              <div className="lt-sidebar-header">
                <span className="lt-sidebar-header-dot" />
                Test Category
              </div>
              <Link
                to="/labtest/shop?lc=All"
                className={`lt-filter-link${activeLc === "All" && activeLb === "All" ? " active-link" : ""}`}
              >
                <span className="lt-filter-link-icon" /> All Categories
              </Link>
              {(LabtestCategoryStateData || []).filter(x => x.active).map(item => (
                <Link
                  key={item._id}
                  to={`/labtest/shop?lc=${encodeURIComponent(item.name)}`}
                  className={`lt-filter-link${activeLc === item.name ? " active-link" : ""}`}
                >
                  <span className="lt-filter-link-icon" /> {item.name}
                </Link>
              ))}
            </div>

            {/* Lab Filter */}
            <div className="lt-sidebar-card">
              <div className="lt-sidebar-header">
                <span className="lt-sidebar-header-dot" />
                Lab Partner
              </div>
              <Link
                to="/labtest/shop?lb=All"
                className={`lt-filter-link${activeLb === "All" ? " active-link" : ""}`}
              >
                <span className="lt-filter-link-icon" /> All Labs
              </Link>
              {(LabStateData || []).filter(x => x.active).map(item => (
                <Link
                  key={item._id}
                  to={`/labtest/shop?lb=${encodeURIComponent(item.name)}`}
                  className={`lt-filter-link${activeLb === item.name ? " active-link" : ""}`}
                >
                  <span className="lt-filter-link-icon" /> {item.name}
                </Link>
              ))}
            </div>

            {/* Price Filter */}
            <div className="lt-price-card">
              <p className="lt-price-label">Price Range</p>
              <form onSubmit={applyPriceFilter}>
                <div className="lt-price-inputs">
                  <div className="lt-price-input-wrap">
                    <label>Min (₹)</label>
                    <input
                      type="number"
                      value={min}
                      placeholder="0"
                      onChange={e => setMin(Number(e.target.value))}
                    />
                  </div>
                  <div className="lt-price-input-wrap">
                    <label>Max (₹)</label>
                    <input
                      type="number"
                      value={max}
                      placeholder="1000"
                      onChange={e => setMax(Number(e.target.value))}
                    />
                  </div>
                </div>
                <button type="submit" className="lt-apply-btn">Apply Filter</button>
              </form>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="lt-main">
            {/* Toolbar */}
            <div className="lt-toolbar">
              <form onSubmit={postSearch} className="lt-search-wrap">
                <input
                  type="search"
                  placeholder="Search tests, labs, categories…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="lt-search-input"
                />
                <button type="submit" className="lt-search-btn">Search</button>
              </form>
              <div className="lt-divider" />
              <select
                className="lt-sort-select"
                onChange={e => sortFilter(e.target.value)}
              >
                <option value="1">Latest</option>
                <option value="2">Price: High to Low</option>
                <option value="3">Price: Low to High</option>
              </select>
            </div>

            {/* Results info */}
            <div className="lt-results-info">
              <span className="lt-results-count">
                Showing <strong>{data.length}</strong> result{data.length !== 1 ? "s" : ""}
              </span>
            </div>

            <Labtest data={data} />
          </main>
        </div>
      </div>
    </>
  )
}