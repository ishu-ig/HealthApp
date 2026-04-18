import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMedicine } from "../Redux/ActionCreators/MedicineActionCreators";
import {
  createMedicineCart,
  getMedicineCart,
} from "../Redux/ActionCreators/MedicineCartActionCreators";
import {
  createMedicineWishlist,
  getMedicineWishlist,
} from "../Redux/ActionCreators/MedicineWishlistActionCreators";
import Services from "../Components/Services";

export default function MedicineDetailPage() {
  let { _id } = useParams();
  let [data, setData] = useState({});
  let [relatedMedicine, setRelatedMedicine] = useState([]);
  let [qty, setQty] = useState(1);
  // console.log(_id)

  // ✅ Safe fallback to [] in case Redux returns undefined
  let MedicineStateData = useSelector((state) => state.MedicineStateData) || [];
  let MedicineCartStateData =
    useSelector((state) => state.MedicineCartStateData) || [];
  let WishlistStateData = useSelector((state) => state.WishlistStateData) || [];

  let dispatch = useDispatch();
  let navigate = useNavigate();

  // ✅ Single useEffect for all dispatches on mount
  useEffect(() => {
    dispatch(getMedicine());
    dispatch(getMedicineCart());
    dispatch(getMedicineWishlist());
  }, [dispatch]);

  // ✅ Separate useEffect to react when MedicineStateData or id changes
  useEffect(() => {
    if (MedicineStateData.length > 0) {
      let item = MedicineStateData.find((x) => x._id === _id);
      if (item) {
        setData(item);
        // ✅ Compare by manufacturer._id (object, not string)
        setRelatedMedicine(
          MedicineStateData.filter(
            (x) =>
              x.active &&
              x.manufacturer?._id === item.manufacturer?._id &&
              x._id !== _id,
          ),
        );
      }
    }
  }, [MedicineStateData, _id]);

  function addToMedicineCart() {
    if (localStorage.getItem("login")) {
      let item = MedicineCartStateData.find(
        (x) =>
          (x.medicine?._id || x.medicine) === _id &&
          (x.user?._id || x.user) === localStorage.getItem("userid"),
      );
      console.log({
        user: localStorage.getItem("userid"),
        medicine: _id,
        qty: qty,
        total: data.finalPrice * qty,
      });
      if (!item) {
        dispatch(
          createMedicineCart({
            user: localStorage.getItem("userid"),
            medicine: _id,
            qty: qty,
            total: data.finalPrice * qty,
          }),
        );
      }
      console.log(`id = `,)

      navigate("/medicine/cart");
    } else {
      alert("Login To Add Item In MedicineCart And For Placing Order");
      navigate("/login");
    }
  }

  function addToWishlist() {
    if (localStorage.getItem("login")) {
      let item = WishlistStateData.find(
        (x) =>
          (x.medicine?._id || x.medicine) === _id &&
          (x.user?._id || x.user) === localStorage.getItem("userid"),
      );
      if (!item) {
        dispatch(
          createMedicineWishlist({
            user: localStorage.getItem("userid"),
            medicine: _id,
          }),
        );
      }
      navigate("/medicine/wishlist");
    } else {
      alert("Login To Add Item In Wishlist And For Placing Order");
      navigate("/login");
    }
  }

  return (
    <>
      <HeroSection title={`Medicine - ${data.name || ""}`} />
      <div className="container-xxl py-5">
        <div className="container-fluid text-center">
          <div
            className="section-header text-center mb-5"
            style={{ maxWidth: 500, margin: "auto" }}
          >
            <h1 className="display-4 fw-bold">{data.name}</h1>
          </div>
          <div className="row">
            {/* Medicine Image */}
            <div className="col-md-5 d-flex align-items-center justify-content-center">
              {data?.pic && (
                <img
                  // ✅ pic is an array, use first element
                  src={`${process.env.REACT_APP_BACKEND_SERVER}/${Array.isArray(data.pic) ? data.pic[0] : data.pic}`}
                  style={{ height: 400, width: "100%", borderRadius: "10px" }}
                  className="shadow-lg"
                  alt="Medicine"
                />
              )}
            </div>

            {/* Medicine Details */}
            <div className="col-md-7">
              <div className="card shadow-lg p-4">
                <table className="table table-bordered table-striped border-3 border-primary">
                  <tbody>
                    <tr>
                      <th>Medicine Name</th>
                      <td>{data?.name || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Category</th>
                      {/* ✅ Use .name on object */}
                      <td>{data?.manufacturer?.name || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Manufacturer</th>
                      {/* ✅ Use .name on object */}
                      <td>{data?.manufacturer?.name || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>
                        <del className="text-danger">
                          &#8377;{data?.basePrice}
                        </del>
                        <strong className="ms-2 text-success">
                          &#8377;{data?.finalPrice}
                        </strong>
                        <sup className="text-success"> {data?.discount}%</sup>
                      </td>
                    </tr>
                    <tr>
                      <th>Expire Date</th>
                      <td>{data.expireDate}</td>
                    </tr>
                    <tr>
                      <th>In Stock</th>
                      <td>{data.stock ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="btn-group w-100">
                              <button
                                className="btn btn-primary"
                                style={{ borderRadius: "5px" }}
                                onClick={() =>
                                  setQty((prev) => Math.max(1, prev - 1))
                                }
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                              <h3 className="w-50 text-center">{qty}</h3>
                              <button
                                className="btn btn-primary"
                                style={{ borderRadius: "5px" }}
                                onClick={() => setQty((prev) => prev + 1)}
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-md-8 mb-3">
                            <div className="btn-group w-100">
                              <button
                                className="btn btn-primary"
                                onClick={addToMedicineCart}
                                style={{ borderRadius: "5px" }}
                              >
                                <i className="fa fa-shopping-cart me-2"></i>Add
                                To Cart
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={addToWishlist}
                                style={{ borderRadius: "5px" }}
                              >
                                <i className="fa fa-heart me-2"></i>Add To
                                Wishlist
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              data?.description || "No description available",
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Medicines */}
      {relatedMedicine.length > 0 ? (
        <Services title="Other Related Medicines" data={relatedMedicine} />
      ) : (
        <p className="text-center text-muted">No related Medicines found</p>
      )}
    </>
  );
}
