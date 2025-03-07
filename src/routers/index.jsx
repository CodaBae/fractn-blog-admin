import React from 'react'
import { Route, Routes } from "react-router-dom";

import DashboardLayout from '../layouts';

import Blog from '../pages/blog';
import ViewBlog from '../pages/viewBlog';


export default function Routers() {

  return (
    <div>
      <Routes>  

        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Blog />} />
          <Route path='/view-blog' element={<ViewBlog />} />
        </Route>

      </Routes>
    </div>
  )
}
