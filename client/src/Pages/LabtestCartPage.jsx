import React, { useEffect, useState } from 'react'
import Cart from '../Components/Cart'
import { useDispatch, useSelector } from 'react-redux'
import { getLabtestCart } from '../Redux/ActionCreators/LabtestCartActionCreators'

export default function LabtestCartPage() {
    let LabtestCartStateData = useSelector(state => state.LabtestCartStateData)
    let dispatch = useDispatch()
    let [cart, setCart] = useState([])
    useEffect(() => {
      (() => {
        dispatch(getLabtestCart())
      })()
    }, [LabtestCartStateData.length])
  
    useEffect(()=>{
      (()=>{
        if(LabtestCartStateData.length){
          setCart(LabtestCartStateData.filter(x => x.user === localStorage.getItem("userid")))
        }
      })()
    },[LabtestCartStateData.length])
  return (
    <>
        <Cart title="Labtest" data={cart} />
    </>
  )
}
