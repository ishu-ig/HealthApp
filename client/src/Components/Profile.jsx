import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile({ title }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("userid");
        const isLogin = localStorage.getItem("login");

        // ✅ Check login
        if (!userId || !isLogin) {
          navigate("/login");
          return;
        }

        let response = await fetch(
          `http://localhost:8000/api/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.data) {
          setData(result.data);
        } else {
          navigate("/login");
        }

      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <>
      <h5 className="text-light bg-primary text-center p-2 mb-4">
        {title === "Checkout" ? "Billing Address" : `${title} Profile`}
      </h5>

      <div className="container">
        <div className="row justify-content-center">

          {/* Profile Image */}
          {title !== "Checkout" && (
            <div className="col-12 col-md-6 text-center mb-3">
              <img
                src={
                  data?.pic
                    ? `${process.env.REACT_APP_BACKEND_SERVER}/${data.pic}`
                    : "/img/noimage.jpg"
                }
                alt="Profile"
                style={{ borderRadius: "10px", maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}

          {/* Profile Details */}
          <div className={`${title !== "Checkout" ? "col-12 col-md-6" : "col-12"}`}>
            <div className="table-responsive">
              <table className="table table-bordered border-primary text-center">
                <tbody>

                  <tr>
                    <th>Name</th>
                    <td>{data?.name}</td>
                  </tr>

                  {title !== "Checkout" && (
                    <tr>
                      <th>Username</th>
                      <td>{data?.username}</td>
                    </tr>
                  )}

                  <tr>
                    <th>Email Address</th>
                    <td>{data?.email}</td>
                  </tr>

                  <tr>
                    <th>Phone</th>
                    <td>{data?.phone}</td>
                  </tr>

                  <tr>
                    <th>Address</th>
                    <td>{data?.address}</td>
                  </tr>

                  <tr>
                    <th>State</th>
                    <td>{data?.state}</td>
                  </tr>

                  <tr>
                    <th>City</th>
                    <td>{data?.city}</td>
                  </tr>

                  <tr>
                    <th>Pin</th>
                    <td>{data?.pin}</td>
                  </tr>

                  <tr>
                    <td colSpan={2}>
                      <Link to="/update-profile" className="btn btn-primary w-100">
                        {title !== "Checkout" ? "Update Profile" : "Update Address"}
                      </Link>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}