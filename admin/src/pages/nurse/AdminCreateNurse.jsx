import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import {
  createNurse,
  getNurse,
} from "../../Redux/ActionCreators/NurseActionCreators";
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

const hospitalDepartmentss = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General Surgery",
  "Dermatology",
  "Radiology",
  "Oncology",
  "Psychiatry",
  "Endocrinology",
  "Ophthalmology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Urology",
  "Gynecology",
  "Obstetrics",
  "Dentistry",
  "Emergency Medicine",
  "Anesthesiology",
  "Pathology",
  "Hematology",
  "Rheumatology",
  "Immunology",
  "Infectious Disease",
  "Rehabilitation Medicine",
  "Plastic Surgery",
  "Internal Medicine",
  "Pharmacy",
  "Nutrition and Dietetics",
];

var rte;
export default function AdminCreateNurse() {
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
    clinicName: "", // ✅ added
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
    name: "Name Is Mendatory",
    pic: "Pic Is Mendatory",
    email: "Email Is Mendatory",
    phone: "Phone Is Mendatory",
    dob: "DOB Is Mendatory",
    bio: "Bio Is Mendatory",
    qualification: "Qualification Is Mandatory",
    availableTime: "Available Time Is Mendatory",
    experience:"Experience Is Mendatory",
    fees: "Fees Is Mendatory",
    pincode: "Pincode Is Medatory",
    city: "City Is Medatory",
    state: "State Is Mendatory",
    address: "Address Is Mendatory",
    availableDays: "Available Days Is Mendatory",
    clinicName: "", // ✅ added (empty by default, only required when Other is chosen)
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let NurseStateData = useSelector((state) => state.NurseStateData);
  let HospitalStateData = useSelector((state) => state.HospitalStateData);
  let SpecializationStateData = useSelector(
    (state) => state.SpecializationStateData,
  );
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
    if (name === "departments") {
      setData((old) => {
        const prevDepts = old.departments || [];
        const updatedDepts = e.target.checked
          ? [...prevDepts, value]
          : prevDepts.filter((d) => d !== value);
        return { ...old, departments: updatedDepts };
      });
      setError((old) => ({
        ...old,
        departments:
          e.target.checked || (data.departments || []).length > 1
            ? ""
            : "At least one Departments is Mandatory",
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
      setError((old) => {
        return {
          ...old,
          [name]: e.target.files ? imageValidator(e) : formValidator(e),
        };
      });
    }
    setData((old) => {
      return {
        ...old,
        [name]: name === "active" ? (value === "1" ? true : false) : value,
      };
    });
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
    if (errorItem) setShow(true);
    else {
      let item = (NurseStateData || []).find(
  (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
);
      if (item) {
        setShow(true);
        setError((old) => {
          return { ...old, name: "Nurse Already Exist" };
        });
      } else {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("active", data.active);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("dob", data.dob);
        formData.append("gender", data.gender);
        formData.append("qualification", data.qualification);
        (data.departments || []).forEach((dept) => {
          formData.append("departments", dept);
        });
        // ✅ if Other, send clinicName as hospital value
        formData.append(
          "hospital",
          data.hospital === "other" ? data.clinicName : data.hospital,
        );
        formData.append("address", data.address);
        formData.append("experience",data.experience)
        formData.append("city", data.city);
        formData.append("state", data.state);
        formData.append("pincode", data.pincode);
        formData.append("availableTime", data.availableTime);
        formData.append("fees", data.fees);
        formData.append("bio", rte ? rte.getHTMLCode() : data.bio);
        data.availableDays.forEach((day) => {
          formData.append("availableDays", day);
        });
        dispatch(createNurse(formData));
        navigate("/nurse");
      }
    }
  }

  useEffect(() => {
    (() => {
      dispatch(getSpecialization());
    })();
  }, [SpecializationStateData?.length]);

  useEffect(() => {
    (() => {
      dispatch(getHospital());
    })();
  }, [HospitalStateData?.length]);

  useEffect(() => {
    (() => {
      dispatch(getNurse());
    })();
  }, [NurseStateData?.length]);

  useEffect(() => {
    rte = new window.RichTextEditor(refdiv.current);
    rte.setHTMLCode("");
  }, []);

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
          Create Nurse{" "}
          <Link to="/Nurse">
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
                onChange={getInputData}
                placeholder="Enter Nurse Name"
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
                  value={data.dob}
                  name="dob"
                  onChange={getInputData}
                  className={`form-control ${show && error.dob ? "border-danger" : "border-primary"}`}
                />
                {show && error.dob && (
                  <p className="text-danger">{error.dob}</p>
                )}
              </div>
            </div>

            {/* Qualification & Available Time */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Qualification*</label>
                <input
                  type="text"
                  name="qualification"
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
                  onChange={getInputData}
                  className={`form-control ${show && error.experience ? "border-danger" : "border-primary"}`}
                />
                {show && error.experience && (
                  <p className="text-danger mt-1">{error.experience}</p>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Fees*</label>
                <input
                  type="number"
                  name="fees"
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
                  onChange={getInputData}
                  className={`form-control ${show && error.availableTime ? "border-danger" : "border-primary"}`}
                />
                {show && error.availableTime && (
                  <p className="text-danger mt-1">{error.availableTime}</p>
                )}
              </div>
            </div>

            {/* Fees, Pic, Active */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Hospital*</label>
                <select
                  name="hospital"
                  onChange={getInputData}
                  className={`form-select ${show && error.hospital ? "border-danger" : "border-primary"}`}
                >
                  <option value="">Select Hospital</option>
                  {HospitalStateData.filter((x) => x.active).map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                  <option value="other">Other (Private Clinic)</option>{" "}
                  {/* ✅ */}
                </select>
                {show && error.hospital && (
                  <p className="text-danger mt-1">{error.hospital}</p>
                )}
              </div>
              <div className="col-md-4 mb-3">
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
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Active</label>
                <select
                  name="active"
                  onChange={getInputData}
                  className="form-select border-primary"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            {/* ✅ Clinic Name — only shown when Other is selected */}
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
            <div className="mb-3">
              <label className="form-label fw-bold">Departmentss*</label>
              <div
                className={`border p-3 rounded ${show && error.departments ? "border-danger" : "border-primary"}`}
              >
                <div className="d-flex flex-wrap">
                  {hospitalDepartmentss.map((item) => (
                    <div key={item} className="form-check me-4">
                      <input
                        type="checkbox"
                        name="departments"
                        value={item}
                        className="form-check-input"
                        onChange={getInputData}
                        checked={(data.departments || []).includes(item)}
                      />
                      <label className="form-check-label">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              {show && error.departments && (
                <p className="text-danger text-capitalize">
                  {error.departments}
                </p>
              )}
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
              <i className="fa fa-save"></i> Create Nurse
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
