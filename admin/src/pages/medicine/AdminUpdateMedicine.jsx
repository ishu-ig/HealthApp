import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";

import {
  updateMedicine,
  getMedicine,
} from "../../Redux/ActionCreators/MedicineActionCreators";
import { getMedicineCategory } from "../../Redux/ActionCreators/MedicineCategoryActionCreators";
import { getManufacturer } from "../../Redux/ActionCreators/ManufacturerActionCreators";

var rte;

export default function AdminUpdateMedicine() {
  let { _id } = useParams();
  var refdiv = useRef(null);

  let [oldPics, setOldPics] = useState([]);
  let [flag, setFlag] = useState(false);

  let [data, setData] = useState({
    name: "",
    medicineCategory: "",
    basePrice: "",
    discount: "",
    finalPrice: "",
    stock: true,
    stockQuantity: "",
    description: "",
    expireDate: "",
    manufacturer: "",
    pic: [],
    active: true,
  });

  let [error, setError] = useState({
    name: "",
    basePrice: "",
    discount: "",
    finalPrice: "",
    stockQuantity: "",
    expireDate: "",
    pic: "",
  });
  let [show, setShow] = useState(false);

  let navigate = useNavigate();

  let MedicineStateData = useSelector((state) => state.MedicineStateData);
  let MedicineCategoryStateData = useSelector(
    (state) => state.MedicineCategoryStateData,
  );
  let ManufacturerStateData = useSelector(
    (state) => state.ManufacturerStateData,
  );

  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files : e.target.value;

    if (name !== "active") {
      setError((old) => ({
        ...old,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }

    setData((old) => ({
      ...old,
      [name]: name === "active" || name === "stock" ? value === "1" : value,
    }));
  }

  function postSubmit(e) {
    e.preventDefault();

    let errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) {
      setShow(true);
    } else {
      let bp = parseInt(data.basePrice);
      let d = parseInt(data.discount);
      let fp = parseInt(bp - (bp * d) / 100);

      let formData = new FormData();

      formData.append("_id", data._id);
      formData.append("name", data.name);

      formData.append(
        "medicineCategory",
        typeof data.medicineCategory === "object"
          ? data.medicineCategory._id
          : data.medicineCategory,
      );

      formData.append(
        "manufacturer",
        typeof data.manufacturer === "object"
          ? data.manufacturer._id
          : data.manufacturer,
      );

      formData.append("basePrice", bp);
      formData.append("discount", d);
      formData.append("finalPrice", fp);
      formData.append("stock", data.stock);
      formData.append("stockQuantity", parseInt(data.stockQuantity));
      formData.append("description", rte.getHTMLCode());
      formData.append("expireDate", data.expireDate);
      formData.append("active", data.active);

      formData.append("oldPics", oldPics);

      Array.from(data.pic).forEach((file) => {
        formData.append("pic", file);
      });

      dispatch(updateMedicine(formData));
      navigate("/medicine");
    }
  }

  // Load data
  useEffect(() => {
    dispatch(getMedicine());
    dispatch(getMedicineCategory());
    dispatch(getManufacturer());
  }, []);

  useEffect(() => {
    if (MedicineStateData.length) {
      let item = MedicineStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          ...item,
          medicineCategory: item.medicineCategory?._id || item.medicineCategory,
          manufacturer: item.manufacturer?._id || item.manufacturer,
        });
        setOldPics(item.pic || []);

        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode(item.description);
      }
    }
  }, [MedicineStateData.length]);

  return (
    <>
      <div className="container">
        <h5 className="bg-primary text-light text-center p-2">
          Update Medicine
          <Link to="/medicine">
            <i className="fa fa-arrow-left float-end text-light"></i>
          </Link>
        </h5>

        <div className="card p-4 mt-3">
          <form onSubmit={postSubmit}>
            <div className="mb-3">
              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={getInputData}
                placeholder="Medicine Name"
                className={`form-control border-3 ${show && error.name ? "border-danger" : "border-primary"}`}
              />
              {show && error.name ? (
                <p className="text-danger text-capitalize">{error.name}</p>
              ) : null}
            </div>

            <div className="row">
              <div className="col-md-4">
                <label>Medicine Category</label>
                <select
                  name="medicineCategory"
                  onChange={getInputData}
                  value={data.medicineCategory}
                  className="form-select mb-3 border-3 border-primary"
                >
                  <option value="">Select Medicine Category</option>

                  {MedicineCategoryStateData &&
                    MedicineCategoryStateData.filter((x) => x.active).map(
                      (x) => (
                        <option key={x._id} value={x._id}>
                          {x.name}
                        </option>
                      ),
                    )}
                </select>
              </div>

              <div className="col-md-4">
                <label>Manufacturer</label>
                <select
                  name="manufacturer"
                  onChange={getInputData}
                  value={data.manufacturer}
                  className="form-select mb-3 border-3 border-primary"
                >
                  <option value="">Select Manufacturer</option>

                  {ManufacturerStateData &&
                    ManufacturerStateData.filter((x) => x.active).map((x) => (
                      <option key={x._id} value={x._id}>
                        {x.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Stock*</label>
                <select
                  name="stock"
                  onChange={getInputData}
                  value={data.stock ? "1" : "0"}
                  className="form-select border-3 border-primary"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Base Price*</label>
                <input
                  type="number"
                  name="basePrice"
                  value={data.basePrice}
                  onChange={getInputData}
                  placeholder="Medicine Base Price"
                  className={`form-control border-3 ${show && error.basePrice ? "border-danger" : "border-primary"}`}
                />
                {show && error.basePrice ? (
                  <p className="text-danger text-capitalize">
                    {error.basePrice}
                  </p>
                ) : null}
              </div>
              <div className="col-md-6 mb-3">
                <label>Discount*</label>
                <input
                  type="number"
                  name="discount"
                  value={data.discount}
                  onChange={getInputData}
                  placeholder="Medicine Discount"
                  className={`form-control border-3 ${show && error.discount ? "border-danger" : "border-primary"}`}
                />
                {show && error.discount ? (
                  <p className="text-danger text-capitalize">
                    {error.discount}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label>Description*</label>
              <div ref={refdiv} className="border-3 border-primary"></div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Stock Quantity*</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={data.stockQuantity}
                  onChange={getInputData}
                  placeholder="Medicine Stock Quantity"
                  className={`form-control border-3 ${show && error.stockQuantity ? "border-danger" : "border-primary"}`}
                />
                {show && error.stockQuantity ? (
                  <p className="text-danger text-capitalize">
                    {error.stockQuantity}
                  </p>
                ) : null}
              </div>
              <div className="col-md-6 mb-3">
                <label>Pic</label>
                <input
                  type="file"
                  name="pic"
                  multiple
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.pic ? "border-danger" : "border-primary"}`}
                />
                {show && error.pic ? (
                  typeof error.pic === "string" ? (
                    <p className="text-danger text-capitalize">{error.pic}</p>
                  ) : (
                    error.pic.map((err, index) => {
                      return (
                        <p key={index} className="text-danger text-capitalize">
                          {err}
                        </p>
                      );
                    })
                  )
                ) : null}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Expire Date*</label>
                <input
                  type="date"
                  name="expireDate"
                  value={data.expireDate}
                  onChange={getInputData}
                  className={`form-control border-3 border-primary ${show && error.expireDate ? "border-danger" : "border-primary"}`}
                />
                {show && error.expireDate ? (
                  <p className="text-danger text-capitalize">
                    {error.expireDate}
                  </p>
                ) : null}
              </div>
              <div className="col-md-6 mb-3">
                <label>Active*</label>
                <select
                  name="active"
                  onChange={getInputData}
                  value={data.active ? "1":"0"}
                  className="form-select border-3 border-primary"
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="btn text-light btn-primary w-100"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
