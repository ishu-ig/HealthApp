import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import formValidator from '../FormValidator/formValidator'
import { createContactUs } from '../Redux/ActionCreators/ContactUsActionCreators'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E'

const infoCards = [
  { icon:'fa-map-marker-alt', title:'Our Address',  value:'A-43 Sector-16, Noida', href:'https://www.google.com/maps/place/DUCAT/@28.5798005,77.3120918' },
  { icon:'fa-phone',          title:'Call Us',       value:'+012 3456 7890',         href:'tel:+0123456789' },
  { icon:'fa-envelope',       title:'Email Us',      value:'info@example.com',       href:'mailto:info@example.com' },
  { icon:'fab fa-whatsapp',   title:'WhatsApp',      value:'+91-8218635347',          href:'https://wa.me/918218635347' },
]

const inputStyle = (hasErr) => ({
  width:'100%', padding:'12px 14px 12px 42px',
  border:`1.5px solid ${hasErr ? '#ef4444' : 'rgba(6,163,218,0.25)'}`,
  borderRadius:10, fontSize:'0.9rem', background:'#fff',
  color:DARK, outline:'none', boxSizing:'border-box',
  fontFamily:'inherit', transition:'border-color .2s',
})

export default function ContactUs() {
  const [data, setData] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [errorMessage, setErrorMessage] = useState({
    name:'Name field is mandatory', email:'Email field is mandatory',
    phone:'Phone field is mandatory', subject:'Subject field is mandatory',
    message:'Message field is mandatory',
  })
  const [show, setShow] = useState(false)
  const [success, setSuccess] = useState('')
  const dispatch = useDispatch()

  function getInputData(e) {
    const { name, value } = e.target
    setErrorMessage(old => ({ ...old, [name]: formValidator(e) }))
    setData(old => ({ ...old, [name]: value }))
  }

  function postData(e) {
    e.preventDefault()
    const err = Object.values(errorMessage).find(x => x !== '')
    if (err) { setShow(true); return }
    dispatch(createContactUs({ ...data, active:true, date:new Date() }))
    setSuccess('Thank you! Our team will contact you shortly.')
    setShow(false)
    setData({ name:'', email:'', phone:'', subject:'', message:'' })
  }

  const Field = ({ name, type='text', placeholder, icon, rows }) => (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:7, letterSpacing:'0.02em' }}>
        {placeholder}
      </label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:13, top: rows ? 13 : '50%', transform: rows ? 'none' : 'translateY(-50%)', color:P, fontSize:13, pointerEvents:'none' }}>
          <i className={`fa ${icon}`} />
        </span>
        {rows ? (
          <textarea name={name} value={data[name]} onChange={getInputData} rows={rows} placeholder={placeholder}
            style={{ ...inputStyle(show && errorMessage[name]), padding:'12px 14px 12px 42px', resize:'none', lineHeight:1.6 }}
            onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=show&&errorMessage[name]?'#ef4444':'rgba(6,163,218,0.25)'}
          />
        ) : (
          <input type={type} name={name} value={data[name]} onChange={getInputData} placeholder={placeholder}
            style={inputStyle(show && errorMessage[name])}
            onFocus={e=>e.target.style.borderColor=P} onBlur={e=>e.target.style.borderColor=show&&errorMessage[name]?'#ef4444':'rgba(6,163,218,0.25)'}
          />
        )}
      </div>
      {show && errorMessage[name] && <p style={{ color:'#ef4444', fontSize:'0.76rem', margin:'5px 0 0' }}>{errorMessage[name]}</p>}
    </div>
  )

  return (
    <div style={{ background:'linear-gradient(135deg,#f0f8ff 0%,#fff 100%)', padding:'72px 0' }}>
      <div className="container">

        {/* Header */}
        <div className="text-center mb-5" style={{ maxWidth:560, margin:'0 auto 48px' }}>
          <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:14, border:`1px solid rgba(6,163,218,0.22)` }}>
            Get In Touch
          </span>
          <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:DARK, marginBottom:12 }}>
            Contact for Any <span style={{color:P}}>Query</span>
          </h2>
          <div style={{ width:56, height:4, background:`linear-gradient(90deg,${P},${S})`, borderRadius:4, margin:'0 auto' }} />
        </div>

        {/* Info cards */}
        <div className="row g-4 mb-5">
          {infoCards.map(({ icon, title, value, href }) => (
            <div key={title} className="col-md-6 col-lg-3">
              <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
                <div style={{
                  background:'#fff', borderRadius:16,
                  border:`1px solid rgba(6,163,218,0.12)`,
                  padding:'22px 20px',
                  boxShadow:'0 4px 16px rgba(9,30,62,0.07)',
                  display:'flex', alignItems:'center', gap:14,
                  transition:'transform .3s, box-shadow .3s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(9,30,62,0.14)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 16px rgba(9,30,62,0.07)'}}
                >
                  <div style={{ width:50, height:50, flexShrink:0, background:`linear-gradient(135deg,${P},#0080b0)`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px rgba(6,163,218,0.35)` }}>
                    <i className={icon} style={{ color:'#fff', fontSize:'1.1rem' }} />
                  </div>
                  <div>
                    <p style={{ margin:0, fontSize:'0.75rem', color:'#7a8fae', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{title}</p>
                    <p style={{ margin:0, fontWeight:700, fontSize:'0.88rem', color:DARK }}>{value}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Map + Form */}
        <div className="row g-4">
          {/* Map */}
          <div className="col-lg-6">
            <div style={{ borderRadius:20, overflow:'hidden', height:'100%', minHeight:420, boxShadow:'0 8px 32px rgba(9,30,62,0.10)', border:`1px solid rgba(6,163,218,0.12)` }}>
              <iframe
                width="100%" height="100%"
                title="Office Location"
                src="https://maps.google.com/maps?q=A-43%20Sector-16%20Noida&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ border:0, display:'block', minHeight:420 }}
              />
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-6">
            <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'36px 32px', boxShadow:'0 8px 32px rgba(9,30,62,0.08)' }}>
              <h5 style={{ fontFamily:"'Jost',sans-serif", fontWeight:800, color:DARK, marginBottom:24, fontSize:'1.2rem' }}>
                Send Us a Message
              </h5>

              {success && (
                <div style={{ background:'rgba(6,163,218,0.08)', border:`1px solid rgba(6,163,218,0.2)`, borderRadius:10, padding:'12px 16px', marginBottom:20, color:P, fontWeight:600, fontSize:'0.88rem', display:'flex', alignItems:'center', gap:8 }}>
                  <i className="fa fa-check-circle" />{success}
                </div>
              )}

              <form onSubmit={postData} noValidate>
                <div className="row g-0">
                  <div className="col-md-6 pe-md-2">
                    <Field name="name"    placeholder="Full Name"    icon="fa-user" />
                  </div>
                  <div className="col-md-6 ps-md-2">
                    <Field name="email"   type="email" placeholder="Email Address" icon="fa-envelope" />
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col-md-6 pe-md-2">
                    <Field name="phone"   type="tel" placeholder="Phone Number" icon="fa-phone" />
                  </div>
                  <div className="col-md-6 ps-md-2">
                    <Field name="subject" placeholder="Subject"      icon="fa-tag" />
                  </div>
                </div>
                <Field name="message" placeholder="Your Message" icon="fa-comment" rows={4} />

                <button type="submit" style={{
                  width:'100%', padding:'13px',
                  background:`linear-gradient(135deg,${P},#0080b0)`,
                  color:'#fff', border:'none', borderRadius:50,
                  fontSize:'0.95rem', fontWeight:700, cursor:'pointer',
                  fontFamily:"'Jost',sans-serif",
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'all .25s',
                  boxShadow:'0 6px 18px rgba(6,163,218,0.35)',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)`;e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)`;e.currentTarget.style.transform=''}}
                >
                  <i className="fa fa-paper-plane" />Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}