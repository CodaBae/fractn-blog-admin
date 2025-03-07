import React, { useState } from 'react'
import Note from "../assets/svg/note.svg"
import Bell from "../assets/svg/bell.svg"
import { IoSearch } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi';
import { TbReportAnalytics } from 'react-icons/tb'

const Header = ({ toggleSidebar }) => {
    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const location = useLocation()

    const type = localStorage.getItem("type")

  return (
    <div className='py-[18px] px-[28px] h-[72px]'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <GiHamburgerMenu className={`${location.pathname === "/report" ? "block" : "lg:hidden"} w-6 h-6 text-[#000]  cursor-pointer`} onClick={toggleSidebar} />
                <img src={Note} alt='Note' className={`${location.pathname === "/report" ? "hidden" : "flex"} w-[28px] h-[28px]`}/>
                <p className='font-euclid text-[#00000066] cursor-pointer text-sm' onClick={() => {}}>
                    {location.pathname === "/report" ? "Report" : "Dashboard"}
                </p>
                <p className='font-euclid text-[#00000066] text-sm'>/</p>
                <p className='text-[#1C1C1C] font-euclid text-sm'>
                    {
                        location.pathname.includes("/users") ? "Users" : 
                        location.pathname.includes("/questions") ? "Questions" : 
                        location.pathname.includes("/transactions") ? "Transactions" : 
                        location.pathname.includes("/notification") ? "Notification" : "Overview"
                    }
                    
                </p>
            </div>

            {
                location.pathname === "/report" ? 
                <div className='w-full flex justify-end items-center'>
                    <div className='bg-[#1EC677] rounded-xl w-[119px] h-[45px] flex items-center justify-center gap-2'>
                        <TbReportAnalytics className='text-[#fff] w-4 h-4' />
                        <p className='text-[#fff] font-euclid text-xs font-semibold'>Export Report</p>
                    </div>
                </div>
                :
                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                        <div className='w-[254px] lg:flex items-center invisible hidden bg-[#0000000D] rounded-lg h-[36px] '>
                            <div className='bg-[#0000000D] h-full rounded-tl-lg rounded-bl-lg flex items-center p-2'>
                                <IoSearch className='w-4 h-4 text-[#00000066]' />
                            </div>
                            <input 
                                name='search'
                                value={search}
                                className='w-full bg-[#0000000D] h-full rounded-tr-lg rounded-br-lg p-2 outline-none'
                                placeholder='Search'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <img src={Bell} alt='Bell' className='w-5 h-5' />
                    </div>
                
                </div>
            }


        </div>
    </div>
  )
}

export default Header
