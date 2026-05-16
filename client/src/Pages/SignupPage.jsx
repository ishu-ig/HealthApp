import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'
import formValidator from '../FormValidator/formValidator'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'
const BORDER = 'rgba(6,163,218,0.22)'

const inputBase = (err) => ({
  width: '100%', padding: '11px 14px 11px 40px',
  border: `1.5px solid ${err ? '#ef4444' : BORDER}`,
  borderRadius: 10, fontSize: '0.88rem',
  background: '#fff', color: DARK, outline: 'none',
  boxSizing: 'border-box', fontFamily: "'Jost',sans-serif",
  transition: 'border-color .2s',
})

// ✅ FIX 1: Moved Field outside SignupPage to prevent re-mount on every keystroke
const Field = ({ name, type = 'text', placeholder, icon, err, pwShow, onToggle, show, onChange }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: DARK, marginBottom: 7, letterSpacing: '0.02em' }}>
      {placeholder}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: P, fontSize: 12, pointerEvents: 'none' }}>
        <i className={`fa ${icon}`} />
      </span>
      <input
        type={pwShow !== undefined ? (pwShow ? 'text' : 'password') : type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputBase(show && err), paddingRight: onToggle ? 40 : 14 }}
        onFocus={e => e.target.style.borderColor = P}
        onBlur={e => e.target.style.borderColor = show && err ? '#ef4444' : BORDER}
      />
      {onToggle && (
        <span
          onClick={onToggle}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: GRAY, fontSize: 12 }}
        >
          <i className={`fa ${pwShow ? 'fa-eye-slash' : 'fa-eye'}`} />
        </span>
      )}
    </div>
    {/* ✅ FIX 3: Show error only when show=true and err has a value */}
    {show && err && <p style={{ color: '#ef4444', fontSize: '0.76rem', margin: '4px 0 0' }}>{err}</p>}
  </div>
)

