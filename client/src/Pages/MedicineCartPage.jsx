import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cart from '../Components/Cart';
import { getMedicineCart } from '../Redux/ActionCreators/MedicineCartActionCreators';

export default function MedicineCartPage() {
  const MedicineCartStateData = useSelector(s => s.MedicineCartStateData) || [];
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    dispatch(getMedicineCart());
  }, [dispatch]);

  useEffect(() => {
    if (MedicineCartStateData?.length) {
      const mapped = MedicineCartStateData
        .filter(x => (x.user?._id || x.user) === localStorage.getItem('userid'))
        .map(x => ({
          _id:              x._id,
          user:             x.user?._id || x.user,
          name:             x.medicine?.name,
          pic:              Array.isArray(x.medicine?.pic) ? x.medicine.pic[0] : x.medicine?.pic,
          price:            x.medicine?.finalPrice,
          medicineCategory: x.medicine?.medicineCategory?.name || x.medicine?.medicineCategory,
          qty:              x.qty,
          total:            x.total ?? (x.medicine?.finalPrice * x.qty),
        }));
      setCart(mapped);
    }
  }, [MedicineCartStateData]);

  return <Cart title="medicine" data={cart} />;
}