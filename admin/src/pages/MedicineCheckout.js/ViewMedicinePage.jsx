import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getMedicineCheckout } from '../../Redux/ActionCreators/MedicineCheckoutActionCreators';

export default function ViewMedicineCheckoutPage() {
  const { _id } = useParams();
  const MedicineCheckoutStateData = useSelector(s => s.MedicineCheckoutStateData);
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => { dispatch(getMedicineCheckout()); }, [dispatch]);

  useEffect(() => {
    if (MedicineCheckoutStateData.length > 0) {
      const found = MedicineCheckoutStateData.find(o => o._id === _id);
      setOrder(found || null);
    }
  }, [MedicineCheckoutStateData, _id]);

  if (!order) return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <p className="text-muted">Loading medicines…</p>
      </div>
    </div>
  );

  /* MedicineCheckout schema: medicines[] — each item has price, qty, total */
  const subtotal = order.medicines?.reduce((sum, m) => sum + (m.total || 0), 0) ?? 0;

  return (
    <div className="fade-in-up">
      <div className="page-header mb-4">
        <div>
          <h5><i className="fas fa-pills me-2"></i>Ordered Medicines</h5>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {order.medicines?.length} item(s) · Order #{order._id?.slice(-8)}
          </div>
        </div>
        <Link to="/admin/medicine-checkout" className="text-white-50">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.medicines?.map((m, idx) => (
                <tr key={m._id || idx}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>

                  {/* medicine name — stored inline in medicines[] array */}
                  <td style={{ fontWeight: 600 }}>{m.name || m.medicine?.name || 'N/A'}</td>

                  {/* medicineCategory — stored inline in medicines[] */}
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {m.medicineCategory || '—'}
                  </td>

                  {/* qty — stored per item */}
                  <td>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      ×{m.qty ?? 1}
                    </span>
                  </td>

                  {/* price — unit price stored inline */}
                  <td>₹{m.price ?? 0}</td>

                  {/* total — qty × price, stored inline */}
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{m.total ?? 0}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg)' }}>
                <td colSpan={5} style={{ fontWeight: 700, textAlign: 'right', padding: '14px 16px' }}>
                  Medicines Subtotal
                </td>
                <td style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)', padding: '14px 16px' }}>
                  ₹{subtotal}
                </td>
              </tr>
              {/* MedicineCheckout schema: shipping field */}
              <tr style={{ background: 'var(--bg)' }}>
                <td colSpan={5} style={{ textAlign: 'right', padding: '6px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                  Shipping
                </td>
                <td style={{ padding: '6px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                  ₹{order.shipping ?? 0}
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