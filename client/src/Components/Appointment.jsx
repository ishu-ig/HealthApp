import React, { useEffect, useState } from 'react'
import HeroSection from './HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getSpecialization } from '../Redux/ActionCreators/SpecializationActionCreators'
import { getDoctor } from '../Redux/ActionCreators/DoctorActionCreators'
import { getNurse } from '../Redux/ActionCreators/NurseActionCreators'
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators'
import { useNavigate } from 'react-router-dom'
import { createDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators'
import formValidator from '../FormValidator/formValidator'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'
const BORDER = 'rgba(6,163,218,0.22)'

/* reusable styled select */
const Select = ({ label, required, children, ...rest }) => (
  <div style={{ marginBottom:18 }}>
    <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7, letterSpacing:'0.02em' }}>
      {label}{required && <span style={{color:'#ef4444'}}> *</span>}
    </label>
    <div style={{ position:'relative' }}>
      <select style={{
        width:'100%', padding:'11px 14px',
        border:`1.5px solid ${BORDER}`,
        borderRadius:10, fontSize:'0.9rem',
        background:'#fff', color:DARK,
        outline:'none', appearance:'none',
        fontFamily:'inherit', cursor:'pointer',
        transition:'border-color .2s',
      }}
        onFocus={e=>e.target.style.borderColor=P}
        onBlur={e=>e.target.style.borderColor=BORDER}
        {...rest}
      >
        {children}
      </select>
      <i className="fa fa-chevron-down" style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', color:P, fontSize:'0.75rem', pointerEvents:'none' }} />
    </div>
  </div>
)

