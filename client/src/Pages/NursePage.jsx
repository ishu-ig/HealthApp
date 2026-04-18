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

  useEffect(() => {
    dispatch(getNurse());
  }, [dispatch]);

  useEffect(() => {
    if (NurseStateData.length) {
      const activeData = NurseStateData.filter((x) => x.active);
      setData(activeData);
    }
  }, [NurseStateData]);

  const postSearch = (e) => {
    e.preventDefault();
    const ch = search.toLowerCase();
    const filtered = NurseStateData.filter(
      (x) =>
        x.active &&
        (x.name?.toLowerCase().includes(ch) ||
          x.description?.toLowerCase().includes(ch) ||
          x.specialization?.toLowerCase().includes(ch))
    );
    setData(filtered);
  };

  const sortFilter = (option) => {
    let sorted = [...data];
    if (option === '1') {
      sorted.sort((x, y) => y._id.toString().localeCompare(x._id.toString()));
    } else if (option === '2') {
      sorted.sort((x, y) => Number(y.fees) - Number(x.fees));
    } else {
      sorted.sort((x, y) => Number(x.fees) - Number(y.fees));
    }
    setData(sorted);
  };

  const filter = (minVal = -1, maxVal = -1) => {
    setSearch('');
    const filtered = NurseStateData.filter((p) => {
      const price = Number(p.fees);
      return (
        p.active &&
        (minVal === -1 || price >= minVal) &&
        (maxVal === -1 || price <= maxVal)
      );
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

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Price Filter Sidebar */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white text-center fw-semibold">
                Filter by Price
              </div>
              <div className="card-body">
                <form onSubmit={applyPriceFilter}>
                  <div className="mb-3">
                    <label className="form-label">Minimum Price</label>
                    <input
                      type="number"
                      name="min"
                      value={min}
                      placeholder="Enter min price"
                      onChange={(e) => setMin(e.target.value)}
                      className="form-control border-primary"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Maximum Price</label>
                    <input
                      type="number"
                      name="max"
                      value={max}
                      placeholder="Enter max price"
                      onChange={(e) => setMax(e.target.value)}
                      className="form-control border-primary"
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-funnel-fill me-2"></i>Apply Filter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="row mb-4">
              {/* Search Box */}
              <div className="col-md-9 mb-2">
                <form onSubmit={postSearch}>
                  <div className="input-group">
                    <input
                      type="search"
                      name="search"
                      placeholder="Search by name, specialization..."
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      className="form-control border-primary"
                    />
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Sort Filter */}
              <div className="col-md-3 mb-2">
                <select
                  name="sortFilter"
                  onChange={(e) => sortFilter(e.target.value)}
                  className="form-select border-primary"
                >
                  <option value="1">Latest</option>
                  <option value="2">Price : High to Low</option>
                  <option value="3">Price : Low to High</option>
                </select>
              </div>
            </div>

            {/* Nurse Cards */}
            <Nurse data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
