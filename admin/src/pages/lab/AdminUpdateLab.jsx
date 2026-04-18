import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import {
  updateLab,
  getLab,
} from "../../Redux/ActionCreators/LabActionCreators";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function AdminUpdateLab() {
  let { _id } = useParams();

  console.log(_id)
  let [data, setData] = useState({
    name: "",
    pic: "",
    availableDays: [],
    openingTime: "",
    closingTime: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    active: true,
  });
  let [error, setError] = useState({
    name: "",
    pic: "",
    availableDays: "",
    openingTime: "",
    closingTime: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let LabStateData = useSelector((state) => state.LabStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files[0] : e.target.value;

    // Handle availableDays checkboxes
    if (name === "availableDays") {
      setData((old) => {
        const prevDays = old.availableDays || [];
        const updatedDays = e.target.checked
          ? [...prevDays, value]
          : prevDays.filter((d) => d !== value);
        return { ...old, availableDays: updatedDays };
      });
      setError((old) => ({
        ...old,
        availableDays:
          e.target.checked || (data.availableDays || []).length > 1
            ? ""
            : "At least one Available Day is Mandatory",
      }));
      return;
    }

    if (name !== "active") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }
    setData((old) => ({
      ...old,
      [name]: name === "active" ? (value === "1" ? true : false) : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();

    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      // ✅ exclude current record from duplicate name check
      let item = LabStateData.find(
        (x) =>
          x._id !== _id &&
          x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Lab Already Exist" }));
      } else {
        let formData = new FormData();
        formData.append("_id", data._id);
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("active", data.active);

        formData.append("openingTime", data.openingTime);
        formData.append("closingTime", data.closingTime);

        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("state", data.state);
        formData.append("pin", data.pin);

        // availableDays (array)
        data.availableDays.forEach((day) => {
          formData.append("availableDays", day);
        });
        dispatch(updateLab(formData));
        navigate("/lab");
      }
    }
  }

  // ✅ single useEffect — fetch Labs and prefill form
  useEffect(() => {
    (() => {
      dispatch(getLab());
      if (LabStateData.length) {
        let item = LabStateData.find((x) => x._id === _id);
        if (item)
          setData({
            ...item,
          });
      }
    })();
  }, [LabStateData?.length]);

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
          Update Lab{" "}
          <Link to="/Lab">
            <i className="fa fa-arrow-left text-light float-end pt-1"></i>
          </Link>
        </h5>
        <form onSubmit={postSubmit}>
          <div className="card mt-3 shadow-sm p-4">
            <h4 className="text-center text-light bg-primary p-2">
              Lab Detail
            </h4>

            {/* Name */}
            <div className="mb-3">
              <label className="fw-bold">Name*</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={getInputData}
                placeholder="Enter Lab Name"
                className={`form-control ${show && error.name ? "border-danger" : "border-primary"}`}
              />
            </div>

            {/* Opening & Closing Time */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Opening Time*</label>
                <input
                  type="text"
                  name="openingTime"
                  value={data.openingTime}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Closing Time*</label>
                <input
                  type="text"
                  name="closingTime"
                  value={data.closingTime}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
            </div>

            {/* Pic & Active */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Upload Picture*</label>
                <input
                  type="file"
                  name="pic"
                  onChange={getInputData}
                  className={`form-control ${show && error.pic ? "border-danger" : "border-primary"}`}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Active</label>
                <select
                  name="active"
                  onChange={getInputData}
                  value={data.active ? "1" : "0"}
                  className="form-select border-primary"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            {/* Available Days */}
            <div className="mb-3">
              <label className="form-label fw-bold">Available Days*</label>
              <div
                className={`border p-3 rounded ${show && error.availableDays ? "border-danger" : "border-primary"}`}
              >
                <div className="d-flex flex-wrap">
                  {weekDays.map((item) => (
                    <div key={item} className="form-check me-4">
                      <input
                        type="checkbox"
                        name="availableDays"
                        value={item}
                        className="form-check-input"
                        onChange={getInputData}
                        checked={(data.availableDays || []).includes(item)}
                      />
                      <label className="form-check-label">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="card mt-3 shadow-sm p-4">
            <h4 className="text-center text-light bg-primary p-2">
              Address Detail
            </h4>

            <div className="mb-3">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={getInputData}
                className="form-control border-primary"
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={data.state}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={data.city}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={data.pincode}
                  onChange={getInputData}
                  className="form-control border-primary"
                />
              </div>
            </div>
          </div>

          <div className="mb-3 pt-3">
            <button type="submit" className="btn btn-primary w-100 text-light">
              <i className="fa fa-save"></i> Update Lab
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
