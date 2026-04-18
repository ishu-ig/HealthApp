import React from 'react'
import HeroSection from '../Components/HeroSection'
import Error from '../Components/Error'

export default function ErrorPage() {
  return (
    <>
        <HeroSection title="404 Error" />
        <Error />
    </>
  )
}