/* reusable readonly info row */
const InfoRow = ({ icon, label, value }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid rgba(6,163,218,0.07)` }}>
    <div style={{ width:32, height:32, flexShrink:0, background:'rgba(6,163,218,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <i className={`fa ${icon}`} style={{ color:P, fontSize:12 }} />
    </div>
    <div>
      <p style={{ margin:0, fontSize:'0.72rem', color:GRAY, fontWeight:500 }}>{label}</p>
      <p style={{ margin:0, fontSize:'0.88rem', fontWeight:600, color:value ? DARK : GRAY }}>{value || '—'}</p>
    </div>
  </div>
)

export default function Appointment() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const today     = new Date().toISOString().split('T')[0]

  const SpecializationStateData    = useSelector(s => s.SpecializationStateData)    || []
  const DoctorStateData            = useSelector(s => s.DoctorStateData)            || []
  const NurseStateData             = useSelector(s => s.NurseStateData)             || []
  const DoctorAppointmentStateData = useSelector(s => s.DoctorAppointmentStateData) || []

  const [appointeeType,   setAppointeeType]   = useState('')
  const [appointmentMode, setAppointmentMode] = useState('Offline')
  const [doctorData,      setDoctorData]      = useState(null)
  const [nurseData,       setNurseData]       = useState(null)
  const [show,            setShow]            = useState(false)
  const [userdata,        setUserData]        = useState({ name:'', email:'' })

  const [data, setData] = useState({ specializationId:'', doctor:'', department:'', nurse:'', date:'', paymentMode:'Cash' })
  const [errorMessage, setErrorMessage] = useState({ date:'Date is mandatory', appointeeType:'Please select Doctor or Nurse', specializationId:'', doctor:'', department:'', nurse:'' })

  useEffect(() => {
    dispatch(getSpecialization()); dispatch(getDoctor()); dispatch(getNurse()); dispatch(getMedicineCategory())
  }, [dispatch])

  useEffect(() => {
  const userId = localStorage.getItem('userid');

  if (!userId) return;

  (async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setUserData({
          name: result.data.name,
          email: result.data.email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  })();
}, []);

  useEffect(() => {
    if (data.doctor && data.specializationId) {
      const item = DoctorStateData.find(x => {
        const specId = x.specialization?._id || x.specialization
        return x.name === data.doctor && String(specId) === String(data.specializationId)
      })
      setDoctorData(item || null)
    } else setDoctorData(null)
  }, [DoctorStateData, data.doctor, data.specializationId])

  useEffect(() => {
    setNurseData(data.nurse ? NurseStateData.find(x => x.name === data.nurse) || null : null)
  }, [NurseStateData, data.nurse])

  const allDepartments  = [...new Set(NurseStateData.filter(n => n.active).flatMap(n => n.departments || []))]
  const filteredNurses  = NurseStateData.filter(n => n.active && (!data.department || (n.departments||[]).includes(data.department)))
  const filteredDoctors = DoctorStateData.filter(d => {
    if (!d.active || !data.specializationId) return false
    return String(d.specialization?._id || d.specialization) === String(data.specializationId)
  })

  const handleAppointeeTypeChange = (e) => {
    const type = e.target.value
    setAppointeeType(type)
    setData(old => ({ ...old, specializationId:'', doctor:'', department:'', nurse:'' }))
    setErrorMessage(old => ({
      ...old, appointeeType:'',
      specializationId: type==='Doctor' ? 'Specialization is mandatory' : '',
      doctor:           type==='Doctor' ? 'Doctor is mandatory' : '',
      department:       type==='Nurse'  ? 'Department is mandatory' : '',
      nurse:            type==='Nurse'  ? 'Nurse is mandatory' : '',
    }))
  }

  const getInputData = (e) => {
    const { name, value } = e.target
    setErrorMessage(old => ({ ...old, [name]:formValidator(e) }))
    if (name === 'specializationId') { setData(old => ({ ...old, specializationId:value, doctor:'' })); setErrorMessage(old => ({ ...old, doctor:'Doctor is mandatory' })); return }
    if (name === 'department')        { setData(old => ({ ...old, department:value, nurse:'' }));       setErrorMessage(old => ({ ...old, nurse:'Nurse is mandatory' }));       return }
    setData(old => ({ ...old, [name]:value }))
  }

  const postData = (e) => {
    e.preventDefault()
    if (Object.values(errorMessage).find(x => x !== '') || !appointeeType) { setShow(true); return }
    if (!localStorage.getItem('login')) { alert('Please login to book an appointment.'); navigate('/login'); return }
    const isBooked = DoctorAppointmentStateData.some(a => a.doctor?.name === data.doctor && a.doctor?.reservationDate === data.date)
    if (isBooked) { alert(`${data.doctor} is already booked on ${data.date}.`); return }
    if (appointeeType==='Doctor' && !doctorData) { alert('Selected doctor not found. Please reselect.'); return }
    if (appointeeType==='Nurse'  && !nurseData)  { alert('Selected nurse not found. Please reselect.');  return }

    if (window.confirm('Confirm this appointment?')) {
      dispatch(createDoctorAppointment({
        user:localStorage.getItem('userid'), appointmentStatus:true,
        paymentStatus:'Pending', paymentMode:data.paymentMode,
        appointmentMode, appointeeType,
        ...(appointeeType==='Doctor' ? { doctor:{ ...doctorData, reservationDate:data.date } } : { nurse:{ ...nurseData, reservationDate:data.date } }),
        createdAt:new Date(),
      }))
      alert('Appointment booked successfully!')
      navigate('/appointment')
    }
  }

  return (
    <>

      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'70vh', padding:'60px 16px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:12, border:`1px solid rgba(6,163,218,0.22)` }}>
              Appointments
            </span>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'2rem', fontWeight:800, color:DARK, margin:0 }}>
              Book an <span style={{color:P}}>Appointment</span>
            </h2>
          </div>

          {/* Card */}
          <div style={{ background:'#FFFBF7', borderRadius:22, border:`1px solid rgba(6,163,218,0.12)`, padding:'36px 32px', boxShadow:'0 10px 40px rgba(9,30,62,0.10)' }}>
            <form onSubmit={postData}>

              {/* Appointee type */}
              <Select label="Appointment With" required value={appointeeType} onChange={handleAppointeeTypeChange}>
                <option value="">-- Select --</option>
                <option>Doctor</option>
                <option>Nurse</option>
              </Select>
              {show && !appointeeType && <p style={{color:'#ef4444',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>Please select Doctor or Nurse</p>}

              {/* Doctor flow */}
              {appointeeType==='Doctor' && (
                <>
                  <Select label="Specialization" required name="specializationId" value={data.specializationId} onChange={getInputData}>
                    <option value="">Select Specialization</option>
                    {SpecializationStateData.filter(s=>s.active).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </Select>
                  {show && errorMessage.specializationId && <p style={{color:'#ef4444',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>{errorMessage.specializationId}</p>}

                  <Select label="Select Doctor" required name="doctor" value={data.doctor} onChange={getInputData} disabled={!data.specializationId}>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </Select>
                  {show && errorMessage.doctor && <p style={{color:'#ef4444',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>{errorMessage.doctor}</p>}
                  {data.specializationId && filteredDoctors.length===0 && <p style={{color:'#f59e0b',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>No doctors available for this specialization.</p>}
                </>
              )}

              {/* Nurse flow */}
              {appointeeType==='Nurse' && (
                <>
                  <Select label="Department" required name="department" value={data.department} onChange={getInputData}>
                    <option value="">Select Department</option>
                    {allDepartments.map((d,i) => <option key={i} value={d}>{d}</option>)}
                  </Select>
                  {show && errorMessage.department && <p style={{color:'#ef4444',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>{errorMessage.department}</p>}

                  <Select label="Select Nurse" required name="nurse" value={data.nurse} onChange={getInputData} disabled={!data.department}>
                    <option value="">Select Nurse</option>
                    {filteredNurses.map(n => <option key={n._id} value={n.name}>{n.name}</option>)}
                  </Select>
                  {show && errorMessage.nurse && <p style={{color:'#ef4444',fontSize:'0.78rem',marginTop:-12,marginBottom:16}}>{errorMessage.nurse}</p>}
                </>
              )}

              {/* User info (readonly) */}
              <div style={{ background:'rgba(6,163,218,0.04)', borderRadius:12, padding:'4px 12px', marginBottom:18 }}>
                <InfoRow icon="fa-user"    label="Your Name"  value={userdata.name} />
                <InfoRow icon="fa-envelope" label="Your Email" value={userdata.email} />
              </div>

              {/* Mode + Date + Payment in 2-col grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                <Select label="Appointment Mode" value={appointmentMode} onChange={e=>setAppointmentMode(e.target.value)}>
                  <option>Offline</option><option>Online</option><option>Chat</option>
                </Select>

                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7, letterSpacing:'0.02em' }}>
                    Appointment Date <span style={{color:'#ef4444'}}>*</span>
                  </label>
                  <input type="date" name="date" min={today} value={data.date} onChange={getInputData}
                    style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${show&&errorMessage.date?'#ef4444':BORDER}`, borderRadius:10, fontSize:'0.9rem', background:'#fff', color:DARK, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                    onFocus={e=>e.target.style.borderColor=P}
                    onBlur={e=>e.target.style.borderColor=show&&errorMessage.date?'#ef4444':BORDER}
                  />
                  {show && errorMessage.date && <p style={{color:'#ef4444',fontSize:'0.78rem',margin:'4px 0 0'}}>{errorMessage.date}</p>}
                </div>

                <Select label="Payment Mode" name="paymentMode" value={data.paymentMode} onChange={getInputData}>
                  <option value="Cash">Cash</option>
                  <option value="Net Banking">Net Banking / UPI / Card</option>
                </Select>

                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7, letterSpacing:'0.02em' }}>Day</label>
                  <div style={{ padding:'11px 14px', border:`1.5px solid rgba(6,163,218,0.12)`, borderRadius:10, fontSize:'0.9rem', color:data.date?DARK:GRAY, background:'#fafafa' }}>
                    {data.date ? new Date(data.date+'T00:00:00').toLocaleDateString('en-US',{weekday:'long'}) : '—'}
                  </div>
                </div>
              </div>

              <button type="submit" style={{
                width:'100%', padding:'13px',
                background:`linear-gradient(135deg,${P},#0080b0)`,
                color:'#fff', border:'none', borderRadius:50,
                fontSize:'0.95rem', fontWeight:700, cursor:'pointer',
                fontFamily:"'Jost',sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:`0 6px 18px rgba(6,163,218,0.35)`, transition:'all .25s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)`;e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)`;e.currentTarget.style.transform=''}}
              >
                <i className="fa fa-calendar-check" />Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}