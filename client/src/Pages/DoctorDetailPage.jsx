import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctor } from '../Redux/ActionCreators/DoctorActionCreators'
import { createDoctorAppointment, getDoctorAppointment } from '../Redux/ActionCreators/DoctorAppointmentActionCreators'
import Doctor from '../Components/Doctors'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'
const BORDER = 'rgba(6,163,218,0.22)'

function InfoRow({ icon, label, value, highlight, html }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'11px 0', borderBottom:'1px solid rgba(6,163,218,0.07)' }}>
      <div style={{ width:32, height:32, flexShrink:0, background:'rgba(6,163,218,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <i className={`fa ${icon}`} style={{ color:P, fontSize:12 }} />
      </div>
      <div style={{ flex:1 }}>
        <p style={{ margin:'0 0 1px', fontSize:'0.72rem', color:GRAY, fontWeight:500 }}>{label}</p>
        {html
          ? <div dangerouslySetInnerHTML={{ __html: html }} style={{ margin:0, fontSize:'0.9rem', fontWeight:600, color:DARK }} />
          : <p style={{ margin:0, fontSize:'0.9rem', fontWeight: highlight ? 800 : 600, color: highlight ? S : (value ? DARK : GRAY) }}>
              {value || 'N/A'}
            </p>
        }
      </div>
    </div>
  )
}

