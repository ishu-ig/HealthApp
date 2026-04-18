import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import {
  updateDoctor,
  getDoctor,
} from "../../Redux/ActionCreators/DoctorActionCreators";
import { getSpecialization } from "../../Redux/ActionCreators/SpecializationActionCreators";
import { getHospital } from "../../Redux/ActionCreators/HospitalActionCreators";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var rte;
export default function AdminUpdateDoctor() {
  let { _id } = useParams();
  var refdiv = useRef(null);

  let [data, setData] = useState({
    name: "",
    pic: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    bio: "",
    specialization: "",
    hospital: "",
    clinicName: "",
    availableDays: [],
    qualification: "",
    availableTime: "",
    experience: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    fees: "",
    active: true,
  });

  let [error, setError] = useState({
    name: "",
    pic: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
    qualification: "",
    availableTime: "",
    experience: "",
    fees: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
    availableDays: "",
    hospital: "",          // ✅ mandatory
    specialization: "",    // ✅ mandatory
    clinicName: "",
  });

  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let DoctorStateData = useSelector((state) => state.DoctorStateData);
  let HospitalStateData = useSelector((state) => state.HospitalStateData);
  let SpecializationStateData = useSelector((state) => state.SpecializationStateData);
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

    // Handle hospital — reset clinicName when hospital changes
    if (name === "hospital") {
      setError((old) => ({
        ...old,
        hospital: value ? "" : "Hospital is Mandatory",
        clinicName: "",
      }));
      setData((old) => ({ ...old, hospital: value, clinicName: "" }));
      return;
    }

    // Handle specialization
    if (name === "specialization") {
      setError((old) => ({
        ...old,
        specialization: value ? "" : "Specialization is Mandatory",
      }));
      setData((old) => ({ ...old, specialization: value }));
      return;
    }

    // Handle clinicName
    if (name === "clinicName") {
      setError((old) => ({
        ...old,
        clinicName: value.trim() ? "" : "Clinic Name is Mandatory",
      }));
      setData((old) => ({ ...old, clinicName: value }));
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

    // If hospital is "other", clinicName must be filled
    if (data.hospital === "other" && !data.clinicName.trim()) {
      setShow(true);
      setError((old) => ({ ...old, clinicName: "Clinic Name is Mandatory" }));
      return;
    }

    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      // ✅ exclude current record from duplicate name check
      let item = DoctorStateData.find(
        (x) =>
          x._id !== _id &&
          x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      );
      if (item) {
        setShow(true);
        setError((old) => ({ ...old, name: "Doctor Already Exist" }));
      } else {
        let formData = new FormData();
        formData.append("_id", data._id);   // ✅ _id from data (set via useEffect)
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("active", data.active);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("dob", data.dob);
        formData.append("gender", data.gender);
        formData.append("qualification", data.qualification);
        formData.append("specialization", data.specialization);
        formData.append(
          "hospital",
          data.hospital === "other" ? data.clinicName : data.hospital,
        );
        formData.append("address", data.address);
        formData.append("experience", data.experience);
        formData.append("city", data.city);
        formData.append("state", data.state);
        formData.append("pincode", data.pincode);
        formData.append("availableTime", data.availableTime);
        formData.append("fees", data.fees);
        formData.append("bio", rte ? rte.getHTMLCode() : data.bio);
        (data.availableDays || []).forEach((day) => {
          formData.append("availableDays", day);
        });
        dispatch(updateDoctor(formData));
        navigate("/Doctor");
      }
    }
  }

  useEffect(() => {
    dispatch(getSpecialization());
  }, [SpecializationStateData.length]);

  useEffect(() => {
    dispatch(getHospital());
  }, [HospitalStateData.length]);

  // ✅ single useEffect — fetch doctors and prefill form
  useEffect(() => {
        (() => {
            dispatch(getDoctor())
            if (DoctorStateData.length) {
                let item = DoctorStateData.find(x => x._id === _id)
                if (item)
                    setData({
                        ...item,
                        specialization: item.specialization._id,
                        hospital: item.hospital._id,
                    })
                rte = new window.RichTextEditor(refdiv.current);
                rte.setHTMLCode(item.bio);
                // console.log(item)

            }
        })()
    }, [DoctorStateData.length])

  

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
          setError((old) => ({ ...old, address: "Location permission denied" }));
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
          Update Doctor{" "}
          <Link to="/Doctor">
            <i className="fa fa-arrow-left text-light float-end pt-1"></i>
          </Link>
        </h5>
        <form onSubmit={postSubmit}>
          <div className="card mt-3 shadow-sm p-4">
            <h4 className="text-center text-light bg-primary p-2">
              Personal Detail
            </h4>

            {/* Name */}
            <div className="mb-3">
              <label className="fw-bold">Name*</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={getInputData}
                placeholder="Enter Doctor Name"
                className={`form-control ${show && error.name ? "border-danger" : "border-primary"}`}
              />
              {show && error.name && (
                <p className="text-danger mt-1">{error.name}</p>
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
                  <p className="text-danger mt-1">{error.email}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Contact Number*</label>
                <input
                  type="number"
                  name="phone"
                  value={data.phone}
                  onChange={getInputData}
                  className={`form-control ${show && error.phone ? "border-danger" : "border-primary"}`}
                />
                {show && error.phone && (
                  <p className="text-danger mt-1">{error.phone}</p>
                )}
              </div>
            </div>

            {/* Gender & DOB */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Gender</label>
                <select
                  name="gender"
                  value={data.gender}
                  className="form-select border-primary"
                  onChange={getInputData}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">DOB*</label>
                <input
                  type="date"
                  value={data.dob ? data.dob.toString().slice(0, 10) : ""}
                  name="dob"
                  onChange={getInputData}
                  className={`form-control ${show && error.dob ? "border-danger" : "border-primary"}`}
                />
                {show && error.dob && (
                  <p className="text-danger">{error.dob}</p>
                )}
              </div>
            </div>

            {/* Qualification & Experience */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Qualification*</label>
                <input
                  type="text"
                  name="qualification"
                  value={data.qualification}
                  onChange={getInputData}
                  className={`form-control ${show && error.qualification ? "border-danger" : "border-primary"}`}
                />
                {show && error.qualification && (
                  <p className="text-danger mt-1">{error.qualification}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Experience*</label>
                <input
                  type="number"
                  name="experience"
                  value={data.experience}
                  onChange={getInputData}
                  className={`form-control ${show && error.experience ? "border-danger" : "border-primary"}`}
                />
                {show && error.experience && (
                  <p className="text-danger mt-1">{error.experience}</p>
                )}
              </div>
            </div>

            {/* Fees & Available Time */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Fees*</label>
                <input
                  type="number"
                  name="fees"
                  value={data.fees}
                  onChange={getInputData}
                  className={`form-control ${show && error.fees ? "border-danger" : "border-primary"}`}
                />
                {show && error.fees && (
                  <p className="text-danger mt-1">{error.fees}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Available Time*</label>
                <input
                  type="text"
                  name="availableTime"
                  value={data.availableTime}
                  onChange={getInputData}
                  className={`form-control ${show && error.availableTime ? "border-danger" : "border-primary"}`}
                />
                {show && error.availableTime && (
                  <p className="text-danger mt-1">{error.availableTime}</p>
                )}
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
                {show && error.pic && (
                  <p className="text-danger mt-1">{error.pic}</p>
                )}
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

            {/* Specialization & Hospital */}
            {/* ✅ fixed name casing: "specialization" and "hospital" (lowercase) */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Specialization*</label>
                <select
                  name="specialization"
                  onChange={getInputData}
                  value={data.specialization}
                  className={`form-select ${show && error.specialization ? "border-danger" : "border-primary"}`}
                >
                  <option value="">Select Specialization</option>
                  {SpecializationStateData.filter((x) => x.active).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {show && error.specialization && (
                  <p className="text-danger mt-1">{error.specialization}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Hospital*</label>
                <select
                  name="hospital"
                  value={data.hospital}
                  onChange={getInputData}
                  className={`form-select ${show && error.hospital ? "border-danger" : "border-primary"}`}
                >
                  <option value="">Select Hospital</option>
                  {HospitalStateData.filter((x) => x.active).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                  <option value="other">Other (Private Clinic)</option>
                </select>
                {show && error.hospital && (
                  <p className="text-danger mt-1">{error.hospital}</p>
                )}
              </div>
            </div>

            {/* Clinic Name — only when Other is selected */}
            {data.hospital === "other" && (
              <div className="mb-3">
                <label className="fw-bold">Clinic Name*</label>
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Enter Clinic Name"
                  value={data.clinicName}
                  onChange={getInputData}
                  className={`form-control ${show && error.clinicName ? "border-danger" : "border-primary"}`}
                />
                {show && error.clinicName && (
                  <p className="text-danger mt-1">{error.clinicName}</p>
                )}
              </div>
            )}

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
              {show && error.availableDays && (
                <p className="text-danger text-capitalize">
                  {error.availableDays}
                </p>
              )}
            </div>

            {/* Bio - Rich Text Editor */}
            <div className="mb-3">
              <label>Bio*</label>
              <div ref={refdiv} className="border-primary"></div>
            </div>
          </div>

          {/* Address Card */}
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
              <div className="col-md-4 mb-3">
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
              <div className="col-md-4 mb-3">
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
              <div className="col-md-4 mb-3">
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
            </div>
          </div>

          <div className="mb-3 pt-3">
            <button type="submit" className="btn btn-primary w-100 text-light">
              <i className="fa fa-save"></i> Update Doctor
            </button>
          </div>
        </form>
      </div>
    </>
  );
}