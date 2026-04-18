import React, { useEffect, useState } from 'react'
import HeroSection from '../Components/HeroSection'
import Profile from '../Components/Profile'

export default function ProfilePage() {
  let [data, setData] = useState({})

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/${localStorage.getItem("userid")}`, {
          method: "GET",
          headers: {
            'content-type': 'application/json',
            "authorization":localStorage.getItem("token")
          }
        });
        response = await response.json();
        setData(response.data)
        console.log(data)
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);
  return (
    <>
      <HeroSection title={`${data.role} Profile`} />
      <div className="container">
        <Profile title={data.role || "No Role Assigned"} />
      </div>
    </>
  )
}
