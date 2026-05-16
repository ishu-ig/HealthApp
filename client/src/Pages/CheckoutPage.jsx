import React from 'react';
import { useParams } from 'react-router-dom';
import HeroSection from '../Components/HeroSection';
import Profile from '../Components/Profile';
import Cart from '../Components/Cart';

export default function CheckoutPage() {
  const { category } = useParams();

  return (
    <>
      <HeroSection title="Checkout" />
      <div className="container">
        <div className="container card p-5" style={{ backgroundColor: '#F8F8F8' }}>
          <div className="row">
            <div className="col-md-5">
              <Profile title="Checkout" />
            </div>
            <div className="col-md-7">
              <Cart title="Checkout" category={category} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}