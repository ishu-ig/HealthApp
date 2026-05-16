// ─── MedicineDetailPage.jsx ───────────────────────────────────────────────────
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

const P = "#06A3DA",
  S = "#F57E57",
  DARK = "#091E3E",
  GRAY = "#6b7a93";

function DetailRow({ icon, label, value, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid rgba(6,163,218,0.07)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          background: "rgba(6,163,218,0.08)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i className={`fa ${icon}`} style={{ color: P, fontSize: 12 }} />
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: "0 0 1px",
            fontSize: "0.72rem",
            color: GRAY,
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        {children || (
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: value ? DARK : GRAY,
            }}
          >
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
}

// FIX 1: Helper to format ISO date strings into a readable format
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // return as-is if not a valid date
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MedicineDetailPage() {
  const { _id } = useParams();
  const [data, setData] = useState({});
  const [relatedMedicine, setRelatedMedicine] = useState([]);
  const [qty, setQty] = useState(1);

  const MedicineStateData = useSelector((s) => s.MedicineStateData) || [];
  const MedicineCartStateData =
    useSelector((s) => s.MedicineCartStateData) || [];
  const WishlistStateData = useSelector((s) => s.WishlistStateData) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMedicine());
    dispatch(getMedicineCart());
    dispatch(getMedicineWishlist());
  }, [dispatch]);

  

  useEffect(() => {
    if (MedicineStateData.length > 0) {
      const item = MedicineStateData.find((x) => x._id === _id);
      if (item) {
        setData(item);
        setQty(1); // FIX 2: Reset qty when the medicine changes
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

  // FIX 3: Added login check and navigate-to-cart after adding
  const addToMedicineCart = () => {
    if (!localStorage.getItem("login")) {
      alert("Login to add to cart");
      navigate("/login");
      return;
    }

    const item = MedicineCartStateData.find(
      (x) =>
        (x.medicine?._id || x.medicine) === _id &&
        (x.user?._id || x.user) === localStorage.getItem("userid"),
    );

    if (!item) {
      dispatch(
        createMedicineCart({
          user: localStorage.getItem("userid"),
          medicine: data._id,
          qty,
          total: data.finalPrice * qty,
        }),
      );
    }

    navigate("/cart");
  };

  // console.log(dispatch(getMedicineCart))

  function addToWishlist() {
    if (!localStorage.getItem("login")) {
      alert("Login to add to wishlist");
      navigate("/login");
      return;
    }
    const item = WishlistStateData.find(
      (x) =>
        (x.medicine?._id || x.medicine) === _id &&
        (x.user?._id || x.user) === localStorage.getItem("userid"),
    );
    if (!item)
      dispatch(
        createMedicineWishlist({
          user: localStorage.getItem("userid"),
          medicine: _id,
        }),
      );
    navigate("/medicine/wishlist");
  }

  const pic = data?.pic
    ? `${process.env.REACT_APP_BACKEND_SERVER}/${Array.isArray(data.pic) ? data.pic[0] : data.pic}`
    : null;

  // FIX 4: Stock ceiling — qty cannot exceed available stock
  const maxQty = typeof data.stock === "number" && data.stock > 0 ? data.stock : 99;

  return (
    <>
      <HeroSection title={`Medicine - ${data.name || ""}`} />
      <div
        style={{
          background: "linear-gradient(135deg,#EEF9FF 0%,#fff 100%)",
          padding: "56px 16px 80px",
        }}
      >
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span
              style={{
                display: "inline-block",
                background: "rgba(6,163,218,0.10)",
                color: P,
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                padding: "5px 18px",
                borderRadius: 50,
                marginBottom: 12,
                border: `1px solid rgba(6,163,218,0.22)`,
              }}
            >
              Medicine
            </span>
            <h2
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                color: DARK,
                margin: 0,
              }}
            >
              {data.name}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {/* Image */}
            <div style={{ flex: "0 0 300px" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: `1px solid rgba(6,163,218,0.12)`,
                  boxShadow: "0 8px 32px rgba(9,30,62,0.10)",
                  padding: "8px",
                }}
              >
                {pic && (
                  <img
                    src={pic}
                    alt={data.name}
                    style={{
                      width: "100%",
                      height: 320,
                      objectFit: "contain",
                      borderRadius: 16,
                    }}
                  />
                )}
                {/* Price badge */}
                <div
                  style={{
                    padding: "18px 16px",
                    borderTop: `1px solid rgba(6,163,218,0.08)`,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "0.8rem",
                      color: GRAY,
                      fontWeight: 500,
                    }}
                  >
                    Price
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <del style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                      ₹{data.basePrice}
                    </del>
                    <span
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontWeight: 800,
                        fontSize: "1.4rem",
                        color: P,
                      }}
                    >
                      ₹{data.finalPrice}
                    </span>
                    <span
                      style={{
                        background: "rgba(6,163,218,0.10)",
                        color: P,
                        borderRadius: 50,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                      }}
                    >
                      {data.discount}% off
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: `1px solid rgba(6,163,218,0.12)`,
                  padding: "28px",
                  boxShadow: "0 8px 32px rgba(9,30,62,0.10)",
                  marginBottom: 20,
                }}
              >
                <h6
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontWeight: 700,
                    color: DARK,
                    marginBottom: 18,
                    fontSize: "1rem",
                  }}
                >
                  Medicine Details
                </h6>
                <DetailRow
                  icon="fa-pills"
                  label="Medicine Name"
                  value={data.name}
                />
                <DetailRow
                  icon="fa-industry"
                  label="Manufacturer"
                  value={data.manufacturer?.name}
                />
                {/* FIX 1 applied: formatted date */}
                <DetailRow
                  icon="fa-calendar-times"
                  label="Expire Date"
                  value={formatDate(data.expireDate)}
                />
                <DetailRow
                  icon="fa-boxes"
                  label="In Stock"
                  value={data.stock ? "Available" : "Out of Stock"}
                />
                {data.description && (
                  <DetailRow icon="fa-info-circle" label="Description">
                    <div
                      style={{ fontSize: "0.88rem", color: DARK }}
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </DetailRow>
                )}
              </div>

              {/* Add to cart */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: `1px solid rgba(6,163,218,0.12)`,
                  padding: "24px 28px",
                  boxShadow: "0 8px 32px rgba(9,30,62,0.10)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  {/* Qty */}
                  <div>
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: DARK,
                      }}
                    >
                      Quantity
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "rgba(6,163,218,0.06)",
                        borderRadius: 50,
                        padding: "6px 16px",
                        border: `1px solid rgba(6,163,218,0.18)`,
                      }}
                    >
                      <button
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(6,163,218,0.12)",
                          color: P,
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          color: DARK,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {qty}
                      </span>
                      {/* FIX 4 applied: cap qty at maxQty */}
                      <button
                        onClick={() => setQty((p) => Math.min(maxQty, p + 1))}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "none",
                          background: P,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color: P,
                      margin: 0,
                    }}
                  >
                    Total: ₹{(data.finalPrice || 0) * qty}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button
                    onClick={addToMedicineCart}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "none",
                      borderRadius: 50,
                      background: `linear-gradient(135deg,${P},#0080b0)`,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      boxShadow: `0 6px 16px rgba(6,163,218,0.3)`,
                      transition: "all .25s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `linear-gradient(135deg,${S},#d05c35)`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = `linear-gradient(135deg,${P},#0080b0)`)
                    }
                  >
                    <i className="fa fa-shopping-cart" />
                    Add to Cart
                  </button>
                  <button
                    onClick={addToWishlist}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: `1.5px solid rgba(6,163,218,0.3)`,
                      borderRadius: 50,
                      background: "rgba(6,163,218,0.06)",
                      color: P,
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      transition: "all .25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = P;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(6,163,218,0.06)";
                      e.currentTarget.style.color = P;
                    }}
                  >
                    <i className="fa fa-heart" />
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedMedicine.length > 0 ? (
        <Services title="Other Related Medicines" data={relatedMedicine} />
      ) : (
        <p style={{ textAlign: "center", color: GRAY, padding: "32px 0" }}>
          No related medicines found
        </p>
      )}
    </>
  );
}