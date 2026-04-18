import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctor } from "../Redux/ActionCreators/DoctorActionCreators";
import { createDoctorAppointment, getDoctorAppointment } from "../Redux/ActionCreators/DoctorAppointmentActionCreators";
import Doctor from "../Components/Doctors";

export default function DoctorDetailPage() {
  let { _id } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const max      = maxDate.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  let DoctorStateData            = useSelector((state) => state.DoctorStateData)            || [];
  let DoctorAppointmentStateData = useSelector((state) => state.DoctorAppointmentStateData) || [];

  const [data,            setData]           = useState({
    name: "", pic: "", email: "", qualification: "",
    specialization: "", experience: "", fees: "",
    hospital: "", availableTime: "", availableDays: [],
    bio: "", reservationDate: "",
  });
  const [errorMessage,    setErrorMessage]   = useState({ reservationDate: "Date field is mandatory" });
  const [relatedDoctors,  setRelatedDoctors] = useState([]);
  const [appointmentMode, setAppointmentMode] = useState("Offline");
  const [paymentMode,     setPaymentMode]    = useState("Cash");
  const [userdata,        setUserData]       = useState({ name: "", email: "" });

  // ─── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getDoctor());
    dispatch(getDoctorAppointment()); // ✅ fetch appointments so duplicate check works
  }, [dispatch]);

  // ─── Fetch logged-in user info ─────────────────────────────────────────────
  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;
    (async () => {
      try {
        const res    = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        // ✅ Fix: /user returns { result, data: [...] } not a plain array
        // so result.find is not a function — must use result.data.find
        const list = Array.isArray(result) ? result : result.data || [];
        const item = list.find(x => x._id === userId);
        if (item) setUserData({ name: item.name, email: item.email });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    })();
  }, []);

  // ─── Set doctor data from Redux ────────────────────────────────────────────
  useEffect(() => {
    if (DoctorStateData.length > 0 && _id) {
      let item = DoctorStateData.find((x) => x._id === _id);
      if (item) setData({ ...item, reservationDate: "" });
    }
  }, [DoctorStateData, _id]);

  // ─── Related doctors ───────────────────────────────────────────────────────
  useEffect(() => {
    if (DoctorStateData.length > 0 && data.specialization) {
      const currentSpecId = data.specialization?._id || data.specialization;
      setRelatedDoctors(
        DoctorStateData.filter((x) => {
          const xSpecId = x.specialization?._id || x.specialization;
          return x._id !== _id && x.active && String(xSpecId) === String(currentSpecId);
        })
      );
    }
  }, [DoctorStateData, data.specialization, _id]);

  // ─── Date handler ──────────────────────────────────────────────────────────
  function handleDateChange(e) {
    const selectedDate = e.target.value;
    if (!selectedDate) return;

    const todayOnly  = new Date(todayStr + "T00:00:00");
    const chosenDate = new Date(selectedDate + "T00:00:00");
    const diffDays   = Math.ceil((chosenDate - todayOnly) / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      alert("Please select a date within the next 7 days.");
      setData((prev) => ({ ...prev, reservationDate: "" }));
      return;
    }

    setData((prev) => ({ ...prev, reservationDate: selectedDate }));
    setErrorMessage((prev) => ({ ...prev, reservationDate: "" }));
  }

  // ─── Submit ────────────────────────────────────────────────────────────────
  function postData(e) {
    e.preventDefault();

    if (!data.reservationDate) {
      setErrorMessage((prev) => ({ ...prev, reservationDate: "Date field is mandatory" }));
      return;
    }

    if (!localStorage.getItem("login")) {
      alert("To book an appointment, you need to log in.");
      navigate("/login");
      return;
    }

    const userId = localStorage.getItem("userid");

    // ✅ Fix: DB stores date as ISO string, compare normalized date strings
    const alreadyBookedByUser = DoctorAppointmentStateData.find((x) => {
      const xDate = x.date ? new Date(x.date).toISOString().split("T")[0] : "";
      return (
        (x.user?._id || x.user) === userId &&
        (x.doctor?._id || x.doctor) === _id &&
        xDate === data.reservationDate
      );
    });

    if (alreadyBookedByUser) {
      alert("You have already booked this doctor on the selected date.");
      return;
    }

    const slotTaken = DoctorAppointmentStateData.find((x) => {
      const xDate = x.date ? new Date(x.date).toISOString().split("T")[0] : "";
      return (x.doctor?._id || x.doctor) === _id && xDate === data.reservationDate;
    });

    if (slotTaken) {
      alert(`Sorry! This doctor is already booked on ${data.reservationDate}.\nPlease choose another date.`);
      return;
    }

    if (window.confirm("Are you sure you want to book this appointment?")) {
      dispatch(
        createDoctorAppointment({
          user:             userId,
          doctor:           _id,
          hospital:         data.hospital?._id || data.hospital || undefined,
          serviceType:      "Consultation",
          date:             data.reservationDate,
          appointmentTime:  data.availableTime  || "",
          fees:             data.fees,
          appointmentStatus: true,
          paymentStatus:    "Pending",
          paymentMode:      paymentMode,      // "Cash" or "Net Banking" — matches schema enum
          appointmentMode:  appointmentMode,  // "Offline"/"Online"/"Chat" — matches schema enum
        })
      );
      alert("Appointment booked successfully!");
      navigate("/appointment");
    }
  }

  return (
    <>
      <HeroSection title={`Doctor - ${data.name}`} />

      <div className="container-xxl py-5">
        <div className="container-fluid">

          <div className="section-header text-center mb-5" style={{ maxWidth: 600, margin: "auto" }}>
            <h1 className="display-4 fw-bold text-primary">{data.name}</h1>
            <p className="text-muted">{data.specialization?.name || ""}</p>
          </div>

          <form onSubmit={postData}>
            <div className="row g-5">

              {/* ── Left: Image ── */}
              <div className="col-md-5 d-flex align-items-center justify-content-center">
                {data.pic && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                    style={{ height: 500, width: "100%", borderRadius: "15px",
                             objectFit: "cover", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
                    alt={data.name}
                  />
                )}
              </div>

              {/* ── Right: Details + Booking ── */}
              <div className="col-md-7">
                <div className="card shadow-lg border-0 p-4">
                  <h3 className="text-primary fw-bold mb-3">Doctor Details</h3>
                  <table className="table table-hover">
                    <tbody>
                      <tr><th>Name</th>           <td>{data.name             || "N/A"}</td></tr>
                      <tr><th>Email</th>           <td>{data.email            || "N/A"}</td></tr>
                      <tr><th>Qualification</th>   <td>{data.qualification    || "N/A"}</td></tr>
                      <tr><th>Specialization</th>  <td>{data.specialization?.name || "N/A"}</td></tr>
                      <tr><th>Experience</th>      <td>{data.experience ? `${data.experience} years` : "N/A"}</td></tr>
                      <tr><th>Fees</th>            <td><span className="fw-bold text-success">₹{data.fees || "N/A"}</span></td></tr>
                      <tr><th>Hospital</th>        <td>{data.hospital?.name   || "N/A"}</td></tr>
                      <tr><th>Timing</th>          <td>{data.availableTime    || "N/A"}</td></tr>
                      <tr><th>Available Days</th>  <td>{data.availableDays?.join(", ") || "N/A"}</td></tr>
                      <tr><th>Bio</th>             <td>{data.bio              || "N/A"}</td></tr>

                      {/* ── Patient Info (read only) ── */}
                      <tr><th>Your Name</th>  <td><input className="form-control" value={userdata.name}  readOnly /></td></tr>
                      <tr><th>Your Email</th> <td><input className="form-control" value={userdata.email} readOnly /></td></tr>

                      <tr>
                        <th>Appointment Mode</th>
                        <td>
                          <select className="form-select" value={appointmentMode}
                            onChange={(e) => setAppointmentMode(e.target.value)}>
                            <option value="Offline">Offline</option>
                            <option value="Online">Online</option>
                            <option value="Chat">Chat</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>
                          <input
                            type="date" name="reservationDate"
                            min={todayStr} max={max}
                            value={data.reservationDate || ""}
                            className="form-control"
                            onChange={handleDateChange}
                          />
                          {errorMessage.reservationDate && (
                            <p className="text-danger small mt-1">{errorMessage.reservationDate}</p>
                          )}
                        </td>
                      </tr>
                      {data.reservationDate && (
                        <tr>
                          <th>Day</th>
                          <td>{new Date(data.reservationDate + "T00:00:00")
                            .toLocaleDateString("en-US", { weekday: "long" })}</td>
                        </tr>
                      )}
                      <tr>
                        <th>Payment Mode</th>
                        <td>
                          <select className="form-select" value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}>
                            <option value="Cash">Cash</option>
                            <option value="Net Banking">Net Banking / UPI / Card</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm">
                    Book Appointment
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>

      {relatedDoctors.length > 0 && (
        <Doctor title="Other Related Doctors" data={relatedDoctors} />
      )}
    </>
  );
}