"use client";
import React from "react";
import HeroSection from "../Components/HeroSection";
import Link from "react";

// ✅ Fix: accept onDelete as prop — each wishlist type has its own delete action
export default function WishlistPage({ data = [], onDelete }) {

  function deleteRecord(_id) {
    if (window.confirm("Are You Sure To Delete This Item")) {
      if (onDelete) onDelete(_id)  // ✅ Fix: call parent-provided delete handler
    }
  }

  return (
    <>
      <HeroSection title="My Wishlist" />
      <h5 className="text-light text-center bg-primary p-2 mt-3 mx-3 mx-md-5">Wishlist</h5>

      <div className="container-fluid mt-3 mb-5 pb-3">
        <div className="mx-3 mx-md-5">

          {/* DESKTOP */}
          <div className="d-none d-md-block">
            {data.length ? (
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th></th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th></th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER}/${item.product?.pic}`}
                          height={50} width={50} alt="Product"
                        />
                      </td>
                      <td>{item.product?.name}</td>
                      <td>{item.product?.manufacturer?.name || item.product?.brand?.name}</td>
                      <td>₹{item.product?.finalPrice}</td>
                      <td>
                        {item.product?.stockQuantity === 0 ? "Out Of Stock" : `${item.product?.stockQuantity} Left`}
                      </td>
                      <td>
                        <Link href={`/product/${item.product?._id}`} className="btn btn-primary">
                          <i className="fa fa-shopping-cart"></i>
                        </Link>
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => deleteRecord(item._id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyWishlist />}
          </div>

          {/* MOBILE */}
          <div className="d-block d-md-none">
            {data.length ? data.map((item) => (
              <div className="card mb-3 shadow-sm" key={item._id}>
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER}/${item.product?.pic}`}
                      alt="Product"
                      style={{ width: 80, height: 80, objectFit: "contain" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.product?.name}</h6>
                      <p className="mb-1 text-muted small">
                        Brand: {item.product?.manufacturer?.name || item.product?.brand?.name}
                      </p>
                      <p className="mb-1 small">Price: ₹{item.product?.finalPrice}</p>
                      <p className="mb-2 small">
                        {item.product?.stockQuantity === 0 ? "Out Of Stock" : `${item.product?.stockQuantity} Left`}
                      </p>
                      <div className="d-flex gap-2">
                        <Link href={`/product/${item.product?._id}`} className="btn btn-sm btn-primary w-100">
                          Add to Cart
                        </Link>
                        <button className="btn btn-sm btn-outline-danger w-100" onClick={() => deleteRecord(item._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : <EmptyWishlist />}
          </div>

        </div>
      </div>
    </>
  );
}

function EmptyWishlist() {
  return (
    <div className="py-5 text-center">
      <h3>No Item In Wishlist</h3>
      <Link href="/shop" className="btn btn-primary mt-2">Shop Now</Link>
    </div>
  );
}