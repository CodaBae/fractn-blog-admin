import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PiNotebook } from "react-icons/pi";

import LogoGreen from "../assets/svg/logo-green.svg"



const Sidebar = ({ closeSidebar }) => {

  const location = useLocation()
  const navigate = useNavigate()


  return (
    <div className='border w-full flex flex-col items-center bg-[#fff]  py-[18px] px-[24px] h-full border-l-0 overflow-y-auto overflow-x-hidden border-t-0 border-r-[#E5E5EA]'>
      <div className={`lg:flex hidden flex-col -ml-[10%] gap-1`}>
        <img src={LogoGreen} alt='LogoGreen' className='w-[132px] h-[38px]' />
      </div>
      <div className={`mt-[80px] lg:mt-[49px] flex flex-col gap-2 h-screen relative`}>
        
        <div 
            className={`${location.pathname === "/"  ? "bg-[#1EC677]" : ""} flex items-center gap-3 group hover:bg-[#1EC677] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} 
            onClick={() => {navigate("/"); closeSidebar()}}
        >
            <PiNotebook className={`${location.pathname === "/" ? "text-[#fff]" : ""} w-4 h-4 text-[#575757] group-hover:text-[#fff]`} />
            <p className={`${location.pathname === "/" ? "text-[#fff]" : ""} font-euclid text-[#575757] group-hover:text-[#fff] font-medium text-sm`}>Blog</p>
        </div>

    </div>

    </div>
  )
}

export default Sidebar
