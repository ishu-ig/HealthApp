import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSlider() {
    return (
        <div className="list-group ms-3">
            <Link to="/admin" className="list-group-item list-group-item-action active mb-1">
                <i className="fa fa-home fs-4"></i> <span className="ms-2">Home</span>
            </Link>
            <Link to="/admin/hospital" className="list-group-item list-group-item-action">
                <i className="fa fa-user-md"></i> <span className="ms-2">Hospital</span>
            </Link>
            <Link to="/admin/lab" className="list-group-item list-group-item-action">
                <i className="fa fa-user-md"></i> <span className="ms-2">Lab</span>
            </Link>
            <Link to="/admin/specialization" className="list-group-item list-group-item-action">
                <i className="fa fa-user-md"></i> <span className="ms-2">Doctor Specialization</span>
            </Link>
            <Link to="/admin/doctor" className="list-group-item list-group-item-action">
                <i className="fa fa-user"></i> <span className="ms-2">Doctor</span>
            </Link>
            <Link to="/admin/nurse" className="list-group-item list-group-item-action">
                <i className="fa fa-user"></i> <span className="ms-2">Nurse</span>
            </Link>
            <Link to="/admin/medicinecategory" className="list-group-item list-group-item-action">
                <i className="fa fa-pills"></i> <span className="ms-2">Medicine Category</span>
            </Link>
            <Link to="/admin/medicine" className="list-group-item list-group-item-action">
                <i className="fa fa-medkit"></i> <span className="ms-2">Medicine</span>
            </Link>
            <Link to="/admin/labtestcategory" className="list-group-item list-group-item-action">
                <i className="fa fa-flask"></i> <span className="ms-2">Lab Category</span>
            </Link>
            <Link to="/admin/labtest" className="list-group-item list-group-item-action">
                <i className="fa fa-vials"></i> <span className="ms-2">LabTest</span>
            </Link>
            <Link to="/admin/cart" className="list-group-item list-group-item-action">
                <i className="fa fa-shopping-cart"></i> <span className="ms-2">Medicine Cart</span>
            </Link>
            <Link to="/admin/cart" className="list-group-item list-group-item-action">
                <i className="fa fa-shopping-cart"></i> <span className="ms-2">Labtest Cart</span>
            </Link>
            <Link to="/admin/user" className="list-group-item list-group-item-action">
                <i className="fa fa-users"></i> <span className="ms-2">User</span>
            </Link>
            <Link to="/admin/checkout" className="list-group-item list-group-item-action">
                <i className="fa fa-credit-card"></i> <span className="ms-2">Checkout</span>
            </Link>
            <Link to="/admin/labtestCheckout" className="list-group-item list-group-item-action">
                <i className="fa fa-credit-card"></i> <span className="ms-2">Labtest Checkout</span>
            </Link>
        </div>
    );
}
