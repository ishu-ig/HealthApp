import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";

import { createMedicine } from "../../Redux/ActionCreators/MedicineActionCreators";
import { getMedicineCategory } from "../../Redux/ActionCreators/MedicineCategoryActionCreators";
import { getManufacturer } from "../../Redux/ActionCreators/ManufacturerActionCreators";
var rte;

export default function AdminCreateMedicine() {
  var refdiv = useRef(null);

  let [data, setData] = useState({
    name: "",
    medicineCategory: "",
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    stock: true,
    stockQuantity: 0,
    description: "",
    expireDate: "",
    manufacturer: "",
    pic: [],
    active: true,
  });
  let [error, setError] = useState({
    name: "Name Field is Mendatory",
    expireDate: "Expire Date Field is Mendatory",
    basePrice: "Base Price Field is Mendatory",
    discount: "Discount Field is Mendatory",
    stockQuantity: "Stock Quantity Field is Mendatory",
    expireDate: "Expire date Field is Mendatory",
    Manufacturer: "Manuafacturer Field is Mendatory",
    pic: "Pic Field is Mendatory",
  });
  let [show, setShow] = useState(false);
  let navigate = useNavigate();

  let MedicineCategoryStateData = useSelector(
    (state) => state.MedicineCategoryStateData,
  );
  let ManufacturerStateData = useSelector(
    (state) => state.ManufacturerStateData,
  );
  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files : e.target.value; //in case of real backend
    // let value = e.target.files ? Array.from(e.target.files).map(x => "Medicine/" + x.name) : e.target.value

    if (name !== "active" || "stock") {
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
        [name]:
          name === "active" || name === "stock"
            ? value === "1"
              ? true
              : false
            : value,
      };
    });
  }
  function postSubmit(e) {
    e.preventDefault();
    let errorItem = Object.values(error).find((x) => x !== "");
    console.log(errorItem);
    if (errorItem) setShow(true);
    else {
      let bp = parseInt(data.basePrice);
      let d = parseInt(data.discount);
      let fp = parseInt(bp - (bp * d) / 100);
      let stockQuantity = parseInt(data.stockQuantity);

      // dispatch(createMedicine({
      //     ...data,
      //     'MedicineCategory': data.MedicineCategory ? data.MedicineCategory : MedicineCategoryStateData[0].name,
      //     'Manufacturer': data.Manufacturer ? data.Manufacturer : ManufacturerStateData[0].name,
      //     'brand': data.brand ? data.brand : BrandStateData[0].name,
      //     'basePrice': bp,
      //     'discount': d,
      //     'finalPrice': fp,
      //     'stockQuantity': stockQuantity,
      //     'description': rte.getHTMLCode()
      // }))

      // //in case of real backend and form has a file field
      let formData = new FormData();
      formData.append("name", data.name);
      formData.append(
        "MedicineCategory",
        data.medicineCategory
          ? data.medicineCategory
          : MedicineCategoryStateData[0]._id,
      );
      formData.append(
        "Manufacturer",
        data.manufacturer ? data.manufacturer : ManufacturerStateData[0]._id,
      );
      formData.append("basePrice", bp);
      formData.append("discount", d);
      formData.append("finalPrice", fp);
      formData.append("stock", data.stock);
      formData.append("stockQuantity", stockQuantity);
      formData.append("description", rte.getHTMLCode());
      formData.append("expireDate", data.expireDate);
      formData.append(
        "medicineCategory",
        data.medicineCategory || MedicineCategoryStateData[0]._id,
      );
      formData.append(
        "manufacturer",
        data.manufacturer || ManufacturerStateData[0]._id,
      );
      formData.append("active", data.active);
      Array.from(data.pic).forEach((x) => {
        formData.append("pic", x);
      });
      dispatch(createMedicine(formData));

      navigate("/medicine");
    }
  }

  useEffect(() => {
    rte = new window.RichTextEditor(refdiv.current);
    rte.setHTMLCode("");
  }, []);
  useEffect(() => {
    (() => {
      dispatch(getMedicineCategory());
    })();
  }, [MedicineCategoryStateData.length]);

  useEffect(() => {
    (() => {
      dispatch(getManufacturer());
    })();
  }, [ManufacturerStateData.length]);

  return (
    <>
      <div>
        <h5 className="bg-primary text-light text-center p-2">
          Medicine{" "}
          <Link to="/medicine">
            <i className="fa fa-arrow-left text-light float-end"></i>
          </Link>
        </h5>
        <div className="card mt-3 shadow-sm p-4">
          <form onSubmit={postSubmit}>
            <div className="mb-3">
              <label>Name*</label>
              <input
                type="text"
                name="name"
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
                <label>Pic*</label>
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
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