function FormSelect({ label, value, onChange, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <select value={value} onChange={onChange} style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${BORDER}`, borderRadius:10, fontSize:'0.9rem', background:'#fff', color:DARK, outline:'none', appearance:'none', fontFamily:"'Jost',sans-serif", cursor:'pointer' }}
          onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=BORDER}
        >
          {children}
        </select>
        <i className="fa fa-chevron-down" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:P, fontSize:'0.72rem', pointerEvents:'none' }} />
      </div>
    </div>
  )
}

export default function DoctorDetailPage() {
  const { _id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(); maxDate.setDate(new Date().getDate()+7)
  const max = maxDate.toISOString().split('T')[0]

  const DoctorStateData            = useSelector(s => s.DoctorStateData)            || []
  const DoctorAppointmentStateData = useSelector(s => s.DoctorAppointmentStateData) || []

  const [data,            setData]           = useState({ name:'', pic:'', email:'', qualification:'', specialization:'', experience:'', fees:'', hospital:'', availableTime:'', availableDays:[], bio:'', reservationDate:'' })
  const [errorMessage,    setErrorMessage]   = useState({ reservationDate:'Date is required' })
  const [relatedDoctors,  setRelatedDoctors] = useState([])
  const [appointmentMode, setAppointmentMode] = useState('Offline')
  const [paymentMode,     setPaymentMode]    = useState('Cash')
  const [userdata, setUserData] = useState({
  name: '',
  email: ''
});

useEffect(() => {
  (async () => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem('userid')}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.getItem('token'),
          },
        }
      );

      res = await res.json();

      if (res.result === 'Done') {
        setUserData(res.data);
      }
    } catch (error) {
      console.log(error);
      alert('Internal Server Error');
    }
  })();
}, []);

  useEffect(() => { dispatch(getDoctor()); dispatch(getDoctorAppointment()) }, [dispatch])

  // useEffect(() => {
  //   const userId = localStorage.getItem('userid'); if(!userId) return
  //   ;(async()=>{
  //     try {
  //       let res = await fetch(
  //       `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem('userid')}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'content-type': 'application/json',
  //           authorization: localStorage.getItem('token'),
  //         },
  //       }
  //     );
  //       const result=await res.json()
  //       const list=Array.isArray(result)?result:result.data||[]
  //       const item=list.find(x=>x._id===userId)
  //       if(item) setUserData({name:item.name,email:item.email})
  //     }catch{}
  //   })()
  // },[])

  useEffect(() => {
    if(DoctorStateData.length>0&&_id){
      const item=DoctorStateData.find(x=>x._id===_id)
      if(item) setData({...item,reservationDate:''})
    }
  },[DoctorStateData,_id])

  useEffect(()=>{
    if(DoctorStateData.length>0&&data.specialization){
      const specId=data.specialization?._id||data.specialization
      setRelatedDoctors(DoctorStateData.filter(x=>{
        const xId=x.specialization?._id||x.specialization
        return x._id!==_id&&x.active&&String(xId)===String(specId)
      }))
    }
  },[DoctorStateData,data.specialization,_id])

  function handleDateChange(e) {
    const d=e.target.value; if(!d) return
    const diff=Math.ceil((new Date(d+'T00:00:00')-new Date(today+'T00:00:00'))/(864e5))
    if(diff>7){alert('Please select a date within the next 7 days.');setData(p=>({...p,reservationDate:''}));return}
    setData(p=>({...p,reservationDate:d}));setErrorMessage(p=>({...p,reservationDate:''}))
  }

  async function postData(e) {
    e.preventDefault()
    if(!data.reservationDate){setErrorMessage(p=>({...p,reservationDate:'Date is required'}));return}
    if(!localStorage.getItem('login')){alert('Please login to book.');navigate('/login');return}
    const userId=localStorage.getItem('userid')
    const dupe=DoctorAppointmentStateData.find(x=>{
      const xD=x.date?new Date(x.date).toISOString().split('T')[0]:''
      return (x.user?._id||x.user)===userId&&(x.doctor?._id||x.doctor)===_id&&xD===data.reservationDate
    })
    if(dupe){alert('You already booked this doctor on this date.');return}
    const taken=DoctorAppointmentStateData.find(x=>{
      const xD=x.date?new Date(x.date).toISOString().split('T')[0]:''
      return (x.doctor?._id||x.doctor)===_id&&xD===data.reservationDate
    })
    if(taken){alert(`Doctor is already booked on ${data.reservationDate}. Please choose another date.`);return}
  if (window.confirm('Confirm this appointment?')) {
  // Step 1: create and capture the response
  const createRes = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/doctorAppointment`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: localStorage.getItem('token'),
    },
    body: JSON.stringify({
      user: userId, doctor: _id,
      hospital: data.hospital?._id || data.hospital || undefined,
      serviceType: 'Consultation',
      date: data.reservationDate,
      appointmentTime: data.availableTime || '',
      fees: data.fees,
      appointmentStatus: true,
      paymentStatus: 'Pending',
      paymentMode,
      appointmentMode,
    }),
  })
  const createJson = await createRes.json()
  console.log('create response:', JSON.stringify(createJson, null, 2))

  // Step 2: get _id directly from create response
  const newId = createJson?.data?._id || createJson?._id || createJson?.data?.id

  console.log('newId:', newId)

  // Step 3: also update Redux state
  await dispatch(getDoctorAppointment())

  navigate(`/confirmation/doctor/${newId}`)
}
  }

  return (
    <>
      <HeroSection title={`Dr. ${data.name}`} />
      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', padding:'56px 16px 80px' }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>

          {/* Page heading */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:12, border:`1px solid rgba(6,163,218,0.22)` }}>Doctor Profile</span>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'2rem', fontWeight:800, color:DARK, margin:'0 0 4px' }}>{data.name}</h2>
            <p style={{ color:P, fontWeight:600, margin:0 }}>{data.specialization?.name||''}</p>
          </div>

          <form onSubmit={postData}>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap', alignItems:'flex-start' }}>

              {/* Image + quick stats */}
              <div style={{ flex:'0 0 300px' }}>
                <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:`1px solid rgba(6,163,218,0.12)`, boxShadow:'0 8px 32px rgba(9,30,62,0.10)' }}>
                  {data.pic && <img src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`} alt={data.name} style={{ width:'100%', height:320, objectFit:'cover', display:'block' }} />}
                  <div style={{ padding:'20px 20px 24px' }}>
                    {/* Quick badges */}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                      {[
                        { icon:'fa-star', text:`${data.experience||0}y Exp` },
                        { icon:'fa-rupee-sign', text:`₹${data.fees||0}` },
                        { icon:'fa-clock', text:data.availableTime||'N/A' },
                      ].map(({icon,text}) => (
                        <span key={text} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', background:'rgba(6,163,218,0.08)', color:P, borderRadius:50, fontSize:'0.75rem', fontWeight:700, border:`1px solid rgba(6,163,218,0.18)` }}>
                          <i className={`fa ${icon}`} style={{fontSize:'0.68rem'}} />{text}
                        </span>
                      ))}
                    </div>
                    {data.availableDays?.length>0 && (
                      <div>
                        <p style={{ margin:'0 0 8px', fontSize:'0.75rem', color:GRAY, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Available Days</p>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {data.availableDays.map(d => <span key={d} style={{ padding:'3px 10px', background:`rgba(6,163,218,0.08)`, color:P, borderRadius:50, fontSize:'0.72rem', fontWeight:700 }}>{d}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details + booking */}
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'28px', boxShadow:'0 8px 32px rgba(9,30,62,0.10)', marginBottom:24 }}>
                  <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:18, fontSize:'1rem' }}>Doctor Details</h6>
                  <InfoRow icon="fa-user"          label="Full Name"       value={data.name} />
                  <InfoRow icon="fa-envelope"      label="Email"           value={data.email} />
                  <InfoRow icon="fa-graduation-cap" label="Qualification"  value={data.qualification} />
                  <InfoRow icon="fa-stethoscope"   label="Specialization"  value={data.specialization?.name} />
                  <InfoRow icon="fa-history"       label="Experience"      value={data.experience?`${data.experience} years`:null} />
                  <InfoRow icon="fa-rupee-sign"    label="Consultation Fee" value={data.fees?`₹${data.fees}`:null} highlight />
                  <InfoRow icon="fa-hospital"      label="Hospital"        value={data.hospital?.name} />
                  {data.bio && <InfoRow icon="fa-info-circle" label="Bio" html={data.bio} />}
                </div>

                {/* Booking form */}
                <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'28px', boxShadow:'0 8px 32px rgba(9,30,62,0.10)' }}>
                  <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:20, fontSize:'1rem', display:'flex', alignItems:'center', gap:8 }}>
                    <i className="fa fa-calendar-check" style={{ color:P }} />Book Appointment
                  </h6>

                  {/* Patient info (readonly) */}
                  <div style={{ background:'rgba(6,163,218,0.04)', borderRadius:12, padding:'4px 12px', marginBottom:20 }}>
                    {[['fa-user','Patient Name',userdata.name],['fa-envelope','Email',userdata.email]].map(([icon,label,value])=>(
                      <div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(6,163,218,0.07)' }}>
                        <div style={{ width:30,height:30,flexShrink:0,background:'rgba(6,163,218,0.08)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center' }}>
                          <i className={`fa ${icon}`} style={{ color:P, fontSize:11 }} />
                        </div>
                        <div>
                          <p style={{ margin:'0 0 1px',fontSize:'0.72rem',color:GRAY,fontWeight:500 }}>{label}</p>
                          <p style={{ margin:0,fontSize:'0.88rem',fontWeight:600,color:DARK }}>{value||'—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                    <FormSelect label="Appointment Mode" value={appointmentMode} onChange={e=>setAppointmentMode(e.target.value)}>
                      <option>Offline</option><option>Online</option><option>Chat</option>
                    </FormSelect>
                    <FormSelect label="Payment Mode" value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
                      <option value="Cash">Cash</option>
                      <option value="Net Banking">Net Banking / UPI / Card</option>
                    </FormSelect>
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7 }}>
                      Appointment Date <span style={{color:'#ef4444'}}>*</span>
                    </label>
                    <input type="date" name="reservationDate" min={today} max={max} value={data.reservationDate||''} onChange={handleDateChange}
                      style={{ width:'100%', padding:'11px 14px', border:`1.5px solid ${errorMessage.reservationDate?'#ef4444':BORDER}`, borderRadius:10, fontSize:'0.9rem', background:'#fff', color:DARK, outline:'none', fontFamily:"'Jost',sans-serif", boxSizing:'border-box' }}
                      onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=errorMessage.reservationDate?'#ef4444':BORDER}
                    />
                    {errorMessage.reservationDate && <p style={{ color:'#ef4444',fontSize:'0.76rem',margin:'4px 0 0' }}>{errorMessage.reservationDate}</p>}
                    {data.reservationDate && <p style={{ color:P,fontSize:'0.78rem',margin:'6px 0 0',fontWeight:600 }}>{new Date(data.reservationDate+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>}
                  </div>

                  <button type="submit" style={{ width:'100%', padding:'13px', border:'none', borderRadius:50, background:`linear-gradient(135deg,${P},#0080b0)`, color:'#fff', fontSize:'0.95rem', fontWeight:700, cursor:'pointer', fontFamily:"'Jost',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 6px 18px rgba(6,163,218,0.3)`, transition:'all .25s' }}
                    onMouseEnter={e=>e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)`}
                    onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)`}
                  >
                    <i className="fa fa-calendar-check" />Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {relatedDoctors.length>0 && <Doctor title="Other Related Doctors" data={relatedDoctors} />}
    </>
  )
}