export default function SignupPage() {
  const navigate = useNavigate()

  const [data, setData] = useState({
    name: '', username: '', email: '', phone: '', password: '', cpassword: ''
  })

  const [errorMessage, setErrorMessage] = useState({
    name: 'Name is required',
    email: 'Email is required',
    username: 'Username is required',
    phone: 'Phone is required',
    password: 'Password is required',
    cpassword: 'Please confirm your password', // ✅ FIX 3: Added cpassword to errorMessage state
  })

  const [show, setShow] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [agreed, setAgreed] = useState(false) // ✅ FIX 2: Track T&C checkbox state
  const [loading, setLoading] = useState(false)

  function getInputData(e) {
    const { name, value } = e.target
    setErrorMessage(old => ({ ...old, [name]: formValidator(e) }))
    setData(old => ({ ...old, [name]: value }))
  }

  async function postData(e) {
    e.preventDefault()

    // ✅ FIX 4: Build updated errors synchronously FIRST, then validate — avoids stale state issue
    let updatedErrors = { ...errorMessage }

    // Check password match
    if (data.password !== data.cpassword) {
      updatedErrors.password = 'Passwords do not match'
      updatedErrors.cpassword = 'Passwords do not match'
    } else {
      updatedErrors.cpassword = data.cpassword === '' ? 'Please confirm your password' : ''
    }

    // ✅ FIX 2: Validate T&C checkbox
    if (!agreed) {
      setShow(true)
      setErrorMessage(updatedErrors)
      alert('Please agree to the Terms of Service before continuing.')
      return
    }

    // Check for any remaining validation errors
    const hasError = Object.values(updatedErrors).some(x => x !== '')
    if (hasError) {
      setShow(true)
      setErrorMessage(updatedErrors)
      return
    }

    setLoading(true)
    try {
      // ✅ FIX 6: Send POST directly — let backend handle duplicate checking
      // (Removed the insecure GET-all-users approach)
      const res = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'Buyer',
          active: true,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        // Handle duplicate username/email errors returned by backend
        setShow(true)
        if (json.message?.toLowerCase().includes('username')) {
          setErrorMessage(old => ({ ...old, username: 'Username already exists' }))
        } else if (json.message?.toLowerCase().includes('email')) {
          setErrorMessage(old => ({ ...old, email: 'Email already exists' }))
        } else {
          alert(json.message || 'Something went wrong')
        }
        return
      }

      if (json?.data) {
        localStorage.setItem('login', true)
        localStorage.setItem('name', json.data.name)
        localStorage.setItem('userid', json.data._id)
        localStorage.setItem('role', json.data.role)
        navigate('/profile')
      } else {
        alert('Something went wrong')
      }
    } catch {
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <HeroSection title="Sign Up" />
      <div style={{ background: 'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 16px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>

          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: `linear-gradient(135deg,${P},#0080b0)`, borderRadius: 16, marginBottom: 16, boxShadow: `0 8px 24px rgba(6,163,218,0.3)` }}>
              <i className="fa fa-heartbeat" style={{ color: '#fff', fontSize: 22 }} />
            </div>
            <h2 style={{ fontFamily: "'Jost',sans-serif", fontSize: '1.7rem', fontWeight: 800, color: DARK, margin: '0 0 6px' }}>Create Your Account</h2>
            <p style={{ color: GRAY, fontSize: '0.88rem', margin: 0 }}>Join HealthCare and access world-class medical services</p>
          </div>

          <div style={{ background: '#FFFBF7', borderRadius: 20, border: `1px solid rgba(6,163,218,0.12)`, padding: '36px 32px', boxShadow: '0 8px 32px rgba(9,30,62,0.10)' }}>
            <form onSubmit={postData}>

              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Field name="name"     placeholder="Full Name" icon="fa-user"  err={errorMessage.name}     show={show} onChange={getInputData} />
                <Field name="username" placeholder="Username"  icon="fa-at"   err={errorMessage.username}  show={show} onChange={getInputData} />
              </div>

              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Field name="email" type="email"  placeholder="Email Address" icon="fa-envelope" err={errorMessage.email} show={show} onChange={getInputData} />
                <Field name="phone" type="number" placeholder="Phone Number"  icon="fa-phone"    err={errorMessage.phone} show={show} onChange={getInputData} />
              </div>

              {/* Row 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Field name="password"  placeholder="Password"         icon="fa-lock" err={errorMessage.password}  show={show} pwShow={showPw}  onToggle={() => setShowPw(!showPw)}   onChange={getInputData} />
                {/* ✅ FIX 3: Pass actual cpassword error instead of null */}
                <Field name="cpassword" placeholder="Confirm Password" icon="fa-lock" err={errorMessage.cpassword} show={show} pwShow={showCpw} onToggle={() => setShowCpw(!showCpw)} onChange={getInputData} />
              </div>

              {/* T&C — ✅ FIX 2: Controlled checkbox with agreed state */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.83rem', color: GRAY, marginBottom: 24 }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ accentColor: P, width: 14, height: 14 }}
                />
                I agree to the <Link to="#" style={{ color: P, fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', border: 'none', borderRadius: 50,
                  background: loading ? GRAY : `linear-gradient(135deg,${P},#0080b0)`,
                  color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Jost',sans-serif", marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 6px 18px rgba(6,163,218,0.3)`, transition: 'all .25s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `linear-gradient(135deg,${S},#d05c35)` }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = `linear-gradient(135deg,${P},#0080b0)` }}
              >
                <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-user-plus'}`} />
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(6,163,218,0.15)' }} />
                <span style={{ color: GRAY, fontSize: '0.78rem' }}>or sign up with</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(6,163,218,0.15)' }} />
              </div>

              {/* Social */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {[['fab fa-google', 'Google'], ['fab fa-facebook-f', 'Facebook']].map(([icon, label]) => (
                  <button key={label} type="button"
                    style={{ flex: 1, padding: '10px', background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, color: DARK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Jost',sans-serif", transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.background = '#EEF9FF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = '#fff' }}
                  >
                    <i className={icon} style={{ color: P, fontSize: 13 }} />{label}
                  </button>
                ))}
              </div>

              <p style={{ textAlign: 'center', margin: 0, fontSize: '0.85rem', color: GRAY }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: P, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}