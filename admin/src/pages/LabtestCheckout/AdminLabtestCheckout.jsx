import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import {
  deleteLabtestCheckout,
  getLabtestCheckout,
} from '../../Redux/ActionCreators/LabtestCheckoutActionCreators';

export default function AdminLabtestCheckout() {
  const LabtestCheckoutStateData = useSelector(s => s.LabtestCheckoutStateData);
  const dispatch = useDispatch();

  const deleteRecord = (_id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteLabtestCheckout({ _id }));
      getAPIData();
    }
  };

  function getAPIData() {
    dispatch(getLabtestCheckout());
    const timer = setTimeout(() => {
      if (!$.fn.DataTable.isDataTable('#LabtestCheckoutTable')) {
        $('#LabtestCheckoutTable').DataTable({ responsive: true, order: [[7, 'desc']] });
      }
    }, 500);
    return timer;
  }

  useEffect(() => {
    const timer = getAPIData();
    return () => clearTimeout(timer);
  }, [LabtestCheckoutStateData.length]);

  /* orderStatus badge colour map — matches LabtestCheckout orderStatus default */
  const statusColor = (status) => {
    const map = {
      'Order is Placed': 'info',
      'Processing':      'warning',
      'Sample Collected':'warning',
      'Report Ready':    'teal',
      'Completed':       'success',
      'Cancelled':       'danger',
    };
    return map[status] || 'info';
  };

  return (
    <div className="fade-in-up">
      <div className="page-header mb-4">
        <h5 className="text-light bg-primary">
          <i className="fas fa-flask me-2"></i>Lab Test Orders
        </h5>
        <span style={{ fontSize: 14, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20 }}>
          {LabtestCheckoutStateData?.length} orders
        </span>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table id="LabtestCheckoutTable" className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Order Status</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Delivery Charge</th>   {/* schema field: deliveryCharge */}
                <th>Total</th>
                <th>Reservation Date</th>  {/* schema field: reservationDate */}
                <th>Date</th>
                <th>Items</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {LabtestCheckoutStateData?.map(order => (
                <tr key={order._id}>
                  {/* ID */}
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order._id}
                  </td>

                  {/* Customer */}
                  <td style={{ fontWeight: 600 }}>{order.user?.name || order.user?.username || 'N/A'}</td>

                  {/* Order Status */}
                  <td>
                    <span className={`badge-status ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Payment Mode — schema default: "COD" */}
                  <td>{order.paymentMode || 'COD'}</td>

                  {/* Payment Status */}
                  <td>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{order.paymentMode || 'COD'}</div>
                      <span className={`badge-status ${order.paymentStatus === 'Done' ? 'success' : order.paymentStatus === 'Failed' ? 'danger' : 'warning'}`} style={{ fontSize: 11 }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Delivery Charge — LabtestCheckout schema: "deliveryCharge" (not "shipping") */}
                  <td style={{ color: 'var(--text-muted)' }}>₹{order.deliveryCharge ?? 0}</td>

                  {/* Total */}
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.total}</td>

                  {/* Reservation Date — LabtestCheckout schema: reservationDate */}
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 13 }}>
                    {order.reservationDate
                      ? new Date(order.reservationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>

                  {/* Created Date */}
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* View lab tests */}
                  <td>
                    <Link to={`/admin/labtest-checkout/items/${order._id}`} className="btn btn-primary btn-sm text-light">
                      <i className="fas fa-flask me-1"></i>
                      <span className="d-none d-sm-inline">Items</span>
                    </Link>
                  </td>

                  {/* View detail */}
                  <td>
                    <Link to={`/admin/labtest-checkout/view/${order._id}`} className="btn btn-primary btn-sm text-light">
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>

                  {/* Delete */}
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteRecord(order._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}