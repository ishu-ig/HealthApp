import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecialization } from '../Redux/ActionCreators/SpecializationActionCreators';
import { getDoctor } from '../Redux/ActionCreators/DoctorActionCreators';
import { getNurse } from '../Redux/ActionCreators/NurseActionCreators';
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators';
import { useNavigate } from 'react-router-dom';
import { createDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators';
import formValidator from '../FormValidator/formValidator';

export default function Appointment() {
  const dispatch = useDispatch();
  const SpecializationStateData    = useSelector(state => state.SpecializationStateData)    || [];
  const DoctorStateData            = useSelector(state => state.DoctorStateData)            || [];
  const NurseStateData             = useSelector(state => state.NurseStateData)             || [];
  const MedicineCategoryStateData  = useSelector(state => state.MedicineCategoryStateData)  || [];
  const DoctorAppointmentStateData = useSelector(state => state.DoctorAppointmentStateData) || [];
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [appointeeType,    setAppointeeType]    = useState('');
  const [appointmentMode,  setAppointmentMode]  = useState('Offline');
  const [doctorData,       setDoctorData]       = useState(null);
  const [nurseData,        setNurseData]        = useState(null);
  const [show,             setShow]             = useState(false);
  const [error,            setError]            = useState('');
  const [userdata,         setUserData]         = useState({ name: '', email: '' });

  const [data, setData] = useState({
    specializationId: '',   // ✅ store the _id of selected specialization
    doctor:           '',
    department:       '',   // ✅ single selected department string
    nurse:            '',
    medicineCategory: '',
    date:             '',
    paymentMode:      'Cash',
  });

  const [errorMessage, setErrorMessage] = useState({
    date:             'Date is mandatory',
    appointeeType:    'Please select Doctor or Nurse',
    specializationId: '',
    doctor:           '',
    department:       '',
    nurse:            '',
  });

  // ─── Fetch all data on mount ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(getSpecialization());
    dispatch(getDoctor());
    dispatch(getNurse());
    dispatch(getMedicineCategory());
  }, [dispatch]);

  // ─── Fetch logged-in user ──────────────────────────────────────────────────
  useEffect(() => {
    const userId = localStorage.getItem('userid');
    if (!userId) return;
    (async () => {
      try {
        const res    = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        const item   = result.find(x => x._id === userId);
        if (item) setUserData({ name: item.name, email: item.email });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    })();
  }, []);

  // ─── Sync doctorData ───────────────────────────────────────────────────────
  // Doctor.specialization is an ObjectId ref — compare against _id
  useEffect(() => {
    if (data.doctor && data.specializationId) {
      const item = DoctorStateData.find(x => {
        // populated: x.specialization._id  |  unpopulated: x.specialization (raw ObjectId string)
        const specId = x.specialization?._id || x.specialization;
        return x.name === data.doctor && String(specId) === String(data.specializationId);
      });
      setDoctorData(item || null);
    } else {
      setDoctorData(null);
    }
  }, [DoctorStateData, data.doctor, data.specializationId]);

  // ─── Sync nurseData ────────────────────────────────────────────────────────
  useEffect(() => {
    if (data.nurse) {
      const item = NurseStateData.find(x => x.name === data.nurse);
      setNurseData(item || null);
    } else {
      setNurseData(null);
    }
  }, [NurseStateData, data.nurse]);

  // ─── Collect all unique departments from active nurses ────────────────────
  // Nurse.departments is an array of strings e.g. ["ICU", "Pediatrics"]
  const allDepartments = [...new Set(
    NurseStateData
      .filter(n => n.active)
      .flatMap(n => n.departments || [])
  )];

  // ─── Nurses filtered by selected department ───────────────────────────────
  const filteredNurses = NurseStateData.filter(n =>
    n.active && (!data.department || (n.departments || []).includes(data.department))
  );

  // ─── Doctors filtered by selected specialization (_id match) ─────────────
  const filteredDoctors = DoctorStateData.filter(d => {
    if (!d.active) return false;
    if (!data.specializationId) return false;
    const specId = d.specialization?._id || d.specialization; // handle both populated & unpopulated
    return String(specId) === String(data.specializationId);
  });

  // ─── appointeeType change ──────────────────────────────────────────────────
  const handleAppointeeTypeChange = (e) => {
    const type = e.target.value;
    setAppointeeType(type);
    setData(old => ({
      ...old,
      specializationId: '',
      doctor:           '',
      department:       '',
      nurse:            '',
    }));
    setErrorMessage(old => ({
      ...old,
      appointeeType:    '',
      specializationId: type === 'Doctor' ? 'Specialization is mandatory' : '',
      doctor:           type === 'Doctor' ? 'Doctor is mandatory'         : '',
      department:       type === 'Nurse'  ? 'Department is mandatory'     : '',
      nurse:            type === 'Nurse'  ? 'Nurse is mandatory'          : '',
    }));
  };

  // ─── Generic input handler ─────────────────────────────────────────────────
  const getInputData = (e) => {
    const { name, value } = e.target;

    setErrorMessage(old => ({ ...old, [name]: formValidator(e) }));

    // Reset doctor when specialization changes
    if (name === 'specializationId') {
      setData(old => ({ ...old, specializationId: value, doctor: '' }));
      setErrorMessage(old => ({ ...old, doctor: 'Doctor is mandatory' }));
      return;
    }

    // Reset nurse when department changes
    if (name === 'department') {
      setData(old => ({ ...old, department: value, nurse: '' }));
      setErrorMessage(old => ({ ...old, nurse: 'Nurse is mandatory' }));
      return;
    }

    setData(old => ({ ...old, [name]: value }));
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const postData = (e) => {
    e.preventDefault();

    const validationError = Object.values(errorMessage).find(x => x !== '');
    if (validationError || !appointeeType) {
      setShow(true);
      return;
    }

    if (!localStorage.getItem('login')) {
      alert('Please login to book an appointment.');
      navigate('/login');
      return;
    }

    const isBooked = DoctorAppointmentStateData.some(
      appt => appt.doctor?.name === data.doctor && appt.doctor?.reservationDate === data.date
    );
    if (isBooked) {
      alert(`Sorry! ${data.doctor} is already booked on ${data.date}.`);
      return;
    }

    if (appointeeType === 'Doctor' && !doctorData) {
      alert('Selected doctor not found. Please reselect.');
      return;
    }
    if (appointeeType === 'Nurse' && !nurseData) {
      alert('Selected nurse not found. Please reselect.');
      return;
    }

    if (window.confirm('Are you sure you want to book this appointment?')) {
      dispatch(createDoctorAppointment({
        user:              localStorage.getItem('userid'),
        appointmentStatus: true,
        paymentStatus:     'Pending',
        paymentMode:       data.paymentMode,
        appointmentMode:   appointmentMode,
        appointeeType:     appointeeType,
        medicineCategory:  data.medicineCategory,
        ...(appointeeType === 'Doctor'
          ? { doctor: { ...doctorData, reservationDate: data.date } }
          : { nurse:  { ...nurseData,  reservationDate: data.date } }),
        createdAt: new Date(),
      }));

      alert('Appointment booked successfully!');
      setData({ specializationId: '', doctor: '', department: '', nurse: '', medicineCategory: '', date: '', paymentMode: 'Cash' });
      setAppointeeType('');
      setAppointmentMode('Offline');
      setShow(false);
      setError('');
      navigate('/appointment');
    }
  };

  return (
    <>
      <HeroSection />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg p-4 rounded">
              <h2 className="text-center mb-4 fw-bold text-primary">Book an Appointment</h2>
              <form onSubmit={postData}>

                {/* ── Step 1: Doctor or Nurse ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Appointment With <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select border-primary"
                    value={appointeeType}
                    onChange={handleAppointeeTypeChange}
                  >
                    <option value="">-- Select --</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                  </select>
                  {show && !appointeeType && (
                    <p className="text-danger small">Please select Doctor or Nurse</p>
                  )}
                </div>

                {/* ── Step 2A: Doctor flow ── */}
                {appointeeType === 'Doctor' && (
                  <>
                    {/* Specialization — value is _id, label is name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Specialization <span className="text-danger">*</span>
                      </label>
                      <select
                        name="specializationId"
                        className="form-select border-primary"
                        value={data.specializationId}
                        onChange={getInputData}
                      >
                        <option value="">Select Specialization</option>
                        {SpecializationStateData.filter(s => s.active).map(s => (
                          // ✅ key=s._id, value=s._id so we compare ObjectIds correctly
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                      {show && errorMessage.specializationId && (
                        <p className="text-danger small">{errorMessage.specializationId}</p>
                      )}
                    </div>

                    {/* Doctor — filtered by specializationId */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Select Doctor <span className="text-danger">*</span>
                      </label>
                      <select
                        name="doctor"
                        className="form-select border-primary"
                        value={data.doctor}
                        onChange={getInputData}
                        disabled={!data.specializationId}
                      >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map(d => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                      {show && errorMessage.doctor && (
                        <p className="text-danger small">{errorMessage.doctor}</p>
                      )}
                      {/* ✅ Helpful message when specialization has no doctors */}
                      {data.specializationId && filteredDoctors.length === 0 && (
                        <p className="text-warning small">No doctors available for this specialization.</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Step 2B: Nurse flow ── */}
                {appointeeType === 'Nurse' && (
                  <>
                    {/* Department — derived from nurse.departments[] array */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        name="department"
                        className="form-select border-primary"
                        value={data.department}
                        onChange={getInputData}
                      >
                        <option value="">Select Department</option>
                        {allDepartments.map((dept, i) => (
                          <option key={i} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {show && errorMessage.department && (
                        <p className="text-danger small">{errorMessage.department}</p>
                      )}
                    </div>

                    {/* Nurse — filtered by selected department */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Select Nurse <span className="text-danger">*</span>
                      </label>
                      <select
                        name="nurse"
                        className="form-select border-primary"
                        value={data.nurse}
                        onChange={getInputData}
                        disabled={!data.department}
                      >
                        <option value="">Select Nurse</option>
                        {filteredNurses.map(n => (
                          <option key={n._id} value={n.name}>{n.name}</option>
                        ))}
                      </select>
                      {show && errorMessage.nurse && (
                        <p className="text-danger small">{errorMessage.nurse}</p>
                      )}
                      {/* ✅ Helpful message when department has no nurses */}
                      {data.department && filteredNurses.length === 0 && (
                        <p className="text-warning small">No nurses available for this department.</p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Step 3: Medicine Category ── */}
                {/* {appointeeType && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Medicine Category</label>
                    <select
                      name="medicineCategory"
                      className="form-select"
                      value={data.medicineCategory}
                      onChange={getInputData}
                    >
                      <option value="">Select Medicine Category (Optional)</option>
                      {MedicineCategoryStateData.filter(c => c.active).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )} */}

                {/* ── User Info ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input type="text" className="form-control" value={userdata.name} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input type="email" className="form-control" value={userdata.email} readOnly />
                </div>

                {/* ── Appointment Mode ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Appointment Mode</label>
                  <select
                    className="form-select"
                    value={appointmentMode}
                    onChange={e => setAppointmentMode(e.target.value)}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>

                {/* ── Date ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Appointment Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    min={today}
                    value={data.date}
                    onChange={getInputData}
                  />
                  {show && errorMessage.date && (
                    <p className="text-danger small">{errorMessage.date}</p>
                  )}
                </div>

                {/* ── Day ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Day</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      data.date
                        ? new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })
                        : '-'
                    }
                    readOnly
                  />
                </div>

                {/* ── Payment ── */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Payment Mode</label>
                  <select
                    name="paymentMode"
                    className="form-select"
                    value={data.paymentMode}
                    onChange={getInputData}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking / UPI / Card</option>
                  </select>
                </div>

                {error && <p className="text-danger mb-3">{error}</p>}

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}