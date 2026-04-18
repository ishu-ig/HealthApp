import React, { useEffect } from 'react'
import HeroSection from '../Components/HeroSection'
import Services from '../Components/Services'

import { useDispatch, useSelector } from 'react-redux'
import { getSpecialization } from '../Redux/ActionCreators/SpecializationActionCreators'
import { getMedicineCategory } from '../Redux/ActionCreators/MedicineCategoryActionCreators'
import { getLabtestCategory } from '../Redux/ActionCreators/LabtestCategoryActionCreators'
import { getNurse } from '../Redux/ActionCreators/NurseActionCreators'
import Nurse from '../Components/Nurse'


export default function ServicePage() {
  const SpecializationStateData = useSelector(state => state.SpecializationStateData)
  const MedicineCategoryStateData = useSelector(state => state.MedicineCategoryStateData)
  const LabtestCategoryStateData = useSelector(state => state.LabtestCategoryStateData)
  const NurseStateData = useSelector(state => state.NurseStateData)


  let dispatch = useDispatch()

  useEffect(() => {
    (() => {
      dispatch(getSpecialization())
    })()
  }, [SpecializationStateData.length])

  useEffect(() => {
    (() => {
      dispatch(getMedicineCategory());
    })()
  }, [MedicineCategoryStateData.length])
  useEffect(() => {
    (() => {
      dispatch(getLabtestCategory());
    })()
  }, [MedicineCategoryStateData.length])
  useEffect(() => {
    (() => {
      dispatch(getNurse());
    })()
  }, [NurseStateData.length])
  return (
    <>
      <HeroSection title="Our Services" />
      <Services title="Doctor Specialization" data={SpecializationStateData.filter(x => x.active)} />
      <Services title="Medicine Category" data={MedicineCategoryStateData.filter(x => x.active)} />
      <Services title="Labtest Category" data={LabtestCategoryStateData.filter(x => x.active)} />
      <Nurse title="Nurse Service" data={NurseStateData.filter(x => x.active).slice(0,6)}/>
    </>
  )
}
