import React, { useEffect, useState } from 'react'
import Order from '../Components/Order'
import { useDispatch, useSelector } from 'react-redux'
import { getMedicineCart } from '../Redux/ActionCreators/MedicineCartActionCreators'
import Cart from '../Components/Cart'

export default function MedicineCartPage() {
  let MedicineCartStateData = useSelector(state => state.MedicineCartStateData)
  let dispatch = useDispatch()
  let [cart, setCart] = useState([])
  useEffect(() => {
    (() => {
      dispatch(getMedicineCart())
    })()
  }, [MedicineCartStateData.length])
  console.log(MedicineCartStateData)

  useEffect(()=>{
    (()=>{
      if(MedicineCartStateData.length){
        setCart(MedicineCartStateData.filter(x => x.user === localStorage.getItem("userid")))
      }
    })()
  },[MedicineCartStateData.length])
  return (
    <>
      <Cart title="medicine" data={cart} />
    </>
  )
}
