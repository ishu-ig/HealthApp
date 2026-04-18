import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { getLabtest }  from "../Redux/ActionCreators/LabtestActionCreators";
import { getMedicine } from "../Redux/ActionCreators/MedicineActionCreators";

import { createMedicineCheckout }                                          from "../Redux/ActionCreators/MedicineCheckoutActionCreators";
import { deleteMedicineCart, getMedicineCart, updateMedicineCart }         from '../Redux/ActionCreators/MedicineCartActionCreators';

import { createLabtestCheckout }                                           from '../Redux/ActionCreators/LabtestCheckoutActionCreators';
import { deleteLabtestCart, getLabtestCart, updateLabtestCart }            from '../Redux/ActionCreators/LabtestCartActionCreators';

import { createDoctorAppointment }  from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import { createNurseAppointment }   from '../Redux/ActionCreators/NurseAppointmentActionCreators';

// ─── Constants ────────────────────────────────────────────────────────────────

const APPOINTMENT_TYPES = ["doctorAppointment", "nurseAppointment"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Cart({ title, title1, data }) {
  const [cart, setCart]                     = useState([]);
  const [subtotal, setSubtotal]             = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [dateInfo, setDateInfo]             = useState({});
  const [total, setTotal]                   = useState(0);
  const [mode, setMode]                     = useState('COD');
  const [loading, setLoading]               = useState(true);
  const [errorMessage, setErrorMessage]     = useState({
    reservationDate: "Date field is mandatory",
  });

  const today    = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAppointment = APPOINTMENT_TYPES.includes(title);

  // FIX A — safe Array fallback at selector level
  // Handles cases where reducer initialises as null/undefined instead of []
  const MedicineCartState = useSelector(state =>
    Array.isArray(state.MedicineCartStateData) ? state.MedicineCartStateData : []
  );
  const LabtestCartState = useSelector(state =>
    Array.isArray(state.LabtestCartStateData) ? state.LabtestCartStateData : []
  );

  // FIX B — also subscribe to appointment slices directly from Redux
  const DoctorAppointmentState = useSelector(state =>
    Array.isArray(state.DoctorAppointmentStateData) ? state.DoctorAppointmentStateData : []
  );
  const NurseAppointmentState = useSelector(state =>
    Array.isArray(state.NurseAppointmentStateData) ? state.NurseAppointmentStateData : []
  );

  // ── helpers ──────────────────────────────────────────────────────────────────

  const calculate = (updatedCart) => {
    if (isAppointment) {
      const fees = updatedCart.reduce((acc, item) => acc + (Number(item.fees) || 0), 0);
      setSubtotal(fees);
      setDeliveryCharge(0);
      setTotal(fees);
      return;
    }
    const newSubtotal = updatedCart.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
    const delivery = title === "medicine"
      ? (newSubtotal > 0 && newSubtotal < 200 ? 50 : 0)
      : (newSubtotal > 0 && newSubtotal < 500 ? 100 : 0);
    setSubtotal(newSubtotal);
    setDeliveryCharge(delivery);
    setTotal(newSubtotal + delivery);
  };

  const flattenItem = (item) => {
    if (!item) return null;

    if (title === "medicine") {
      const med   = (item.medicine && typeof item.medicine === "object") ? item.medicine : {};
      const price = Number(med.finalPrice || med.basePrice || 0) ||
                    (item.qty ? (item.total / item.qty) : 0) || 0;
      const qty   = Number(item.qty) || 1;
      return {
        ...item,
        medicine:         med,
        name:             med.name             || item.name             || "Unknown",
        pic:              Array.isArray(med.pic) ? med.pic[0] : (med.pic || item.pic || ""),
        price,
        medicineCategory: med.medicineCategory?.name || item.medicineCategory || "N/A",
        qty,
        total:            price * qty,
      };
    }

    if (title === "labtest") {
      const lab   = (item.labtest && typeof item.labtest === "object") ? item.labtest : {};
      const price = Number(lab.price || item.total || 0);
      return {
        ...item,
        labtest:         lab,
        name:            lab.name            || item.name            || "Unknown",
        pic:             Array.isArray(lab.pic) ? lab.pic[0] : (lab.pic || item.pic || ""),
        price,
        labtestCategory: lab.labtestCategory?.name || item.labtestCategory || "N/A",
        lab:             lab.lab?.name       || item.lab                    || "N/A",
        sampleType:      lab.sampleType      || item.sampleType             || "N/A",
        total:           Number(item.total)  || price,
      };
    }

    if (title === "doctorAppointment") {
      const doctor   = (item.doctor   && typeof item.doctor   === "object") ? item.doctor   : {};
      const hospital = (item.hospital && typeof item.hospital === "object") ? item.hospital : {};
      return {
        ...item,
        name:            doctor.name           || "Unknown Doctor",
        pic:             Array.isArray(doctor.pic) ? doctor.pic[0] : (doctor.pic || ""),
        specialization:  doctor.specialization || "N/A",
        hospital:        hospital.name         || "N/A",
        appointmentMode: item.appointmentMode  || "N/A",
        serviceType:     item.serviceType      || "N/A",
        date:            item.date             || "",
        fees:            Number(item.fees)     || 0,
      };
    }

    if (title === "nurseAppointment") {
      const nurse    = (item.nurse    && typeof item.nurse    === "object") ? item.nurse    : {};
      const hospital = (item.hospital && typeof item.hospital === "object") ? item.hospital : {};
      return {
        ...item,
        name:        nurse.name        || "Unknown Nurse",
        pic:         Array.isArray(nurse.pic) ? nurse.pic[0] : (nurse.pic || ""),
        hospital:    hospital.name     || "N/A",
        serviceType: item.serviceType  || "N/A",
        duration:    item.duration     ?? 1,
        date:        item.date         || "",
        fees:        Number(item.fees) || 0,
      };
    }

    return item;
  };

  // ── handlers ─────────────────────────────────────────────────────────────────

  const handleSelection = (e) => {
    const value = e.target.value;
    if (value) navigate(value);
  };

  const updateRecord = (id, option) => {
    if (isAppointment) return;

    const updatedCart = [...cart];
    const index = updatedCart.findIndex(x => x._id === id);
    if (index === -1) return;
    const item = { ...updatedCart[index] };

    if (title === "medicine") {
      if (option === "DEC" && item.qty > 1) item.qty -= 1;
      if (option === "INC") item.qty += 1;
      item.total = item.price * item.qty;
      dispatch(updateMedicineCart({ _id: item._id, qty: item.qty, total: item.total }));
    } else {
      item.total = item.price ?? item.total;
      dispatch(updateLabtestCart({ _id: item._id, total: item.total }));
    }

    updatedCart[index] = item;
    setCart(updatedCart);
    calculate(updatedCart);
  };

  const deleteRecord = (id) => {
    if (isAppointment) return;
    if (window.confirm("Are you sure you want to remove this item?")) {
      title === "medicine"
        ? dispatch(deleteMedicineCart({ _id: id }))
        : dispatch(deleteLabtestCart({ _id: id }));
    }
  };

  const getInputData = (e) => {
    const { name, value } = e.target;
    setDateInfo(prev => ({ ...prev, [name]: value }));
    setErrorMessage(prev => ({ ...prev, [name]: "" }));
  };

  const placeOrder = () => {
    const userId = localStorage.getItem("userid");

    if (title === "doctorAppointment") {
      cart.forEach(item => {
        dispatch(createDoctorAppointment({
          ...item,
          user:          userId,
          paymentMode:   mode,
          paymentStatus: "Pending",
          status:        "Pending",
        }));
      });
      if (mode === "COD") navigate('/confirmation/doctorAppointment');
      else navigate("/payment/doctorAppointment/-1");
      return;
    }

    if (title === "nurseAppointment") {
      cart.forEach(item => {
        dispatch(createNurseAppointment({
          ...item,
          user:          userId,
          paymentMode:   mode,
          paymentStatus: "Pending",
          status:        "Pending",
        }));
      });
      if (mode === "COD") navigate('/confirmation/nurseAppointment');
      else navigate("/payment/nurseAppointment/-1");
      return;
    }

    if (title === "labtest") {
      if (title1 === "Checkout" && !dateInfo.reservationDate) {
        setErrorMessage(prev => ({ ...prev, reservationDate: "Date field is mandatory" }));
        return;
      }
      const order = {
        user:            userId,
        orderStatus:     "Order is Placed",
        paymentMode:     mode,
        paymentStatus:   "Pending",
        subtotal,
        shipping:        deliveryCharge,
        total,
        reservationDate: dateInfo.reservationDate,
        Labtests:        [...cart],
      };
      dispatch(createLabtestCheckout(order));
      cart.forEach(item => dispatch(deleteLabtestCart({ _id: item._id })));
      if (mode === "COD") navigate('/confirmation/labtestCheckout');
      else navigate("/payment/labtestCheckout/-1");
      return;
    }

    if (title === "medicine") {
      const order = {
        user:          userId,
        orderStatus:   "Order is Placed",
        paymentMode:   mode,
        paymentStatus: "Pending",
        subtotal,
        shipping:      deliveryCharge,
        total,
        medicines:     [...cart],
      };
      dispatch(createMedicineCheckout(order));
      cart.forEach(item => dispatch(deleteMedicineCart({ _id: item._id })));
      if (mode === "COD") navigate('/confirmation/medicineCheckout');
      else navigate("/payment/medicineCheckout/-1");
      return;
    }
  };

  // ── effects ──────────────────────────────────────────────────────────────────

  // FIX C — fetch only what the current title needs, no unnecessary fetches
  useEffect(() => {
    setLoading(true);
    if (title === "medicine") {
      dispatch(getMedicine());
      dispatch(getMedicineCart());
    } else if (title === "labtest") {
      dispatch(getLabtest());
      dispatch(getLabtestCart());
    }
    // Appointments: data already in Redux from booking page — no re-fetch needed
  }, [dispatch, title]);

  // FIX D — clear source-of-truth priority per type:
  //   medicine/labtest  → always use Redux cart state (never let data prop override)
  //   appointments      → data prop if provided, Redux store as fallback
  useEffect(() => {
    let rawCart = [];

    if (title === "medicine") {
      rawCart = MedicineCartState;
    } else if (title === "labtest") {
      rawCart = LabtestCartState;
    } else if (title === "doctorAppointment") {
      rawCart = data
        ? (Array.isArray(data) ? data : [data])
        : DoctorAppointmentState;
    } else if (title === "nurseAppointment") {
      rawCart = data
        ? (Array.isArray(data) ? data : [data])
        : NurseAppointmentState;
    }

    const flattened = rawCart.map(flattenItem).filter(Boolean);
    setCart(flattened);
    calculate(flattened);
    setLoading(false);
  }, [
    MedicineCartState,
    LabtestCartState,
    DoctorAppointmentState,
    NurseAppointmentState,
    data,
    title,
  ]);

  // ── loading state ────────────────────────────────────────────────────────────

  if (loading && cart.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">
          Loading your {isAppointment ? "booking" : "cart"}...
        </p>
      </div>
    );
  }

  // ── empty state ──────────────────────────────────────────────────────────────

  if (!loading && cart.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fa fa-shopping-cart fa-5x mb-3 text-muted"></i>
        <h3>
          {isAppointment
            ? "No Appointment Selected"
            : title1 !== "Checkout" ? "Your Cart is Empty" : "No Items in Checkout"}
        </h3>
        <Link to={`/${title}`} className="btn btn-primary mt-3">
          {isAppointment ? "Book Now" : "Shop Now"}
        </Link>
      </div>
    );
  }

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="container my-3">

      {/* Category switcher — product carts only */}
      {!isAppointment && (
        <div className="mb-3 d-flex justify-content-end">
          <label htmlFor="specialization-select" className="me-2 fw-semibold align-self-center">
            Specialization:
          </label>
          <select
            id="specialization-select"
            className="form-select border-primary rounded"
            style={{ width: 200 }}
            onChange={handleSelection}
            defaultValue=""
          >
            <option value="" disabled>Select Specialization</option>
            <option value="/medicine/cart">Medicine</option>
            <option value="/labtest/cart">Lab Test</option>
          </select>
        </div>
      )}

      {/* ── Desktop table ── */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover table-striped table-bordered border-primary align-middle">
          <thead className="table-primary">
            <tr>
              <th>Item</th>
              <th>Name</th>
              {title === "medicine"          && <><th>Category</th><th>Price</th><th>Quantity</th><th>Total</th></>}
              {title === "labtest"           && <><th>Category</th><th>Lab</th><th>Sample Type</th><th>Total</th></>}
              {title === "doctorAppointment" && <><th>Specialization</th><th>Hospital</th><th>Mode</th><th>Service</th><th>Date</th><th>Fees</th></>}
              {title === "nurseAppointment"  && <><th>Hospital</th><th>Service</th><th>Duration (hrs)</th><th>Date</th><th>Fees</th></>}
              {!isAppointment && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.pic
                      ? `${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`
                      : "/placeholder.png"}
                    height={50} width={80} alt={item.name}
                    onError={e => { e.target.src = "/placeholder.png"; }}
                  />
                </td>
                <td>{item.name}</td>

                {title === "medicine" && <>
                  <td>{item.medicineCategory}</td>
                  <td>₹{item.medicine?.finalPrice || item.price}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <button className="btn btn-outline-primary btn-sm"
                        onClick={() => updateRecord(item._id, "DEC")}>−</button>
                      <span className="mx-3">{item.qty}</span>
                      <button className="btn btn-outline-primary btn-sm"
                        onClick={() => updateRecord(item._id, "INC")}>+</button>
                    </div>
                  </td>
                  <td><strong>₹{item.total}</strong></td>
                </>}

                {title === "labtest" && <>
                  <td>{item.labtestCategory}</td>
                  <td>{item.lab}</td>
                  <td>{item.sampleType}</td>
                  <td><strong>₹{item.total}</strong></td>
                </>}

                {title === "doctorAppointment" && <>
                  <td>{item.specialization}</td>
                  <td>{item.hospital}</td>
                  <td>{item.appointmentMode}</td>
                  <td>{item.serviceType}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                  <td><strong>₹{item.fees}</strong></td>
                </>}

                {title === "nurseAppointment" && <>
                  <td>{item.hospital}</td>
                  <td>{item.serviceType}</td>
                  <td>{item.duration}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                  <td><strong>₹{item.fees}</strong></td>
                </>}

                {!isAppointment && (
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => deleteRecord(item._id)}>Remove</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="d-md-none">
        {cart.map(item => (
          <div key={item._id} className="card mb-3 shadow-sm rounded-3">
            <div className="row g-0 align-items-center">
              <div className="col-4">
                <img
                  src={item.pic
                    ? `${process.env.REACT_APP_BACKEND_SERVER}/${item.pic}`
                    : "/placeholder.png"}
                  className="img-fluid rounded-start" alt={item.name}
                  onError={e => { e.target.src = "/placeholder.png"; }}
                />
              </div>
              <div className="col-8">
                <div className="card-body p-2">
                  <h5 className="card-title">{item.name}</h5>

                  {title === "medicine" && <>
                    <p className="mb-1"><strong>Category:</strong> {item.medicineCategory}</p>
                    <p className="mb-1"><strong>Price:</strong> ₹{item.medicine?.finalPrice || item.price}</p>
                    <div className="d-flex align-items-center mb-1">
                      <button className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => updateRecord(item._id, "DEC")}>−</button>
                      <span>{item.qty}</span>
                      <button className="btn btn-outline-primary btn-sm ms-2"
                        onClick={() => updateRecord(item._id, "INC")}>+</button>
                    </div>
                    <p><strong>Total:</strong> ₹{item.total}</p>
                  </>}

                  {title === "labtest" && <>
                    <p className="mb-1"><strong>Category:</strong> {item.labtestCategory}</p>
                    <p className="mb-1"><strong>Lab:</strong> {item.lab}</p>
                    <p className="mb-1"><strong>Sample:</strong> {item.sampleType}</p>
                    <p><strong>Total:</strong> ₹{item.total}</p>
                  </>}

                  {title === "doctorAppointment" && <>
                    <p className="mb-1"><strong>Specialization:</strong> {item.specialization}</p>
                    <p className="mb-1"><strong>Hospital:</strong> {item.hospital}</p>
                    <p className="mb-1"><strong>Mode:</strong> {item.appointmentMode}</p>
                    <p className="mb-1"><strong>Service:</strong> {item.serviceType}</p>
                    <p className="mb-1"><strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Fees:</strong> ₹{item.fees}</p>
                  </>}

                  {title === "nurseAppointment" && <>
                    <p className="mb-1"><strong>Hospital:</strong> {item.hospital}</p>
                    <p className="mb-1"><strong>Service:</strong> {item.serviceType}</p>
                    <p className="mb-1"><strong>Duration:</strong> {item.duration} hr(s)</p>
                    <p className="mb-1"><strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Fees:</strong> ₹{item.fees}</p>
                  </>}

                  {!isAppointment && (
                    <button className="btn btn-danger btn-sm w-100"
                      onClick={() => deleteRecord(item._id)}>Remove</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Order / Booking summary ── */}
      <div className="card shadow-sm p-3 mt-3 sticky-top" style={{ top: 80 }}>
        <h5 className="mb-3">{isAppointment ? "Booking Summary" : "Order Summary"}</h5>
        <table className="table mb-0 order-summary">
          <tbody>
            <tr>
              <th>{isAppointment ? "Fees" : "Subtotal"}</th>
              <td>₹{subtotal}</td>
            </tr>

            {!isAppointment && (
              <tr>
                <th>{title === "medicine" ? "Delivery Charge" : "Service Charge"}</th>
                <td>₹{deliveryCharge}</td>
              </tr>
            )}

            <tr>
              <th>Total</th>
              <td><strong>₹{total}</strong></td>
            </tr>

            {title1 === "Checkout" && title === "labtest" && (
              <>
                <tr>
                  <th>Date</th>
                  <td>
                    <input
                      type="date"
                      name="reservationDate"
                      min={today}
                      className="form-control"
                      onChange={getInputData}
                    />
                    {errorMessage.reservationDate && (
                      <p className="text-danger small mt-1">{errorMessage.reservationDate}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Day</th>
                  <td>
                    {dateInfo.reservationDate
                      ? new Date(dateInfo.reservationDate).toLocaleDateString("en-US", { weekday: "long" })
                      : "—"}
                  </td>
                </tr>
              </>
            )}

            {(title1 === "Checkout" || isAppointment) && (
              <tr>
                <th>Payment Mode</th>
                <td>
                  <select className="form-select" value={mode}
                    onChange={e => setMode(e.target.value)}>
                    <option value="COD">Cash On Delivery</option>
                    <option value="Net Banking">Net Banking / UPI / Card</option>
                  </select>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          className="btn btn-primary w-100 mt-3 btn-gradient"
          onClick={
            isAppointment || title1 === "Checkout"
              ? placeOrder
              : () => navigate(`/checkout/${title}`)
          }
        >
          {isAppointment
            ? "Confirm Booking"
            : title1 !== "Checkout" ? "Proceed to Checkout" : "Place Order"}
        </button>
      </div>

      <style>{`
        .btn-gradient {
          background: linear-gradient(135deg, #4a90e2, #0056b3);
          border: none; color: #fff; font-weight: 500;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,86,179,.5);
        }
        .table-hover tbody tr:hover { background-color: #f0f8ff; transition: .3s; }
        .order-summary th { color: #0d6efd; }
      `}</style>
    </div>
  );
}