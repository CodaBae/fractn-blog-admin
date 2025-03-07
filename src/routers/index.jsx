import React from 'react'
import { Route, Routes } from "react-router-dom";



import Blog from '../pages/blog';
import DashboardLayout from '../layouts';


export default function Routers() {

  return (
    <div>
      <Routes>  

        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Blog />} />
        </Route>

      </Routes>
    </div>
  )
}
