import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getLabtestCheckout } from '../../Redux/ActionCreators/LabtestCheckoutActionCreators';

export default function ViewLabtestCheckoutPage() {
  const { _id } = useParams();
  const LabtestCheckoutStateData = useSelector(s => s.LabtestCheckoutStateData);
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => { dispatch(getLabtestCheckout()); }, [dispatch]);

  useEffect(() => {
    if (LabtestCheckoutStateData.length > 0) {
      const found = LabtestCheckoutStateData.find(o => o._id === _id);
      setOrder(found || null);
    }
  }, [LabtestCheckoutStateData, _id]);

  if (!order) return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <p className="text-muted">Loading lab tests…</p>
      </div>
    </div>
  );

  /* LabtestCheckout schema: labtests[] — each item has price/total stored inline */
  const subtotal = order.labtests?.reduce((sum, t) => sum + (t.total || t.price || 0), 0) ?? 0;

  return (
    <div className="fade-in-up">
      <div className="page-header mb-4">
        <div>
          <h5><i className="fas fa-flask me-2"></i>Ordered Lab Tests</h5>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {order.labtests?.length} item(s) · Order #{order._id?.slice(-8)}
            {/* Show reservation date if present — LabtestCheckout schema: reservationDate */}
            {order.reservationDate && (
              <span style={{ marginLeft: 8 }}>
                · Scheduled: {new Date(order.reservationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        <Link to="/admin/labtest-checkout" className="text-white-50">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Test Name</th>
                <th>Category</th>
                <th>Lab</th>
                <th>Sample Type</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.labtests?.map((t, idx) => (
                <tr key={t._id || idx}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>

                  {/* test name — stored inline in labtests[] */}
                  <td style={{ fontWeight: 600 }}>{t.name || t.labtest?.name || 'N/A'}</td>

                  {/* labtestCategory — stored inline */}
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {t.labtestCategory || '—'}
                  </td>

                  {/* lab name — stored inline */}
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {t.lab || '—'}
                  </td>

                  {/* sampleType — stored inline */}
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {t.sampleType || '—'}
                  </td>

                  {/* price — labtests are flat-rate, no qty multiplier */}
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{t.total ?? t.price ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg)' }}>
                <td colSpan={5} style={{ fontWeight: 700, textAlign: 'right', padding: '14px 16px' }}>
                  Tests Subtotal
                </td>
                <td style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', padding: '14px 16px' }}>
                  ₹{subtotal}
                </td>
              </tr>
              {/* LabtestCheckout schema: deliveryCharge (not shipping) */}
              <tr style={{ background: 'var(--bg)' }}>
                <td colSpan={5} style={{ textAlign: 'right', padding: '6px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                  Delivery Charge
                </td>
                <td style={{ padding: '6px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                  ₹{order.deliveryCharge ?? 0}
                </td>
              </tr>
              <tr style={{ background: 'var(--bg)' }}>
                <td colSpan={5} style={{ fontWeight: 700, textAlign: 'right', padding: '10px 16px' }}>
                  Order Total
                </td>
                <td style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', padding: '10px 16px' }}>
                  ₹{order.total ?? 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}