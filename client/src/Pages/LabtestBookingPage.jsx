import React, { useEffect } from 'react'
import HeroSection from '../Components/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { getLabtestCheckout } from '../Redux/ActionCreators/LabtestCheckoutActionCreators'
import Order from '../Components/Order'

export default function LabtestBookingPage() {
    let LabtestCheckoutStateData = useSelector(state => state.LabtestCheckoutStateData)
    let dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLabtestCheckout())
    }, [LabtestCheckoutStateData.length])

    return (
        <>
            <HeroSection title="Lab Test Bookings" />
            <Order title="LabtestOrder" data={LabtestCheckoutStateData} />
        </>
    )
}