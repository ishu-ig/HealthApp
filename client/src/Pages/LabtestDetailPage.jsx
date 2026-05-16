import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLabtest } from '../Redux/ActionCreators/LabtestActionCreators'
import { createLabtestCart, getLabtestCart } from '../Redux/ActionCreators/LabtestCartActionCreators'
import { createLabtestWishlist, getLabtestWishlist } from '../Redux/ActionCreators/LabtestWishlistActionCreators'
import Services from '../Components/Services'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'

function DetailRow({ icon, label, value, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: '1px solid rgba(6,163,218,0.07)' }}>
      <div style={{ width: 32, height: 32, flexShrink: 0, background: 'rgba(6,163,218,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className={`fa ${icon}`} style={{ color: P, fontSize: 12 }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 1px', fontSize: '0.72rem', color: GRAY, fontWeight: 500 }}>{label}</p>
        {children || <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: value ? DARK : GRAY }}>{value || 'N/A'}</p>}
      </div>
    </div>
  )
}

export default function LabtestDetailPage() {
  const { _id } = useParams()

  // ✅ FIX: Use null (not {}) so we can reliably detect "not loaded yet"
  const [data, setData] = useState(null)
  const [relatedLabtest, setRelated] = useState([])

  const LabtestStateData         = useSelector(s => s.LabtestStateData)         || []
  const LabtestCartStateData     = useSelector(s => s.LabtestCartStateData)     || []
  const LabtestWishlistStateData = useSelector(s => s.LabtestWishlistStateData) || []

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getLabtest())
    dispatch(getLabtestCart())
    dispatch(getLabtestWishlist())
  }, [dispatch])

  useEffect(() => {
    if (LabtestStateData.length > 0 && _id) {
      // ✅ FIX: Use String() comparison — Redux may store _id as ObjectId or string
      const item = LabtestStateData.find(x => String(x._id) === String(_id))

      if (item) {
        setData(item)
        setRelated(LabtestStateData.filter(x =>
          x.active &&
          String(x.labtestCategory?._id || x.labtestCategory) === String(item.labtestCategory?._id || item.labtestCategory) &&
          String(x._id) !== String(_id)
        ))
      }
    }
  }, [LabtestStateData, _id])

  // FIX 3: Added login check and navigate-to-cart after adding
    const addToLabtestCart = () => {
      if (!localStorage.getItem("login")) {
        alert("Login to add to cart");
        navigate("/login");
        return;
      }
  
      const item = LabtestCartStateData.find(
        (x) =>
          (x.labtest?._id || x.labtest) === _id &&
          (x.user?._id || x.user) === localStorage.getItem("userid"),
      );
      console.log(`id : ${data._id}, userId :${localStorage.getItem("userid")},total : ${data.finalPrice}`)
      if (!item) {
        dispatch(
          createLabtestCart({
            user: localStorage.getItem("userid"),
            labtest: data._id,
            total: data.finalPrice,
          }),
        );
      }
  
      navigate("/Labtest/cart");
    };

  function addToWishlist() {
    if (!localStorage.getItem('login')) {
      alert('Please login to add to wishlist')
      navigate('/login')
      return
    }

    if (!data) {
      alert('Lab test details are still loading. Please try again.')
      return
    }

    const userId = localStorage.getItem('userid')
    const alreadyInWishlist = LabtestWishlistStateData.find(x =>
      String(x.labtest?._id || x.labtest) === String(data._id) &&
      String(x.user?._id || x.user) === String(userId)
    )

    if (!alreadyInWishlist) {
      dispatch(createLabtestWishlist({
        user:    userId,
        labtest: data._id,
      }))
    }

    navigate('/wishlist')
  }

  // ✅ Show spinner while data hasn't loaded yet
  if (!data) {
    return (
      <>
        <HeroSection title="Lab Test" />
        <div style={{ textAlign: 'center', padding: '80px 16px', color: GRAY, fontFamily: "'Jost',sans-serif" }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '2rem', color: P, marginBottom: 16, display: 'block' }} />
          Loading lab test details...
        </div>
      </>
    )
  }

  return (
    <>
      <HeroSection title={`Lab Test – ${data.name || ''}`} />

      <div style={{ background: 'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', padding: '56px 16px 80px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>

          {/* ── Page heading ── */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', background: 'rgba(6,163,218,0.10)', color: P, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', padding: '5px 18px', borderRadius: 50, marginBottom: 12, border: `1px solid rgba(6,163,218,0.22)` }}>
              Lab Test
            </span>
            <h2 style={{ fontFamily: "'Jost',sans-serif", fontSize: '2rem', fontWeight: 800, color: DARK, margin: 0 }}>{data.name}</h2>
          </div>

          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* ── Image + Price ── */}
            <div style={{ flex: '0 0 300px', minWidth: 260 }}>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid rgba(6,163,218,0.12)`, boxShadow: '0 8px 32px rgba(9,30,62,0.10)', padding: 8 }}>
                {data?.pic && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`}
                    alt={data.name}
                    style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 14, display: 'block' }}
                  />
                )}

                {/* Price badge */}
                <div style={{ padding: '18px 16px', borderTop: `1px solid rgba(6,163,218,0.08)`, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: GRAY, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <del style={{ color: '#ef4444', fontSize: '0.9rem' }}>₹{data.basePrice}</del>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: P }}>₹{data.finalPrice}</span>
                    <span style={{ background: 'rgba(6,163,218,0.10)', color: P, borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px' }}>{data.discount}% off</span>
                  </div>
                </div>

                {/* Quick info badges */}
                <div style={{ padding: '0 14px 18px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {data.reportTime && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', background: 'rgba(6,163,218,0.07)', color: P, borderRadius: 50, fontSize: '0.74rem', fontWeight: 700, border: `1px solid rgba(6,163,218,0.18)` }}>
                      <i className="fa fa-clock" style={{ fontSize: '0.68rem' }} />
                      {data.reportTime} hrs report
                    </span>
                  )}
                  {data.sampleRequired && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', background: 'rgba(6,163,218,0.07)', color: P, borderRadius: 50, fontSize: '0.74rem', fontWeight: 700, border: `1px solid rgba(6,163,218,0.18)` }}>
                      <i className="fa fa-vial" style={{ fontSize: '0.68rem' }} />
                      {data.sampleRequired}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Details + Actions ── */}
            <div style={{ flex: 1, minWidth: 280 }}>

              {/* Test info card */}
              <div style={{ background: '#fff', borderRadius: 20, border: `1px solid rgba(6,163,218,0.12)`, padding: '28px', boxShadow: '0 8px 32px rgba(9,30,62,0.10)', marginBottom: 20 }}>
                <h6 style={{ fontFamily: "'Jost',sans-serif", fontWeight: 700, color: DARK, marginBottom: 18, fontSize: '1rem' }}>Test Details</h6>

                <DetailRow icon="fa-flask"        label="Test Name"       value={data.name} />
                <DetailRow icon="fa-layer-group"  label="Category"        value={data.labtestCategory?.name || data.labtestCategory} />
                <DetailRow icon="fa-building"     label="Lab Name"        value={data.lab?.name || data.lab} />
                <DetailRow icon="fa-vial"         label="Sample Required" value={data.sampleRequired} />
                <DetailRow icon="fa-clock"        label="Report Time"     value={data.reportTime ? `${data.reportTime} hrs` : null} />

                {data.preperation && (
                  <DetailRow icon="fa-clipboard-list" label="Preparation">
                    <div style={{ fontSize: '0.88rem', color: DARK, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: data.preperation }} />
                  </DetailRow>
                )}
                {data.description && (
                  <DetailRow icon="fa-info-circle" label="Description">
                    <div style={{ fontSize: '0.88rem', color: DARK, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: data.description }} />
                  </DetailRow>
                )}
              </div>

              {/* Action card */}
              <div style={{ background: '#fff', borderRadius: 20, border: `1px solid rgba(6,163,218,0.12)`, padding: '24px 28px', boxShadow: '0 8px 32px rgba(9,30,62,0.10)' }}>

                {/* Info note */}
                <div style={{ background: 'rgba(6,163,218,0.04)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <i className="fa fa-info-circle" style={{ color: P, marginTop: 2, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: GRAY, lineHeight: 1.65 }}>
                    You can select your preferred test date at <strong style={{ color: DARK }}>checkout</strong> after adding to cart.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={addToLabtestCart}
                    style={{ flex: 1, padding: '13px', border: 'none', borderRadius: 50, background: `linear-gradient(135deg,${P},#0080b0)`, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: `0 6px 18px rgba(6,163,218,0.30)`, transition: 'all .25s' }}
                    onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg,${S},#d05c35)`}
                    onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg,${P},#0080b0)`}
                  >
                    <i className="fa fa-shopping-cart" /> Add to Cart
                  </button>

                  <button
                    onClick={addToWishlist}
                    style={{ flex: 1, padding: '13px', border: `1.5px solid rgba(6,163,218,0.28)`, borderRadius: 50, background: 'rgba(6,163,218,0.06)', color: P, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all .25s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,163,218,0.06)'; e.currentTarget.style.color = P }}
                  >
                    <i className="fa fa-heart" /> Wishlist
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {relatedLabtest.length > 0
        ? <Services title="Other Related Lab Tests" data={relatedLabtest} />
        : <p style={{ textAlign: 'center', color: GRAY, padding: '32px 0', fontFamily: "'Jost',sans-serif" }}>No related lab tests found</p>
      }
    </>
  )
}