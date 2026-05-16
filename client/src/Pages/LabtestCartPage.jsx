import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cart from '../Components/Cart';
import { getLabtestCart } from '../Redux/ActionCreators/LabtestCartActionCreators';

export default function LabtestCartPage() {
  const LabtestCartStateData = useSelector(s => s.LabtestCartStateData) || [];
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    dispatch(getLabtestCart());
  }, [dispatch]);

  useEffect(() => {
    if (LabtestCartStateData?.length) {
      const mapped = LabtestCartStateData
        .filter(x => (x.user?._id || x.user) === localStorage.getItem('userid'))
        .map(x => ({
          _id:             x._id,
          user:            x.user?._id || x.user,
          name:            x.labtest?.name,
          pic:             Array.isArray(x.labtest?.pic) ? x.labtest.pic[0] : x.labtest?.pic,
          price:           x.labtest?.finalPrice,
          labtestCategory: x.labtest?.labtestCategory?.name || x.labtest?.labtestCategory,
          lab:             x.labtest?.lab?.name || x.labtest?.lab,
          sampleType:      x.labtest?.sampleType,
          total:           x.total ?? x.labtest?.finalPrice,
        }));
      setCart(mapped);
    }
  }, [LabtestCartStateData]);

  return <Cart title="labtest" data={cart} />;
}