import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'

export default function Profile({ title }) {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const isCheckout = title === 'Checkout'

  useEffect(() => {
    ;(async () => {
      try {
        const userId  = localStorage.getItem('userid')
        const isLogin = localStorage.getItem('login')
        if (!userId || !isLogin) { navigate('/login'); return }
        const res    = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${userId}`, { method:'GET', headers:{ 'Content-Type':'application/json',"authorization": localStorage.getItem("token") } })
        const result = await res.json()
        result.data ? setData(result.data) : navigate('/login')
      } catch { navigate('/login') }
      finally  { setLoading(false) }
    })()
  }, [navigate])

  if (loading) return (
    <div style={{ minHeight:'50vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, border:`3px solid ${P}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto 14px' }} />
        <p style={{ color:GRAY, fontFamily:"'Jost',sans-serif" }}>Loading profile…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const fields = [
    { icon:'fa-user',        label:'Full Name',     value:data?.name },
    ...(!isCheckout ? [{ icon:'fa-at',    label:'Username',      value:data?.username }] : []),
    { icon:'fa-envelope',    label:'Email Address', value:data?.email },
    { icon:'fa-phone',       label:'Phone',         value:data?.phone },
    { icon:'fa-map-marker-alt', label:'Address',    value:data?.address },
    { icon:'fa-flag',        label:'State',         value:data?.state },
    { icon:'fa-city',        label:'City',          value:data?.city },
    { icon:'fa-hashtag',     label:'PIN Code',      value:data?.pin },
  ]

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'70vh', padding:'48px 16px' }}>
        <div style={{ maxWidth: isCheckout ? 600 : 900, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <span style={{ display:'inline-block', background:'rgba(6,163,218,0.10)', color:P, fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', padding:'5px 18px', borderRadius:50, marginBottom:12, border:`1px solid rgba(6,163,218,0.22)` }}>
              {isCheckout ? 'Checkout' : 'Account'}
            </span>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'2rem', fontWeight:800, color:DARK, margin:'0 0 8px' }}>
              {isCheckout ? 'Billing Address' : 'My Profile'}
            </h2>
          </div>

          <div style={{ display:'flex', gap:24, flexWrap:'wrap', alignItems:'flex-start' }}>

            {/* Avatar card */}
            {!isCheckout && (
              <div style={{ flex:'0 0 220px' }}>
                <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'28px 20px', boxShadow:'0 4px 20px rgba(9,30,62,0.08)', textAlign:'center' }}>
                  <img
                    src={data?.pic ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}` : '/img/noimage.jpg'}
                    alt="Profile"
                    style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', border:`4px solid #fff`, boxShadow:`0 6px 20px rgba(6,163,218,0.25)`, marginBottom:14 }}
                  />
                  <h5 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, margin:'0 0 4px' }}>{data?.name}</h5>
                  <p style={{ color:P, fontSize:'0.8rem', margin:'0 0 16px' }}>@{data?.username}</p>
                  <div style={{ background:'rgba(6,163,218,0.08)', borderRadius:10, padding:'8px 12px', fontSize:'0.78rem', color:P, fontWeight:600 }}>
                    <i className="fa fa-map-marker-alt me-1" />{data?.city || 'No city'}{data?.state ? `, ${data.state}` : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Details card */}
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'28px', boxShadow:'0 4px 20px rgba(9,30,62,0.08)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
                  <h6 style={{ fontFamily:"'Jost',sans-serif", fontWeight:700, color:DARK, margin:0 }}>
                    {isCheckout ? 'Delivery Details' : 'Personal Information'}
                  </h6>
                  <Link to="/update-profile" style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    background:'rgba(6,163,218,0.08)', color:P,
                    padding:'7px 14px', borderRadius:50,
                    fontSize:'0.8rem', fontWeight:600, textDecoration:'none', transition:'all .2s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=P;e.currentTarget.style.color='#fff'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(6,163,218,0.08)';e.currentTarget.style.color=P}}
                  >
                    <i className="fa fa-pen" style={{fontSize:11}} />
                    {isCheckout ? 'Update Address' : 'Edit Profile'}
                  </Link>
                </div>

                {fields.map(({ icon, label, value }) => (
                  <div key={label} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'12px 0', borderBottom:'1px solid rgba(6,163,218,0.07)' }}>
                    <div style={{ width:34, height:34, flexShrink:0, background:'rgba(6,163,218,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <i className={`fa ${icon}`} style={{ color:P, fontSize:12 }} />
                    </div>
                    <div>
                      <p style={{ margin:'0 0 1px', fontSize:'0.72rem', color:GRAY, fontWeight:500 }}>{label}</p>
                      <p style={{ margin:0, fontSize:'0.9rem', color:value ? DARK : GRAY, fontWeight:value ? 600 : 400 }}>{value || 'Not provided'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}