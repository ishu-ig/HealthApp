import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function OrderPage() {
    const navigate = useNavigate();

    const handleSelection = (e) => {
        const value = e.target.value;
        if (value) {
            navigate(value);
        }
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top py-3">
                <div className="container">
                    <span className="navbar-brand fw-bold text-light text-capitalize">
                         Order
                    </span>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <div className="ms-auto d-flex align-items-center">
                            <label htmlFor="specialization-select" className="me-2 text-white fw-semibold">
                                Specialization
                            </label>
                            <select
                                id="specialization-select"
                                name="specialization"
                                className="form-select border-3 border-primary"
                                onChange={handleSelection}
                                defaultValue=""
                            >
                                <option value="" disabled>Select Specialization</option>
                                <option value="/order/medicine">Medicine</option>
                                <option value="/order/labtest">Lab Test</option>
                                <option value="/order/doctor">Doctor</option>
                                <option value="/order/nurse">Nurse</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
