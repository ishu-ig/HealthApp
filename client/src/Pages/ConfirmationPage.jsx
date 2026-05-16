import React, { useEffect, useState } from "react";
import HeroSection from "../Components/HeroSection";
import { Link } from "react-router-dom";

export default function ConfirmationPage() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <HeroSection title="Order Confirmed" />

            <div
                style={{
                    background: "linear-gradient(135deg, #EEF9FF 0%, #ffffff 100%)",
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "60px 16px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 520,
                        textAlign: "center",
                        opacity: show ? 1 : 0,
                        transform: show ? "translateY(0)" : "translateY(24px)",
                        transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                >
                    {/* Success Icon */}
                    <div
                        style={{
                            position: "relative",
                            display: "inline-block",
                            marginBottom: 32,
                        }}
                    >
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #06A3DA, #0484B8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 16px 48px rgba(6,163,218,0.35)",
                                margin: "0 auto",
                            }}
                        >
                            <i
                                className="fa fa-check"
                                style={{ color: "#fff", fontSize: 40 }}
                            ></i>
                        </div>

                        {/* Ripple rings */}
                        {[1, 2].map((r) => (
                            <div
                                key={r}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%,-50%)",
                                    width: 100 + r * 40,
                                    height: 100 + r * 40,
                                    borderRadius: "50%",
                                    border: `2px solid rgba(6,163,218,${0.25 / r})`,
                                    animation: `ripple ${0.8 + r * 0.4}s ease-out infinite`,
                                    animationDelay: `${r * 0.2}s`,
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Card */}
                    <div
                        style={{
                            background: "#F7FCFF",
                            borderRadius: 24,
                            border: "1px solid rgba(6,163,218,0.15)",
                            padding: "40px 36px",
                            boxShadow: "0 12px 40px rgba(11,31,63,0.10)",
                        }}
                    >
                        <h1
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "2.2rem",
                                fontWeight: 800,
                                color: "#0B1F3F",
                                margin: "0 0 12px",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Order Placed!
                        </h1>

                        <h3
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: 400,
                                color: "#5a7090",
                                margin: "0 0 16px",
                            }}
                        >
                            Your request has been received 🎉
                        </h3>

                        <p
                            style={{
                                color: "#6b7a93",
                                fontSize: "0.9rem",
                                lineHeight: 1.7,
                                margin: "0 0 32px",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            We've received your order and our team is on it.
                            You can track your order or appointment status from the orders section.
                        </p>

                        {/* Divider */}
                        <div
                            style={{
                                height: 1,
                                background: "linear-gradient(90deg, transparent, #06A3DA, transparent)",
                                marginBottom: 28,
                            }}
                        ></div>

                        {/* Order Steps */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 16,
                                marginBottom: 32,
                                flexWrap: "wrap",
                            }}
                        >
                            {[
                                { icon: "fa-file-medical", label: "Order Placed" },
                                { icon: "fa-user-md",      label: "Processing"   },
                                { icon: "fa-truck",        label: "On the Way"   },
                                { icon: "fa-home",         label: "Delivered"    },
                            ].map(({ icon, label }, i) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background:
                                                i === 0
                                                    ? "linear-gradient(135deg, #06A3DA, #0484B8)"
                                                    : "rgba(6,163,218,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: i === 0 ? "0 4px 12px rgba(6,163,218,0.3)" : "none",
                                        }}
                                    >
                                        <i
                                            className={`fa ${icon}`}
                                            style={{
                                                color: i === 0 ? "#fff" : "#06A3DA",
                                                fontSize: 15,
                                            }}
                                        ></i>
                                    </div>

                                    <span
                                        style={{
                                            fontSize: "0.72rem",
                                            fontWeight: 600,
                                            color: i === 0 ? "#06A3DA" : "#94a3b8",
                                            whiteSpace: "nowrap",
                                            fontFamily: "'Outfit', sans-serif",
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <Link
                                to="/order"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "12px 24px",
                                    background: "linear-gradient(135deg, #06A3DA, #0484B8)",
                                    color: "#fff",
                                    borderRadius: 50,
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "0.88rem",
                                    fontFamily: "'Outfit', sans-serif",
                                    boxShadow: "0 4px 14px rgba(6,163,218,0.32)",
                                    transition: "all 0.2s",
                                }}
                            >
                                <i className="fa fa-box"></i>
                                Track My Order
                            </Link>

                            <Link
                                to="/medicine"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "12px 24px",
                                    background: "rgba(6,163,218,0.08)",
                                    color: "#06A3DA",
                                    borderRadius: 50,
                                    textDecoration: "none",
                                    fontWeight: 700,
                                    fontSize: "0.88rem",
                                    fontFamily: "'Outfit', sans-serif",
                                    border: "1.5px solid rgba(6,163,218,0.22)",
                                    transition: "all 0.2s",
                                }}
                            >
                                <i className="fa fa-pills"></i>
                                Order More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

                    @keyframes ripple {
                        0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.8); }
                        100% { opacity: 0; transform: translate(-50%,-50%) scale(1.6); }
                    }
                `}
            </style>
        </>
    );
}