import React, { useEffect, useState } from 'react';
import HeroSection from '../Components/HeroSection';
import Profile from '../Components/Profile';
import Cart from '../Components/Cart';
import { getMedicineCart } from '../Redux/ActionCreators/MedicineCartActionCreators';
import { getLabtestCart } from '../Redux/ActionCreators/LabtestCartActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function CheckoutPage() {
  const { category } = useParams();
  const dispatch     = useDispatch();

  const MedicineCartStateData = useSelector(state => state.MedicineCartStateData) || [];
  const LabtestCartStateData  = useSelector(state => state.LabtestCartStateData)  || [];

  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch carts on mount
  useEffect(() => {
    dispatch(getMedicineCart());
    dispatch(getLabtestCart());
  }, [dispatch]);

  // Filter by logged-in user whenever Redux state or category changes
  useEffect(() => {
    const userid = localStorage.getItem("userid");

    // After backend populate, x.user is an object { _id, name, username }
    // so we use (x.user?._id || x.user) to handle both populated and raw-ID cases
    if (category === "medicine") {
      const filtered = MedicineCartStateData.filter(
        x => (x.user?._id || x.user) === userid
      );
      setCart(filtered);
      setLoading(false);
    } else if (category === "labtest") {
      const filtered = LabtestCartStateData.filter(
        x => (x.user?._id || x.user) === userid
      );
      setCart(filtered);
      setLoading(false);
    }
  }, [MedicineCartStateData, LabtestCartStateData, category]);

  return (
    <>
      <HeroSection title="Checkout" />
      <div className="container my-4">
        <div className="card p-4 p-md-5" style={{ backgroundColor: '#F8F8F8' }}>
          <div className="row">
            {/* User profile / address panel */}
            <div className="col-md-5 mb-4 mb-md-0">
              <Profile title="Checkout" />
            </div>

            {/* Cart panel */}
            <div className="col-md-7">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5>Loading your cart...</h5>
                </div>
              ) : (
                <Cart
                  title={category}       // "medicine" or "labtest"
                  title1="Checkout"
                  data={cart}            // pre-filtered by user
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}