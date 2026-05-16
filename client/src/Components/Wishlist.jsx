'use client'
import React from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../Components/HeroSection'

const P = '#06A3DA', S = '#F57E57', DARK = '#091E3E', GRAY = '#6b7a93'

export default function WishlistPage({ data = [], onDelete }) {
  function deleteRecord(_id) {
    if (window.confirm('Remove this item from your wishlist?')) {
      if (onDelete) onDelete(_id)
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .wl-card {
          background:#fff; border-radius:16px;
          border:1px solid rgba(6,163,218,0.12);
          box-shadow:0 4px 16px rgba(9,30,62,0.07);
          overflow:hidden;
          transition:transform .3s, box-shadow .3s;
        }
        .wl-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(9,30,62,0.12); }
        .wl-del-btn { background:rgba(239,68,68,0.09); border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; color:#ef4444; display:inline-flex; align-items:center; justify-content:center; transition:all .2s; }
        .wl-del-btn:hover { background:#ef4444; color:#fff; }
        .wl-add-btn { background:linear-gradient(135deg,${P},#0080b0); color:#fff; border:none; border-radius:50px; padding:8px 18px; font-size:.82rem; font-weight:700; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all .25s; }
        .wl-add-btn:hover { background:linear-gradient(135deg,${S},#d05c35); color:#fff; }
        .wl-table th { background:rgba(6,163,218,0.07); color:${DARK}; font-weight:700; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.05em; border:none; padding:12px 14px; }
        .wl-table td { border:none; border-bottom:1px solid rgba(6,163,218,0.07); padding:12px 14px; font-size:0.88rem; color:${GRAY}; vertical-align:middle; }
        .wl-table tr:last-child td { border-bottom:none; }
        .wl-table tr:hover td { background:rgba(6,163,218,0.02); }
      `}</style>

      <HeroSection title="My Wishlist" />

      <div style={{ background:'linear-gradient(135deg,#EEF9FF 0%,#fff 100%)', minHeight:'60vh', padding:'48px 16px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div>
              <h2 style={{ fontFamily:"'Jost',sans-serif", fontWeight:800, color:DARK, margin:'0 0 4px', fontSize:'1.5rem' }}>My Wishlist</h2>
              <p style={{ margin:0, color:GRAY, fontSize:'0.85rem' }}>{data.length} item{data.length!==1?'s':''} saved</p>
            </div>
            <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 20px', borderRadius:50, background:'rgba(6,163,218,0.08)', color:P, fontWeight:700, fontSize:'0.82rem', textDecoration:'none', border:`1px solid rgba(6,163,218,0.2)` }}>
              <i className="fa fa-shopping-bag" style={{fontSize:'0.78rem'}} />Continue Shopping
            </Link>
          </div>

          {data.length ? (
            <>
              {/* Desktop table */}
              <div className="d-none d-md-block" style={{ background:'#fff', borderRadius:18, border:`1px solid rgba(6,163,218,0.12)`, overflow:'hidden', boxShadow:'0 4px 20px rgba(9,30,62,0.07)', marginBottom:20 }}>
                <table className="table mb-0 wl-table">
                  <thead>
                    <tr>
                      <th style={{width:90}}>Image</th>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{width:80}}></th>
                      <th style={{width:60}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item._id}>
                        <td>
                          <img
                            src={`${process.env.NEXT_PUBLIC_SERVER}/${item.product?.pic}`}
                            alt={item.product?.name}
                            style={{ width:64, height:52, objectFit:'cover', borderRadius:10, border:`1.5px solid rgba(6,163,218,0.18)` }}
                          />
                        </td>
                        <td>
                          <span style={{ fontWeight:600, color:DARK }}>{item.product?.name}</span>
                        </td>
                        <td>{item.product?.manufacturer?.name || item.product?.brand?.name || '—'}</td>
                        <td>
                          <span style={{ fontWeight:700, color:P }}>₹{item.product?.finalPrice}</span>
                        </td>
                        <td>
                          <span style={{
                            padding:'3px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:700,
                            background: item.product?.stockQuantity===0 ? 'rgba(239,68,68,0.09)' : 'rgba(34,197,94,0.09)',
                            color: item.product?.stockQuantity===0 ? '#ef4444' : '#16a34a',
                          }}>
                            {item.product?.stockQuantity===0 ? 'Out of Stock' : `${item.product?.stockQuantity} left`}
                          </span>
                        </td>
                        <td>
                          <Link to={`/product/${item.product?._id}`} className="wl-add-btn">
                            <i className="fa fa-cart-plus" style={{fontSize:'0.8rem'}} />Add to Cart
                          </Link>
                        </td>
                        <td>
                          <button className="wl-del-btn" onClick={()=>deleteRecord(item._id)}>
                            <i className="fa fa-trash" style={{fontSize:13}} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="d-md-none">
                {data.map(item => (
                  <div key={item._id} className="wl-card mb-3">
                    <div style={{ display:'flex', gap:14, padding:16 }}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER}/${item.product?.pic}`}
                        alt={item.product?.name}
                        style={{ width:88, height:88, objectFit:'cover', borderRadius:12, flexShrink:0, border:`1.5px solid rgba(6,163,218,0.18)` }}
                      />
                      <div style={{ flex:1 }}>
                        <p style={{ margin:'0 0 3px', fontWeight:700, color:DARK, fontSize:'0.92rem' }}>{item.product?.name}</p>
                        <p style={{ margin:'0 0 3px', fontSize:'0.78rem', color:GRAY }}>Brand: {item.product?.manufacturer?.name || item.product?.brand?.name || '—'}</p>
                        <p style={{ margin:'0 0 8px', fontWeight:700, color:P }}>₹{item.product?.finalPrice}</p>
                        <span style={{
                          display:'inline-block', padding:'2px 10px', borderRadius:50, fontSize:'0.7rem', fontWeight:700, marginBottom:10,
                          background: item.product?.stockQuantity===0 ? 'rgba(239,68,68,0.09)' : 'rgba(34,197,94,0.09)',
                          color: item.product?.stockQuantity===0 ? '#ef4444' : '#16a34a',
                        }}>
                          {item.product?.stockQuantity===0 ? 'Out of Stock' : `${item.product?.stockQuantity} left`}
                        </span>
                        <div style={{ display:'flex', gap:8 }}>
                          <Link to={`/product/${item.product?._id}`} className="wl-add-btn" style={{ flex:1, justifyContent:'center' }}>
                            <i className="fa fa-cart-plus" />Add to Cart
                          </Link>
                          <button className="wl-del-btn" onClick={()=>deleteRecord(item._id)}>
                            <i className="fa fa-trash" style={{fontSize:13}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background:'#fff', borderRadius:20, border:`1px solid rgba(6,163,218,0.12)`, padding:'72px 32px', textAlign:'center', boxShadow:'0 4px 20px rgba(9,30,62,0.07)' }}>
              <div style={{ width:80, height:80, background:'rgba(6,163,218,0.08)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <i className="fa fa-heart" style={{ fontSize:'2rem', color:P }} />
              </div>
              <h4 style={{ fontFamily:"'Jost',sans-serif", color:DARK, marginBottom:8 }}>Your wishlist is empty</h4>
              <p style={{ color:GRAY, marginBottom:24, fontSize:'0.9rem' }}>Save items you love to your wishlist!</p>
              <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', background:`linear-gradient(135deg,${P},#0080b0)`, color:'#fff', borderRadius:50, fontWeight:700, textDecoration:'none' }}>
                <i className="fa fa-shopping-bag" />Browse Shop
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  )
}