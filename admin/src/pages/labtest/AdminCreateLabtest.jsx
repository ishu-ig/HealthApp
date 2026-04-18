import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import formValidator from "../../FormValidators/formValidator";
import imageValidator from "../../FormValidators/imageValidator";
import { createLabtest } from "../../Redux/ActionCreators/LabtestActionCreators";
import { getLabtestCategory } from "../../Redux/ActionCreators/LabtestCategoryActionCreators";
import { getLab } from "../../Redux/ActionCreators/LabActionCreators";

var rte;

export default function AdminCreateLabtest() {
    var refdiv = useRef(null);

    let [data, setData] = useState({
        name: "",
        labtestCategory: "",
        lab: "",
        basePrice: 0,
        discount: 0,
        description: "",
        sampleRequired: "",
        preperation: "",
        reportTime: "",
        pic: "",
        active: true,
    });

    let [error, setError] = useState({
        name: "Name Field is Mandatory",
        labtestCategory: "Category Field is Mandatory",
        lab: "Lab Field is Mandatory",
        basePrice: "Base Price Field is Mandatory",
        discount: "Discount Field is Mandatory",
        sampleRequired: "Sample Required Field is Mandatory",
        reportTime: "Report Time Field is Mandatory",
        pic: "Pic Field is Mandatory",
    });

    let [show, setShow] = useState(false);
    let navigate = useNavigate();

    // ✅ Safe fallbacks
    let LabtestCategoryStateData = useSelector((state) => state.LabtestCategoryStateData) || [];
    let LabStateData = useSelector((state) => state.LabStateData) || [];
    let dispatch = useDispatch();

    // ✅ Single useEffect on mount
    useEffect(() => {
        dispatch(getLabtestCategory());
        dispatch(getLab());
        rte = new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode("");
    }, [dispatch]);

    function getInputData(e) {
        let name = e.target.name;
        // ✅ Store single file, not FileList
        let value = e.target.files ? e.target.files[0] : e.target.value;

        if (name !== "active") {
            setError((old) => ({
                ...old,
                [name]: e.target.files ? imageValidator(e) : formValidator(e),
            }));
        }

        setData((old) => ({
            ...old,
            [name]: name === "active"
                ? value === "1" ? true : false
                : value,
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
            formData.append("name", data.name);
            formData.append("labtestCategory", data.labtestCategory);
            formData.append("lab", data.lab);
            formData.append("basePrice", bp);
            formData.append("discount", d);
            formData.append("finalPrice", fp);
            formData.append("preperation", rte.getHTMLCode());
            formData.append("description", rte.getHTMLCode());
            formData.append("sampleRequired", data.sampleRequired);
            formData.append("reportTime", data.reportTime);
            formData.append("active", data.active);
            formData.append("pic", data.pic);

            dispatch(createLabtest(formData));
            navigate("/labtest");
        }
    }

    return (
        <>
            <div>
                <h5 className="bg-primary text-light text-center p-2">
                    Create Labtest{" "}
                    <Link to="/labtest">
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
                                placeholder="Labtest Name"
                                className={`form-control border-3 ${show && error.name ? "border-danger" : "border-primary"}`}
                            />
                            {show && error.name && <p className="text-danger">{error.name}</p>}
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label>Labtest Category*</label>
                                <select
                                    name="labtestCategory"
                                    onChange={getInputData}
                                    className={`form-select mb-3 border-3 ${show && error.labtestCategory ? "border-danger" : "border-primary"}`}
                                >
                                    <option value="">Select Category</option>
                                    {LabtestCategoryStateData.filter(x => x.active).map(x => (
                                        <option key={x._id} value={x._id}>{x.name}</option>
                                    ))}
                                </select>
                                {show && error.labtestCategory && <p className="text-danger">{error.labtestCategory}</p>}
                            </div>

                            <div className="col-md-6">
                                <label>Lab*</label>
                                <select
                                    name="lab"
                                    onChange={getInputData}
                                    className={`form-select mb-3 border-3 ${show && error.lab ? "border-danger" : "border-primary"}`}
                                >
                                    <option value="">Select Lab</option>
                                    {LabStateData.filter(x => x.active).map(x => (
                                        <option key={x._id} value={x._id}>{x.name}</option>
                                    ))}
                                </select>
                                {show && error.lab && <p className="text-danger">{error.lab}</p>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Base Price*</label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    onChange={getInputData}
                                    placeholder="Base Price"
                                    className={`form-control border-3 ${show && error.basePrice ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.basePrice && <p className="text-danger">{error.basePrice}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Discount*</label>
                                <input
                                    type="number"
                                    name="discount"
                                    onChange={getInputData}
                                    placeholder="Discount %"
                                    className={`form-control border-3 ${show && error.discount ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.discount && <p className="text-danger">{error.discount}</p>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Sample Required*</label>
                                <input
                                    type="text"
                                    name="sampleRequired"
                                    onChange={getInputData}
                                    placeholder="Blood / Urine"
                                    className={`form-control border-3 ${show && error.sampleRequired ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.sampleRequired && <p className="text-danger">{error.sampleRequired}</p>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Report Time*</label>
                                <input
                                    type="text"
                                    name="reportTime"
                                    onChange={getInputData}
                                    placeholder="e.g. 24 Hours"
                                    className={`form-control border-3 ${show && error.reportTime ? "border-danger" : "border-primary"}`}
                                />
                                {show && error.reportTime && <p className="text-danger">{error.reportTime}</p>}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label>Preparation / Description*</label>
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
                                {show && error.pic && <p className="text-danger">{error.pic}</p>}
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
                            <button type="submit" className="btn text-light btn-primary w-100">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}