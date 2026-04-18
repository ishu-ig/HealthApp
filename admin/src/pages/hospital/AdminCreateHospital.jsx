import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import {
  createHospital,
  getHospital,
} from "../../Redux/ActionCreators/HospitalActionCreators";

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

export default function AdminCreateHospital() {
  let [data, setData] = useState({
    name: "",
    pic: "",
    emergencyContact:"",
    phone:"",
    email:"",
    accreditation:"",
    establishYear:"",
    address:"",
    state:"",
    city:"",
    pincode:"",
    active: true,
    departments: [], // added
  });
  let [error, setError] = useState({
    name: "Name Field is Mendatory",
    email: "Email Is Mendatory",
    phone: "Contact Is Mendatory",
    emergencyContact: "Emergency Contact Is Mendatory",
    accreditation: "Accreditataion Is Mendatoty",
    address: "Address Is Mendatory",
    city: "City Is Mendatory",
    state: "State IS Mendatory",
    pincode: "Pincode Is Mendatory",
    establishYear: "Establishment Year Is Mendatory",
    pic: "Pic Field is Mendatory",
    departments: "At least one Departments is Mandatory", // added
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let HospitalStateData = useSelector((state) => state.HospitalStateData);
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files[0] : e.target.value;

    // Handle departments checkboxes
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

    // ✅ NEW: Cross-validate phone and emergencyContact
    if (name === "phone") {
      const isSame = value === data.emergencyContact;
      setError((old) => ({
        ...old,
        phone: isSame
          ? "Contact and Emergency Contact cannot be same"
          : formValidator(e),
        emergencyContact: isSame
          ? "Contact and Emergency Contact cannot be same"
          : old.emergencyContact,
      }));
    } else if (name === "emergencyContact") {
      const isSame = value === data.phone;
      setError((old) => ({
        ...old,
        emergencyContact: isSame
          ? "Contact and Emergency Contact cannot be same"
          : formValidator(e),
        phone: isSame
          ? "Contact and Emergency Contact cannot be same"
          : old.phone,
      }));
    } else if (name !== "active") {
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
    if (errorItem) setShow(true);
    else {
      let item = HospitalStateData.find(
        (x) => x.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      );
      if (item) {
        setShow(true);
        setError((old) => {
          return { ...old, name: "Hospital Already Exist" };
        });
      } else {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("pic", data.pic);
        formData.append("active", data.active);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("accreditation", data.accreditation);
        formData.append("emergencyContact", data.emergencyContact);
        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("state", data.state);
        formData.append("pincode", data.pincode);
        formData.append("establishYear", data.establishYear);
        data.departments.forEach((dept) => {
          formData.append("departments", dept);
        });
        dispatch(createHospital(formData));
        navigate("/hospital");
      }
    }
  }

  useEffect(() => {
    (() => {
      dispatch(getHospital());
    })();
  }, [HospitalStateData.length]);

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
          Create Hospital{" "}
          <Link to="/Hospital">
            <i className="fa fa-arrow-left text-light float-end pt-1"></i>
          </Link>
        </h5>
        <form onSubmit={postSubmit}>
          <div className="card mt-3 shadow-sm p-4">
            <h4 className="text-center text-light bg-primary p-2">
              Personal Detail
            </h4>

            <div className="mb-3">
              <label className="fw-bold">Name*</label>
              <input
                type="text"
                name="name"
                onChange={getInputData}
                placeholder="Enter Hospital Name"
                className={`form-control ${show && error.name ? "border-danger" : "border-primary"}`}
              />
              {show && error.name && (
                <p className="text-danger mt-1">{error.name}</p>
              )}
            </div>
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
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Emmergency Contact*</label>
                <input
                  type="number"
                  name="emergencyContact"
                  onChange={getInputData}
                  className={`form-control ${show && error.emergencyContact ? "border-danger" : "border-primary"}`}
                />
                {show && error.emergencyContact && (
                  <p className="text-danger mt-1">{error.emergencyContact}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Accreditation*</label>
                <input
                  type="text"
                  name="accreditation"
                  onChange={getInputData}
                  className={`form-control ${show && error.accreditation ? "border-danger" : "border-primary"}`}
                />
                {show && error.accreditation && (
                  <p className="text-danger mt-1">{error.accreditation}</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Establishment Year*</label>
                <input
                  type="number"
                  name="establishYear"
                  placeholder="YYYY"
                  min="1900"
                  max="2100"
                  onChange={getInputData}
                  className={`form-control ${show && error.establishYear ? "border-danger" : "border-primary"}`}
                />
                {show && error.establishYear && (
                  <p className="text-danger mt-1">{error.establishYear}</p>
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

            {/* Departmentss Checkboxes */}
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
              <i className="fa fa-save"></i> Create Hospital
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
