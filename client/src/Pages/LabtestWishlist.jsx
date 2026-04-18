import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'  // ✅ added useDispatch
import { getLabtestWishlist } from '../Redux/ActionCreators/LabtestWishlistActionCreators'
import WishlistPage from '../Components/Wishlist'

export default function LabtestWishlist() {
    const dispatch = useDispatch()  // ✅ was missing entirely
    
    // ✅ Fixed: was "LabtestWishlistStateData : useSelector(...)" (label syntax, not assignment)
    // ✅ Fixed: was reading from wrong state "LabtestStateData" instead of "LabtestWishlistStateData"
    const LabtestWishlistStateData = useSelector(state => state.LabtestWishlistStateData) || []

    useEffect(() => {
        dispatch(getLabtestWishlist())
    }, [dispatch])

    // ✅ Removed useState for data — unnecessary, pass state directly as prop
    // ✅ Fixed: setData() was called outside useEffect (caused infinite re-render)

    return (
        <WishlistPage data={LabtestWishlistStateData} />
    )
}