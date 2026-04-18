import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  getDoctorAppointment,
  updateDoctorAppointment,
} from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import {
  getNurseAppointment,
  updateNurseAppointment,
} from '../Redux/ActionCreators/NurseAppointmentActionCreators';

export default function Order({ title, data }) {
  const [cancelStatus, setCancelStatus] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const DoctorAppointmentStateData = useSelector((state) => state.DoctorAppointmentStateData);
  const NurseAppointmentStateData = useSelector((state) => state.NurseAppointmentStateData);

  useEffect(() => {
    dispatch(getDoctorAppointment());
    dispatch(getNurseAppointment());
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(data)) return;
    const timeouts = [];

    data.forEach((item) => {
      const fiveHour = 5 * 60 * 60 * 1000;
      const timePassed = Date.now() - new Date(item.createdAt).getTime();
      const remainingTime = Math.max(fiveHour - timePassed, 0);

      // Set initial cancelStatus to true
      setCancelStatus((prev) => ({ ...prev, [item._id]: true }));

      const timeout = setTimeout(() => {
        setCancelStatus((prev) => ({ ...prev, [item._id]: false }));
      }, remainingTime);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [data]);

  const updateStatus = (id) => {
    const isDoctor = title === 'doctor';
    const bookingList = isDoctor ? DoctorAppointmentStateData : NurseAppointmentStateData;
    const item = bookingList.find((x) => x._id === id);

    if (!item) return;

    if (window.confirm('Are you sure you want to cancel your booking?')) {
      const updatedBooking = { ...item, appointmentStatus: false };
      isDoctor
        ? dispatch(updateDoctorAppointment(updatedBooking))
        : dispatch(updateNurseAppointment(updatedBooking));

      window.location.reload();
    }
  };

  const handleSelection = (e) => {
    const value = e.target.value;
    if (value) {
      navigate(value);
    }
  };

  const renderBookingDetails = (item) => {
    const person = title === 'doctor' ? item.doctor : item.nurse;

    if (!person) {
      return (
        <tr>
          <td colSpan="6" className="text-danger">
            Booking details not found.
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td>{person.name}</td>
        <td>{person.reservationDate}</td>
        <td>{title === 'doctor' ? person.specialization : person.shiftType}</td>
        <td>{person.hospital}</td>
        <td>{person.experience}</td>
        <td>{person.fees}</td>
      </tr>
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top py-2 mb-3">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-light text-capitalize">
            <i className="fa fa-shopping-cart me-3" aria-hidden="true"></i> Order
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <h4 className="text-light text-center p-2 w-100">
              {title === 'medicine' || title === 'labtest' ? 'Your Order' : 'Your Bookings'}
            </h4>
            <div className="ms-auto d-flex align-items-center">
              <select
                id="specialization-select"
                name="specialization"
                className="form-select border-3 border-primary"
                onChange={handleSelection}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Cart
                </option>
                <option value="/order/medicine">Medicine</option>
                <option value="/order/labtest">Lab Test</option>
                <option value="/order/doctor">Doctor</option>
                <option value="/order/nurse">Nurse</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="mb-4 p-3 card shadow-sm rounded"
              style={{ backgroundColor: '#F8F8F8' }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                <h6 className="mb-0">
                  <strong>
                    {title === 'medicine' || title === 'labtest' ? 'Order ID:' : 'Booking ID:'}
                  </strong>{' '}
                  {item._id}
                </h6>
                <span
                  className={`badge ${
                    item.orderStatus === 'Delivered' || item.appointmentStatus
                      ? 'bg-success'
                      : 'bg-danger'
                  }`}
                >
                  {title === 'medicine' || title === 'labtest'
                    ? item.orderStatus
                    : item.appointmentStatus
                    ? 'Confirmed'
                    : 'Canceled'}
                </span>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-bordered mt-2 text-center">
                  <thead className="table-primary">
                    <tr>
                      {title === 'medicine' || title === 'labtest' ? (
                        <>
                          <th>Item</th>
                          <th>{title === 'labtest' ? 'Lab' : 'Price (₹)'}</th>
                          <th>{title === 'medicine' ? 'Quantity' : 'Sample Type'}</th>
                          <th>Total (₹)</th>
                        </>
                      ) : (
                        <>
                          <th>Name</th>
                          <th>Date</th>
                          <th>{title === 'doctor' ? 'Specialization' : 'Shift Type'}</th>
                          <th>Hospital</th>
                          <th>Experience</th>
                          <th>Fees (₹)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {title === 'medicine' || title === 'labtest' ? (
                      (Array.isArray(item.product) ? item.product : []).map((prod) => (
                        <tr key={prod._id}>
                          <td>{prod.name}</td>
                          <td>{title === 'medicine' ? prod.price : prod.lab}</td>
                          <td>{title === 'medicine' ? prod.qty : prod.sampleType}</td>
                          <td>{prod.total}</td>
                        </tr>
                      ))
                    ) : (
                      renderBookingDetails(item)
                    )}
                  </tbody>
                </table>
              </div>

              {/* Payment and Action */}
              <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap">
                <div>
                  <p className="mb-1">
                    <strong>Payment Mode:</strong> {item.paymentMode || 'N/A'}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <span
                      className={`fw-bold ms-1 ${
                        item.paymentStatus === 'Pending' ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {item.paymentStatus || 'N/A'}
                    </span>
                  </p>
                </div>
                <div className="text-end">
                  {title === 'medicine' || title === 'labtest' ? (
                    <>
                      <h5 className="fw-bold">Total Amount: ₹{item.total}</h5>
                      <Link to={`/order-detail/${item._id}`} className="btn btn-outline-primary mt-2">
                        View Details
                      </Link>
                    </>
                  ) : item.appointmentStatus ? (
                    cancelStatus[item._id] ? (
                      <>
                        <p className="text-capitalize d-sm-none">
                          <strong>Cancellation is only available within 5 hours of booking.</strong>
                        </p>
                        <button
                          onClick={() => updateStatus(item._id)}
                          className="btn btn-outline-danger mt-2"
                        >
                          Cancel Booking
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="d-sm-none">No Cancellation Available Anymore</p>
                        <button disabled className="btn btn-outline-danger mt-2">
                          Cancel Booking
                        </button>
                      </>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 text-center">
            <h3>No {title === 'medicine' || title === 'labtest' ? 'Orders' : 'Bookings'} Placed</h3>
            <Link to="/product" className="btn btn-primary mt-2">
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
