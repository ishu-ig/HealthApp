import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";

import {
  updateLabtest,
  getLabtest,
} from "../../Redux/ActionCreators/LabtestActionCreators";
import { getLabtestCategory } from "../../Redux/ActionCreators/LabtestCategoryActionCreators";
import { getLab } from "../../Redux/ActionCreators/LabActionCreators";

var rte;

export default function AdminUpdateLabtest() {
  let { _id } = useParams();
  var refdiv = useRef(null);

  let [oldPics, setOldPics] = useState([]);
  let [flag, setFlag] = useState(false);

  let [data, setData] = useState({
    name: "",
    labtestCategory: "",
    lab: "",
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    description: "",
    sampleRequired: "",
    preperation: "",
    reportTime: "",
    pic: "",
    active: true,
  });

  let [error, setError] = useState({
    name: "",
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    sampleRequired: "",
    reportTime: "",
    pic: "",
  });

  let [show, setShow] = useState(false);

  let navigate = useNavigate();

  let LabtestStateData = useSelector((state) => state.LabtestStateData);
  let LabtestCategoryStateData = useSelector(
    (state) => state.LabtestCategoryStateData,
  );
  let LabStateData = useSelector((state) => state.LabStateData);

  let dispatch = useDispatch();

  function getInputData(e) {
    let name = e.target.name;
    let value = e.target.files ? e.target.files : e.target.value; //in case of real backend
    // let value = e.target.files ? Array.from(e.target.files).map(x => "Labtest/" + x.name) : e.target.value

    if (name !== "active" || "stock") {
      setError((old) => {
        return {
          ...old,
          [name]: e.target.files ? imageValidator(e) : formValidator(e),
        };
      });
    }
    if (name === "labtest") {
      setError((old) => ({
        ...old,
        labtest: value ? "" : "Labtest is Mandatory",
      }));
      setData((old) => ({ ...old, labtest: value }));
      return;
    }
    if (name === "lab") {
      setError((old) => ({
        ...old,
        lab: value ? "" : "Lab is Mandatory",
      }));
      setData((old) => ({ ...old, lab: value }));
      return;
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
    if (errorItem) {
      setShow(true);
    } else {
      let bp = parseInt(data.basePrice);
      let d = parseInt(data.discount);
      let fp = parseInt(bp - (bp * d) / 100);

      let formData = new FormData();

      formData.append("name", data.name);

      formData.append("labtestCategory", data.labtestCategory);

      formData.append("lab", data.lab);

      formData.append("basePrice", bp);
      formData.append("discount", d);
      formData.append("finalPrice", fp);

      formData.append("preperation", rte.getHTMLCode());

      formData.append("sampleRequired", data.sampleRequired);
      formData.append("reportTime", data.reportTime);

      formData.append("active", data.active);

      // pic (single file)
      formData.append("pic", data.pic);
      dispatch(updateLabtest(formData));
      navigate("/Labtest");
    }
  }

  // Load data
  useEffect(() => {
    dispatch(getLabtest());
    dispatch(getLabtestCategory());
    dispatch(getLab());
  }, []);

  useEffect(() => {
    if (LabtestStateData.length) {
      let item = LabtestStateData.find((x) => x._id === _id);
      if (item) {
        setData({
          ...item,
          LabtestCategory: item.LabtestCategory?._id || item.LabtestCategory,
          Lab: item.Lab?._id || item.Lab,
        });
        setOldPics(item.pic || []);

        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode(item.description);
        rte.setHTMLCode(item.preperation);
      }
    }
  }, [LabtestStateData.length]);

  return (
    <>
      <div className="container">
        <h5 className="bg-primary text-light text-center p-2">
          Update Labtest
          <Link to="/Labtest">
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
                placeholder="Labtest Name"
                className={`form-control border-3 ${show && error.name ? "border-danger" : "border-primary"}`}
              />
              {show && error.name ? (
                <p className="text-danger text-capitalize">{error.name}</p>
              ) : null}
            </div>

            <div className="row">
              <div className="col-md-6">
                <label>Labtest Category</label>
                <select
                  name="labtestCategory"
                  onChange={getInputData}
                  value={data.labtestCategory}
                  className="form-select mb-3 border-3 border-primary"
                >
                  <option value="">Select Category</option>

                  {LabtestCategoryStateData &&
                    LabtestCategoryStateData.filter((x) => x.active).map(
                      (x) => (
                        <option key={x._id} value={x._id}>
                          {x.name}
                        </option>
                      ),
                    )}
                </select>
              </div>

              <div className="col-md-6">
                <label>Lab</label>
                <select
                  name="lab"
                  onChange={getInputData}
                  value={data.lab}
                  className="form-select mb-3 border-3 border-primary"
                >
                  <option value="">Select Lab</option>

                  {LabStateData &&
                    LabStateData.filter((x) => x.active).map((x) => (
                      <option key={x._id} value={x._id}>
                        {x.name}
                      </option>
                    ))}
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
                  placeholder="Base Price"
                  className={`form-control border-3 ${show && error.basePrice ? "border-danger" : "border-primary"}`}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Discount*</label>
                <input
                  type="number"
                  name="discount"
                  value={data.discount}
                  onChange={getInputData}
                  placeholder="Discount"
                  className={`form-control border-3 ${show && error.discount ? "border-danger" : "border-primary"}`}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="col-md-6 mb-3">
                  <label>Sample Required*</label>
                  <input
                    type="text"
                    name="sampleRequired"
                    value={data.sampleRequired}
                    onChange={getInputData}
                    placeholder="Blood / Urine"
                    className={`form-control border-3 ${show && error.sampleRequired ? "border-danger" : "border-primary"}`}
                  />
                </div>
                <label>Report Time*</label>
                <input
                  type="text"
                  name="reportTime"
                  onChange={getInputData}
                  value={data.reportTime}
                  placeholder="e.g. 24 Hours"
                  className={`form-control border-3 ${show && error.reportTime ? "border-danger" : "border-primary"}`}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Preperation*</label>
              <div ref={refdiv} className="border-3 border-primary"></div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Pic*</label>
                <input
                  type="file"
                  name="pic"
                  onChange={getInputData}
                  className={`form-control border-3 ${show && error.pic ? "border-danger" : "border-primary"}`}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Active*</label>
                <select
                  name="active"
                  onChange={getInputData}
                  value={data.active ? "1" : "0"}
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
