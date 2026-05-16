// ─── LoginPage.jsx ────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'
const BORDER = 'rgba(6,163,218,0.22)'

const inputStyle = (err) => ({
  width:'100%', padding:'12px 14px 12px 42px',
  border:`1.5px solid ${err ? '#ef4444' : BORDER}`,
  borderRadius:10, fontSize:'0.9rem',
  background:'#fff', color:DARK, outline:'none',
  boxSizing:'border-box', fontFamily:"'Jost',sans-serif",
  transition:'border-color .2s',
})

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({ userInput:'', password:'' })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function getInputData(e) {
    const { name, value } = e.target
    setErrorMessage('')
    setData(old => ({ ...old, [name]:value }))
  }

  async function postData(e) {
    e.preventDefault()
    if (!data.userInput || !data.password) { setErrorMessage('Please fill in all fields.'); return }
    setLoading(true)
    try {
      let res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/login`, {
        method:'POST', headers:{ 'content-type':'application/json' },
        body: JSON.stringify({ username:data.userInput, password:data.password }),
      })
      res = await res.json()
      if (res.result==='Done' && res.data.active===false)       setErrorMessage('Your account is not active. Please contact us.')
      else if (res.result === 'Done' && res.data?.role === 'Buyer') {
        localStorage.setItem('login', 'true');
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('userid', res.data._id);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('token', res.token);

        navigate('/profile');
}else if (res.result==='Done')                          setErrorMessage('Admin accounts cannot log in here.')
      else                                                     setErrorMessage('Invalid username/email or password.')
    } catch { alert('Internal server error.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <HeroSection title="Login" />
      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'75vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 16px' }}>
        <div style={{ width:'100%', maxWidth:440 }}>

          {/* Brand */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, background:`linear-gradient(135deg,${P},#0080b0)`, borderRadius:16, marginBottom:16, boxShadow:`0 8px 24px rgba(6,163,218,0.3)` }}>
              <i className="fa fa-heartbeat" style={{ color:'#fff', fontSize:22 }} />
            </div>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:'1.7rem', fontWeight:800, color:DARK, margin:'0 0 6px' }}>Welcome Back</h2>
            <p style={{ color:GRAY, fontSize:'0.88rem', margin:0 }}>Sign in to your HealthCare account</p>
          </div>

          <div style={{ background:'#FFFBF7', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'36px 32px', boxShadow:'0 8px 32px rgba(9,30,62,0.10)' }}>
            <form onSubmit={postData}>
              {/* Username */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:8, letterSpacing:'0.02em' }}>Username or Email</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:P, fontSize:13, pointerEvents:'none' }}><i className="fa fa-user" /></span>
                  <input type="text" name="userInput" value={data.userInput} onChange={getInputData} placeholder="Enter username or email"
                    style={inputStyle(!!errorMessage)}
                    onFocus={e=>e.target.style.borderColor=P}
                    onBlur={e=>e.target.style.borderColor=errorMessage?'#ef4444':BORDER}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontWeight:600, fontSize:'0.82rem', color:DARK, marginBottom:8, letterSpacing:'0.02em' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:P, fontSize:13, pointerEvents:'none' }}><i className="fa fa-lock" /></span>
                  <input type={showPassword?'text':'password'} name="password" value={data.password} onChange={getInputData} placeholder="Enter password"
                    style={{ ...inputStyle(!!errorMessage), paddingRight:44 }}
                    onFocus={e=>e.target.style.borderColor=P}
                    onBlur={e=>e.target.style.borderColor=errorMessage?'#ef4444':BORDER}
                  />
                  <span onClick={()=>setShowPassword(!showPassword)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', cursor:'pointer', color:GRAY, fontSize:13 }}>
                    <i className={`fa ${showPassword?'fa-eye-slash':'fa-eye'}`} />
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:16, color:'#A32D2D', fontSize:'0.8rem', fontWeight:500, background:'#FCEBEB', padding:'10px 12px', borderRadius:8 }}>
                  <i className="fa fa-exclamation-circle" />{errorMessage}
                </div>
              )}

              {/* Remember + Forgot */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.82rem', color:GRAY }}>
                  <input type="checkbox" style={{ accentColor:P, width:14, height:14 }} />Remember me
                </label>
                <Link to="/forgetPassword-1" style={{ color:P, fontSize:'0.82rem', fontWeight:600, textDecoration:'none' }}>Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'13px', border:'none', borderRadius:50,
                background: loading ? '#B4B2A9' : `linear-gradient(135deg,${P},#0080b0)`,
                color:'#fff', fontSize:'0.95rem', fontWeight:700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily:"'Jost',sans-serif", marginBottom:20,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:`0 6px 18px rgba(6,163,218,0.3)`, transition:'all .25s',
              }}
                onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background=`linear-gradient(135deg,${S},#d05c35)` }}
                onMouseLeave={e=>{ if(!loading) e.currentTarget.style.background=`linear-gradient(135deg,${P},#0080b0)` }}
              >
                {loading ? <><div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .8s linear infinite' }} />Signing in…</> : <><i className="fa fa-sign-in-alt" />Sign In</>}
              </button>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ flex:1, height:1, background:'rgba(6,163,218,0.15)' }} />
                <span style={{ color:GRAY, fontSize:'0.78rem' }}>or continue with</span>
                <div style={{ flex:1, height:1, background:'rgba(6,163,218,0.15)' }} />
              </div>

              {/* Social */}
              <div style={{ display:'flex', gap:12, marginBottom:24 }}>
                {[['fab fa-google','Google'],['fab fa-facebook-f','Facebook']].map(([icon,label]) => (
                  <button key={label} type="button" style={{ flex:1, padding:'10px', background:'#fff', border:`1.5px solid ${BORDER}`, borderRadius:10, fontSize:'0.85rem', fontWeight:600, color:DARK, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'Jost',sans-serif", transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=P;e.currentTarget.style.background='#EEF9FF'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.background='#fff'}}
                  >
                    <i className={icon} style={{ color:P, fontSize:13 }} />{label}
                  </button>
                ))}
              </div>

              <p style={{ textAlign:'center', margin:0, fontSize:'0.85rem', color:GRAY }}>
                Don't have an account?{' '}<Link to="/signup" style={{ color:P, fontWeight:700, textDecoration:'none' }}>Sign up free</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}