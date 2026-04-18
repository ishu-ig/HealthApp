import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import {
  updateManufacturer,
  getManufacturer,
} from "../../Redux/ActionCreators/ManufacturerActionCreators";

export default function AdminUpdateManufacturer() {
  // let { id } = useParams()

  let { _id } = useParams();
  //   console.log(_id);
  // console.log(_id)

  let [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    establishedYear: "",
    website: "",
    certifications: [],
    active: true,
  });

  let [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let ManufacturerStateData = useSelector(
    (state) => state.ManufacturerStateData,
  );
  let MedicineStateData = useSelector(
    (state) => state.MedicineStateData,
  );
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files[0] : e.target.value;

    if (name !== "active") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }

    // ✅ Use e.target.value directly, not the already-computed `value`
    if (name === "certifications") {
      value = e.target.value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""); // prevents [""] on empty input
    }

    setData((old) => ({
      ...old,
      [name]: name === "active" ? (value === "1" ? true : false) : value,
    }));
  }
  function postSubmit(e) {
    e.preventDefault();
    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) setShow(true);
    else {
      let item = ManufacturerStateData.find(
        (x) =>
          x._id !== _id &&
          x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      ); // in case of real backend
      // let item = ManufacturerStateData.find(x => x._id !== id && x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase())
      if (item) {
        setShow(true);
        setError((old) => {
          return {
            ...old,
            name: "Manufacturer Already Exist",
          };
        });
      } else {
        // dispatch(updateManufacturer({ ...data }))
        //in case of real backend and form has a file field
        dispatch(
          updateManufacturer({
            ...data,
            _id: _id,
          }),
        );
        navigate("/manufacturer");
      }
    }
  }

  useEffect(() => {
    (() => {
      dispatch(getManufacturer());
      if (ManufacturerStateData.length) {
        // let item = ManufacturerStateData.find(x => x._id === id)
        let item = ManufacturerStateData.find((x) => x._id === _id);
        if (item) setData({ ...item });
      }
    })();
  }, [ManufacturerStateData.length]);

  const apiKey = "e04b543b846f4fb187b19c00fe5a29af";

  async function getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`,
            );
            const result = await response.json();
            if (result.features?.length > 0) {
              const place = result.features[0].properties;
              setData((prev) => ({
                ...prev,
                address: place.address_line1 || "",
                city: place.city || place.town || place.village || "",
                state: place.state || "",
                pincode: place.postcode || "",
              }));
            }
          } catch {
            setShow(true);
            setError((old) => ({ ...old, address: "Failed to fetch address" }));
          }
        },
        () => {
          setShow(true);
          setError((old) => ({
            ...old,
            address: "Location permission denied",
          }));
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setShow(true);
      setError((old) => ({ ...old, address: "Geolocation not supported" }));
    }
  }
  return (
    <>
      <div className="container">
        <h5 className="text-center text-light bg-primary p-2">
          Update Manufacturer{" "}
          <Link to="/Manufacturer">
            <i className="fa fa-arrow-left text-light float-end pt-1"></i>
          </Link>
        </h5>
        {/* Form */}
        <form onSubmit={postSubmit}>
          <div className="card mt-3 shadow-sm p-4">
            {/* Name */}
            <div className="mb-3">
              <label className="fw-bold">Name*</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={getInputData}
                className={`form-control ${show && error.name ? "border-danger" : "border-primary"}`}
              />
              {show && error.name && (
                <p className="text-danger">{error.name}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="mb-3">
              <label className="fw-bold">Company Name*</label>
              <input
                type="text"
                name="companyName"
                value={data.companyName}
                onChange={getInputData}
                className={`form-control ${show && error.companyName ? "border-danger" : "border-primary"}`}
              />
              {show && error.companyName && (
                <p className="text-danger">{error.companyName}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={getInputData}
                  className={`form-control ${show && error.email ? "border-danger" : "border-primary"}`}
                />
                {show && error.email && (
                  <p className="text-danger">{error.email}</p>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold">Phone*</label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={getInputData}
                  className={`form-control ${show && error.phone ? "border-danger" : "border-primary"}`}
                />
                {show && error.phone && (
                  <p className="text-danger">{error.phone}</p>
                )}
              </div>
            </div>

            {/* License & GST */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">License Number*</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={data.licenseNumber}
                  onChange={getInputData}
                  className={`form-control ${show && error.licenseNumber ? "border-danger" : "border-primary"}`}
                />
                {show && error.licenseNumber && (
                  <p className="text-danger">{error.licenseNumber}</p>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold">GST Number*</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={data.gstNumber}
                  onChange={getInputData}
                  className={`form-control ${show && error.gstNumber ? "border-danger" : "border-primary"}`}
                />
                {show && error.gstNumber && (
                  <p className="text-danger">{error.gstNumber}</p>
                )}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={data.establishedYear}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold">Website</label>
                <input
                  type="text"
                  name="website"
                  value={data.website}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-3">
              <label className="fw-bold">Certifications</label>
              <input
                type="text"
                name="certifications"

                value={
                  Array.isArray(data.certifications)
                    ? data.certifications.join(",")
                    : ""
                }
                onChange={getInputData}
                className="form-control border-primary"
              />
            </div>

            {/* Active */}
            <div className="mb-3">
              <label className="fw-bold">Active</label>
              <select
                name="active"
                value={data.active ? "1" : "0"}
                onChange={getInputData}
                className="form-select border-primary"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="card mt-3 shadow-sm p-4">
            <h4 className="text-center text-light bg-primary p-2">
              Address Detail
            </h4>
            <div className="mb-3">
              <label>Address</label>
              <div className="btn-group w-100">
                <input
                  type="text"
                  name="address"
                  placeholder="Address....."
                  value={data.address}
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.address ? "border-danger" : "border-primary"}`}
                />
                <button
                  type="button"
                  className="btn btn-primary text-light"
                  onClick={getLocation}
                >
                  Get Location
                </button>
              </div>
              {show && error.address && (
                <p className="text-danger text-capitalize">{error.address}</p>
              )}
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={data.state}
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.state ? "border-danger" : "border-primary"}`}
                />
                {show && error.state && (
                  <p className="text-danger text-capitalize">{error.state}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={data.city}
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.city ? "border-danger" : "border-primary"}`}
                />
                {show && error.city && (
                  <p className="text-danger text-capitalize">{error.city}</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Pincode</label>
                <input
                  type="number"
                  name="pincode"
                  placeholder="Pincode"
                  value={data.pincode}
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.pincode ? "border-danger" : "border-primary"}`}
                />
                {show && error.pincode && (
                  <p className="text-danger text-capitalize">{error.pincode}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={data.country}
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.country ? "border-danger" : "border-primary"}`}
                />
                {show && error.country && (
                  <p className="text-danger text-capitalize">{error.country}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-3 pt-3">
            <button type="submit" className="btn btn-primary w-100 text-light">
              <i className="fa fa-save"></i> Update Manufacturer
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
