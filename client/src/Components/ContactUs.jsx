import React, { useState } from "react";
import { useDispatch } from "react-redux";
import formValidator from "../FormValidator/formValidator";
import { createContactUs } from "../Redux/ActionCreators/ContactUsActionCreators";

export default function ContactUs() {
  let [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  
  let [errorMessage, setErrorMessage] = useState({
    name: "Name field is mandatory",
    email: "Email field is mandatory",
    phone: "Phone field is mandatory",
    subject: "Subject field is mandatory",
    message: "Message field is mandatory",
  });

  let [show, setShow] = useState(false);
  let [message, setMessage] = useState("");

  let dispatch = useDispatch();

  function getInputData(e) {
    let { name, value } = e.target;
    setErrorMessage((old) => ({
      ...old,
      [name]: formValidator(e)
    }));
    setData((old) => ({
      ...old,
      [name]: value
    }));
  }

  function postData(e) {
    e.preventDefault();
    let error = Object.values(errorMessage).find((x) => x !== "");
    if (error) {
      setShow(true);
    } else {
      dispatch(createContactUs({ ...data, active: true, date: new Date() }));
      setMessage("Thank you for sharing your query with us. Our team will contact you soon.");
      setShow(false);
      setData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }
  }

  return (
    <>
      <div className="container-fluid py-5 mb-5">
        <div className="container">
          <div
            className="text-center mx-auto pb-5 wow fadeIn"
            data-wow-delay=".3s"
            style={{ maxWidth: "600px" }}
          >
            <h5 className="text-primary">Get In Touch</h5>
            <h1 className="mb-3">Contact for any query</h1>
          </div>

          <div className="contact-detail position-relative p-5">
            {/* Contact Info Cards */}
            <div className="row g-5 mb-5 justify-content-center">
              {/* Address */}
              <div className="col-md-6 wow fadeIn" data-wow-delay=".3s">
                <div className="d-flex bg-light p-3 rounded">
                  <div
                    className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="fas fa-map-marker-alt text-white fs-3 mt-3"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="text-primary">Address</h5>
                    <a
                      href="https://www.google.com/maps/place/DUCAT/@28.5798005,77.3120918,17z"
                      target="_blank"
                      rel="noreferrer"
                    >
                      A-43 Sector-16, Noida
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="col-md-6 wow fadeIn" data-wow-delay=".5s">
                <div className="d-flex bg-light p-3 rounded">
                  <div
                    className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="fa fa-phone text-white fs-3 mt-3"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="text-primary">Call Us</h5>
                    <a href="tel:+0123456789" target="_blank" rel="noreferrer">
                      +012 3456 7890
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6 wow fadeIn" data-wow-delay=".7s">
                <div className="d-flex bg-light p-3 rounded">
                  <div
                    className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="fa fa-envelope text-white fs-3 mt-3"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="text-primary">Email Us</h5>
                    <a
                      href="mailto:info@example.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      info@example.com
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="col-md-6 wow fadeIn" data-wow-delay=".9s">
                <div className="d-flex bg-light p-3 rounded">
                  <div
                    className="flex-shrink-0 btn-square bg-secondary rounded-circle"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="fa fa-whatsapp text-white fs-3 mt-3"></i>
                  </div>
                  <div className="ms-3">
                    <h5 className="text-primary">WhatsApp</h5>
                    <a
                      href="https://wa.me/918218635347"
                      target="_blank"
                      rel="noreferrer"
                    >
                      +91-8218635347
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map + Form */}
            <div className="row g-5">
              {/* Map */}
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".3s">
                <div className="p-5 h-100 rounded contact-map">
                  <iframe
                    width="100%"
                    height="100%"
                    id="gmap_canvas"
                    title="Office Location"
                    src="https://maps.google.com/maps?q=A-43%20Sector-16%20Noida&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  ></iframe>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-6 wow fadeIn" data-wow-delay=".5s">
                <div className="p-5 rounded contact-form">
                  {message && (
                    <p className="text-success text-center fw-semibold mb-4">
                      {message}
                    </p>
                  )}

                  <form onSubmit={postData} noValidate>
                    {/* Name */}
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={getInputData}
                        className={`form-control border-3 py-3 ${
                          show && errorMessage.name
                            ? "border-danger"
                            : "border-success"
                        }`}
                        placeholder="Your Name"
                      />
                      {show && errorMessage.name && (
                        <small className="text-danger">{errorMessage.name}</small>
                      )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={getInputData}
                        className={`form-control border-3 py-3 ${
                          show && errorMessage.email
                            ? "border-danger"
                            : "border-success"
                        }`}
                        placeholder="Your Email"
                      />
                      {show && errorMessage.email && (
                        <small className="text-danger">{errorMessage.email}</small>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label htmlFor="phone" className="form-label">
                        Your Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={getInputData}
                        className={`form-control border-3 py-3 ${
                          show && errorMessage.phone
                            ? "border-danger"
                            : "border-success"
                        }`}
                        placeholder="Your Phone Number"
                      />
                      {show && errorMessage.phone && (
                        <small className="text-danger">{errorMessage.phone}</small>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={data.subject}
                        onChange={getInputData}
                        className={`form-control border-3 py-3 ${
                          show && errorMessage.subject
                            ? "border-danger"
                            : "border-success"
                        }`}
                        placeholder="Subject"
                      />
                      {show && errorMessage.subject && (
                        <small className="text-danger">{errorMessage.subject}</small>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className={`w-100 form-control border-3 py-2 ${
                          show && errorMessage.message
                            ? "border-danger"
                            : "border-success"
                        }`}
                        rows="4"
                        cols="10"
                        onChange={getInputData}
                        value={data.message}
                        placeholder="Your Message"
                      ></textarea>
                      {show && errorMessage.message && (
                        <small className="text-danger">{errorMessage.message}</small>
                      )}
                    </div>

                    <div className="text-start">
                      <button
                        type="submit"
                        className="btn bg-primary text-white py-3 px-5 w-100"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}