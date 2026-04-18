import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../Components/HeroSection";

export default function LoginPage() {
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  let [data, setData] = useState({
    userInput: "",
    password: "",
  });
  let [errorMessage, setErrorMessage] = useState("");
  let [loading, setLoading] = useState(false);

  function getInputData(e) {
    let { name, value } = e.target;
    setErrorMessage("");
    setData((old) => ({
      ...old,
      [name]: value,
    }));
  }

  async function postData(e) {
    e.preventDefault();

    if (!data.userInput || !data.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/login`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: data.userInput,
            password: data.password,
          }),
        },
      );

      response = await response.json();

      if (response.result === "Done" && response.data.active === false) {
        setErrorMessage(
          "Your account is not active. Please contact us to activate your account.",
        );
      } else if (
        response.result === "Done" &&
        response.data.role === "Buyer"
      ) {
        localStorage.setItem("login", true);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userid", response.data._id);
        localStorage.setItem("role", response.data.role);
        // ✅ Removed: localStorage.setItem("token", response.token) — no JWT anymore
        navigate("/profile");
      } else if (
        response.result === "Done" &&
        (response.data.role === "Admin" ||
          response.data.role === "Super Admin")
      ) {
        setErrorMessage("You cannot log in as an admin or super admin.");
      } else {
        setErrorMessage("Invalid username/email or password.");
      }
    } catch (error) {
      alert("Internal server error.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HeroSection title="Login" />
      <div className="container my-5 d-flex justify-content-center p-5">
        <div
          className="card p-4 shadow-lg"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <h5 className="text-light bg-primary text-center py-2 rounded">
            Login
          </h5>
          <form onSubmit={postData}>
            <div className="my-3">
              <label className="fw-bold">Username / Email</label>
              <input
                type="text"
                name="userInput"
                onChange={getInputData}
                value={data.userInput}
                placeholder="Enter Username or Email"
                className={`form-control border-2 ${
                  errorMessage ? "border-danger" : "border-primary"
                }`}
              />
            </div>

            <div className="my-3 position-relative">
              <label className="fw-bold">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={getInputData}
                  value={data.password}
                  placeholder="Enter Password"
                  className={`form-control border-2 pe-5 ${
                    errorMessage ? "border-danger" : "border-primary"
                  }`}
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } fs-5`}
                  ></i>
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-danger small mt-1">{errorMessage}</p>
            )}

            <div className="form-check my-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label ms-2" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>

            <div className="d-flex justify-content-center my-3">
              <button
                type="submit"
                className="btn btn-primary text-light w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button type="button" className="btn btn-outline-primary d-flex align-items-center">
                <i className="fab fa-google me-2"></i> Google
              </button>
              <button type="button" className="btn btn-outline-primary d-flex align-items-center">
                <i className="fab fa-facebook me-2"></i> Facebook
              </button>
            </div>

            <div className="my-3 d-flex justify-content-between">
              <Link to="/forgetPassword-1" className="text-decoration-none text-primary">
                Forgot Password?
              </Link>
              <Link to="/signup" className="text-decoration-none text-primary">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}