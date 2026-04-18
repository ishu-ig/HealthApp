import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getNurse } from '../Redux/ActionCreators/NurseActionCreators'
import { getNurseAppointment, createNurseAppointment } from '../Redux/ActionCreators/NurseAppointmentActionCreators'
import Nurse from '../Components/Nurse'

export default function NurseDetailPage() {
  // ✅ Fix: was "id" — must match your route param <Route path="/nurse/:_id" />
  let { _id } = useParams()
  let dispatch  = useDispatch()
  let navigate  = useNavigate()

  let NurseStateData            = useSelector(state => state.NurseStateData)            || []
  let NurseAppointmentStateData = useSelector(state => state.NurseAppointmentStateData) || []

  const today    = new Date().toISOString().split('T')[0]
  const maxDate  = new Date()
  maxDate.setDate(new Date().getDate() + 7)
  const max      = maxDate.toISOString().split('T')[0]
  const todayStr = today

  const [data,            setData]           = useState({})
  const [reservationDate, setReservationDate] = useState('')
  const [errorMessage,    setErrorMessage]   = useState('')
  const [relatedNurses,   setRelatedNurses]  = useState([])
  const [paymentMode,     setPaymentMode]    = useState('Cash')
  const [userdata,        setUserData]       = useState({ name: '', email: '' })

  // ─── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getNurse())
    dispatch(getNurseAppointment()) // ✅ needed for duplicate booking check
  }, [dispatch])

  // ─── Fetch logged-in user info ─────────────────────────────────────────────
  useEffect(() => {
    const userId = localStorage.getItem('userid')
    if (!userId) return
    ;(async () => {
      try {
        const res    = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
          headers: { 'Content-Type': 'application/json' },
        })
        const result = await res.json()
        // ✅ Fix: API returns { result, data: [] } not plain array
        const list = Array.isArray(result) ? result : result.data || []
        const item = list.find(x => x._id === userId)
        if (item) setUserData({ name: item.name, email: item.email })
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    })()
  }, [])

  // ─── Set nurse data from Redux ─────────────────────────────────────────────
  useEffect(() => {
    if (NurseStateData.length > 0 && _id) {
      // ✅ Fix: was comparing against "id" (undefined) — now uses "_id" from useParams
      let item = NurseStateData.find(x => x._id === _id)
      if (item) setData(item)
    }
  }, [NurseStateData, _id])

  // ─── Related nurses — same department ─────────────────────────────────────
  useEffect(() => {
    if (NurseStateData.length > 0 && data.departments?.length > 0) {
      // ✅ Fix: Nurse has "departments[]" not "specialization"
      setRelatedNurses(
        NurseStateData.filter(x =>
          x._id !== _id &&
          x.active &&
          x.departments?.some(dept => data.departments.includes(dept))
        )
      )
    }
  }, [NurseStateData, data.departments, _id])

  // ─── Date change handler ───────────────────────────────────────────────────
  function handleDateChange(e) {
    const selectedDate = e.target.value
    if (!selectedDate) return

    const todayOnly  = new Date(todayStr + 'T00:00:00')
    const chosenDate = new Date(selectedDate + 'T00:00:00') // ✅ force local midnight
    const diffDays   = Math.ceil((chosenDate - todayOnly) / (1000 * 60 * 60 * 24))

    if (diffDays > 7) {
      alert('Please select a date within the next 7 days.')
      setReservationDate('')
      return
    }

    setReservationDate(selectedDate)
    setErrorMessage('')
  }

  // ─── Submit booking ────────────────────────────────────────────────────────
  function postData(e) {
    e.preventDefault()

    if (!reservationDate) {
      setErrorMessage('Reservation date is required')
      return
    }

    if (!localStorage.getItem('login')) {
      alert('You need to log in to book an appointment.')
      navigate('/login')
      return
    }

    const userId = localStorage.getItem('userid')

    // ✅ Fix: normalize ISO date from DB to YYYY-MM-DD for comparison
    const alreadyBookedByUser = NurseAppointmentStateData.find(x => {
      const xDate = x.date ? new Date(x.date).toISOString().split('T')[0] : ''
      return (
        (x.user?._id || x.user) === userId &&
        (x.nurse?._id || x.nurse) === _id &&
        xDate === reservationDate
      )
    })

    if (alreadyBookedByUser) {
      alert(`You already have a booking with this nurse on ${reservationDate}.`)
      return
    }

    const slotTaken = NurseAppointmentStateData.find(x => {
      const xDate = x.date ? new Date(x.date).toISOString().split('T')[0] : ''
      return (x.nurse?._id || x.nurse) === _id && xDate === reservationDate
    })

    if (slotTaken) {
      alert(`Sorry! This nurse is already booked on ${reservationDate}. Please choose another date.`)
      return
    }

    if (window.confirm('Are you sure you want to book this nurse?')) {
      dispatch(createNurseAppointment({
        user:             userId,
        nurse:            _id,              // ✅ Fix: send _id not entire data object
        hospital:         data.hospital?._id || data.hospital || undefined,
        date:             reservationDate,
        fees:             data.fees,
        appointmentStatus: true,
        paymentStatus:    'Pending',
        paymentMode:      paymentMode,      // ✅ Fix: "Cash"/"Net Banking" matches schema enum
      }))
      alert('Booking successful!')
      navigate('/appointment')
    }
  }

  return (
    <>
      <HeroSection title={`Nurse - ${data.name || ''}`} />

      <div className="container-xxl py-5">
        <div className="container-fluid">

          <div className="section-header text-center mb-5" style={{ maxWidth: 600, margin: 'auto' }}>
            <h1 className="display-4 fw-bold text-primary">{data.name}</h1>
            {/* ✅ Fix: show departments not specialization */}
            <p className="text-muted">{data.departments?.join(', ') || ''}</p>
          </div>

          <form onSubmit={postData}>
            <div className="row g-5">

              {/* ── Left: Nurse Image ── */}
              <div className="col-md-5 d-flex align-items-center justify-content-center">
                {data.pic && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                    alt={data.name}
                    style={{
                      width: '100%', height: '500px',
                      borderRadius: '15px', objectFit: 'cover',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      transition: 'transform 0.3s',
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e  => e.currentTarget.style.transform = 'scale(1)'}
                  />
                )}
              </div>

              {/* ── Right: Details + Booking ── */}
              <div className="col-md-7">
                <div className="card shadow-lg border-0 p-4">
                  <h3 className="fw-bold text-primary mb-3">Nurse Details</h3>
                  <table className="table table-hover">
                    <tbody>
                      <tr><th>Name</th>           <td>{data.name          || 'N/A'}</td></tr>
                      <tr><th>Email</th>           <td>{data.email         || 'N/A'}</td></tr>
                      <tr><th>Phone</th>           <td>{data.phone         || 'N/A'}</td></tr>
                      <tr><th>Gender</th>          <td>{data.gender        || 'N/A'}</td></tr>
                      <tr><th>Qualification</th>   <td>{data.qualification || 'N/A'}</td></tr>
                      <tr><th>Experience</th>      <td>{data.experience ? `${data.experience} years` : 'N/A'}</td></tr>
                      {/* ✅ Fix: was "Specialization" — Nurse has "departments" array */}
                      <tr><th>Departments</th>     <td>{data.departments?.join(', ') || 'N/A'}</td></tr>
                      <tr><th>Fees</th>            <td><span className="fw-bold text-success">₹{data.fees || 'N/A'}</span></td></tr>
                      {/* ✅ Fix: hospital is a populated object */}
                      <tr><th>Hospital</th>        <td>{data.hospital?.name || 'N/A'}</td></tr>
                      <tr><th>Available Days</th>  <td>{data.availableDays?.join(', ') || 'N/A'}</td></tr>
                      {/* ✅ Fix: Nurse schema has "availableTime" string not shiftType/openTime/closeTime */}
                      <tr><th>Available Time</th>  <td>{data.availableTime || 'N/A'}</td></tr>
                      <tr><th>Bio</th>             <td>{data.bio           || 'N/A'}</td></tr>

                      {/* ── Patient Info (read only) ── */}
                      <tr>
                        <th>Your Name</th>
                        <td><input className="form-control" value={userdata.name} readOnly /></td>
                      </tr>
                      <tr>
                        <th>Your Email</th>
                        <td><input className="form-control" value={userdata.email} readOnly /></td>
                      </tr>

                      {/* ── Date ── */}
                      <tr>
                        <th>Date <span className="text-danger">*</span></th>
                        <td>
                          <input
                            type="date"
                            className="form-control"
                            value={reservationDate}
                            min={today}
                            max={max}
                            onChange={handleDateChange}
                          />
                          {errorMessage && (
                            <p className="text-danger small mt-1">{errorMessage}</p>
                          )}
                        </td>
                      </tr>

                      {/* ✅ Auto day name */}
                      {reservationDate && (
                        <tr>
                          <th>Day</th>
                          <td>
                            {new Date(reservationDate + 'T00:00:00')
                              .toLocaleDateString('en-US', { weekday: 'long' })}
                          </td>
                        </tr>
                      )}

                      {/* ── Payment Mode ── */}
                      <tr>
                        <th>Payment Mode</th>
                        <td>
                          <select
                            className="form-select"
                            value={paymentMode}
                            onChange={e => setPaymentMode(e.target.value)}
                          >
                            {/* ✅ Fix: was "COD" — schema enum is "Cash"/"Net Banking" */}
                            <option value="Cash">Cash</option>
                            <option value="Net Banking">Net Banking / UPI / Card</option>
                          </select>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2}>
                          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                            Book Now
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>

      {relatedNurses.length > 0 && (
        <Nurse title="Other Related Nurses" data={relatedNurses} />
      )}
    </>
  )
}