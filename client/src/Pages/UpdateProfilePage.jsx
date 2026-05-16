import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'
import imageValidator from '../FormValidator/imageValidator'
import formValidator from '../FormValidator/formValidator'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'
const BORDER = 'rgba(6,163,218,0.22)'

const inputStyle = {
  width:'100%', padding:'11px 14px 11px 40px',
  border:`1.5px solid ${BORDER}`,
  borderRadius:10, fontSize:'0.88rem',
  background:'#fff', color:DARK, outline:'none',
  boxSizing:'border-box', fontFamily:"'Jost',sans-serif",
  transition:'border-color .2s',
}

export default function UpdateProfilePage() {
  const navigate = useNavigate()
  const [data, setData] = useState({ name:'', phone:'', address:'', city:'', state:'', pin:'', pic:'' })
  const [errorMessage, setErrorMessage] = useState({ name:'', phone:'', pic:'' })
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem('userid')}`, { method:'GET', headers:{ 'content-type':'application/json',"authorization": localStorage.getItem("token") } })
        res = await res.json()
        if (res.result==='Done') setData(res.data)
      } catch { alert('Internal Server Error') }
    })()
  }, [])

  function getInputData(e) {
    const name  = e.target.name
    const value = e.target.files ? 'profile/'+e.target.files[0].name : e.target.value
    if (name !== 'active') setErrorMessage(old => ({ ...old, [name]: e.target.files ? imageValidator(e) : formValidator(e) }))
    setData(old => ({ ...old, [name]:value }))
  }

  async function postData(e) {
    e.preventDefault()
    const err = Object.values(errorMessage).find(x => x !== '')
    if (err) { setShow(true); return }
    setSaving(true)
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem('userid')}`, {
        method:'PUT', headers:{ 'content-type':'application/json' },
        body: JSON.stringify({ ...data }),
      })
      res = await res.json()
      if (res.result==='Done') navigate(data.role==='Buyer' ? '/profile' : '/admin')
      else alert('Something went wrong')
    } catch { alert('Internal Server Error') }
    finally { setSaving(false) }
  }

  const Field = ({ name, type='text', placeholder, icon, value, textarea }) => (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:8, letterSpacing:'0.02em' }}>{placeholder}</label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:12, top: textarea ? 13 : '50%', transform: textarea ? 'none' : 'translateY(-50%)', color:P, fontSize:12, pointerEvents:'none' }}>
          <i className={`fa ${icon}`} />
        </span>
        {textarea ? (
          <textarea name={name} value={value} onChange={getInputData} rows={3} placeholder={placeholder}
            style={{ ...inputStyle, padding:'11px 14px 11px 40px', resize:'none', lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=BORDER}
          />
        ) : (
          <input type={type} name={name} value={value} onChange={getInputData} placeholder={placeholder}
            style={{ ...inputStyle, borderColor: show&&errorMessage[name] ? '#ef4444' : BORDER }}
            onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=show&&errorMessage[name]?'#ef4444':BORDER}
          />
        )}
      </div>
      {show && errorMessage[name] && <p style={{ color:'#ef4444', fontSize:'0.76rem', margin:'4px 0 0' }}>{errorMessage[name]}</p>}
    </div>
  )

  return (
    <>
      <HeroSection title="Update Profile" />
      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'70vh', padding:'56px 16px' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:12, border:`1px solid rgba(6,163,218,0.22)` }}>
              Account
            </span>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'2rem', fontWeight:800, color:DARK, margin:0 }}>Update Your Profile</h2>
          </div>

          <div style={{ background:'#FFFBF7', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'36px 32px', boxShadow:'0 8px 32px rgba(9,30,62,0.10)' }}>
            <form onSubmit={postData}>

              {/* Personal */}
              <div style={{ marginBottom:6 }}>
                <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:18, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
                  <div style={{ width:28, height:28, background:'rgba(6,163,218,0.10)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className="fa fa-user" style={{ color:P, fontSize:11 }} />
                  </div>
                  Personal Information
                </h6>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                  <Field name="name"  placeholder="Full Name"     icon="fa-user"  value={data.name} />
                  <Field name="phone" type="number" placeholder="Phone Number" icon="fa-phone" value={data.phone} />
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom:6 }}>
                <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:18, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
                  <div style={{ width:28, height:28, background:'rgba(6,163,218,0.10)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className="fa fa-map-marker-alt" style={{ color:P, fontSize:11 }} />
                  </div>
                  Address Details
                </h6>
                <Field name="address" placeholder="Street Address" icon="fa-map-marker-alt" value={data.address} textarea />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px' }}>
                  <Field name="state" placeholder="State"    icon="fa-flag"    value={data.state} />
                  <Field name="city"  placeholder="City"     icon="fa-city"    value={data.city} />
                  <Field name="pin"   type="number" placeholder="PIN Code" icon="fa-hashtag" value={data.pin} />
                </div>
              </div>

              {/* Profile pic */}
              <div style={{ marginBottom:24 }}>
                <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, marginBottom:18, display:'flex', alignItems:'center', gap:8, fontSize:'0.95rem' }}>
                  <div style={{ width:28, height:28, background:'rgba(6,163,218,0.10)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className="fa fa-camera" style={{ color:P, fontSize:11 }} />
                  </div>
                  Profile Picture
                </h6>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:P, fontSize:12, pointerEvents:'none' }}><i className="fa fa-image" /></span>
                  <input type="file" name="pic" onChange={getInputData}
                    style={{ ...inputStyle, cursor:'pointer', paddingTop:8, paddingBottom:8 }} />
                </div>
                {show && errorMessage.pic && <p style={{ color:'#ef4444', fontSize:'0.76rem', margin:'4px 0 0' }}>{errorMessage.pic}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving} style={{
                width:'100%', padding:'13px', border:'none', borderRadius:50,
                background: saving ? '#B4B2A9' : `linear-gradient(135deg,${P},#0080b0)`,
                color:'#fff', fontSize:'0.95rem', fontWeight:700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily:"'Jost',sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:`0 6px 18px rgba(6,163,218,0.3)`, transition:'all .25s',
              }}
                onMouseEnter={e=>{ if(!saving) e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)` }}
                onMouseLeave={e=>{ if(!saving) e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)` }}
              >
                {saving
                  ? <><div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .8s linear infinite' }} />Saving…</>
                  : <><i className="fa fa-save" />Save Changes</>
                }
              </button>

            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}