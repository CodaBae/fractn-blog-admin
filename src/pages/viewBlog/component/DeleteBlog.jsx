import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { db } from '../../../firebase-config'
import { toast } from 'react-toastify'
import { deleteDoc, doc } from 'firebase/firestore'

const DeleteBlog = ({ handleClose, details }) => {
    const [loading, setLoading] = useState(false)



    const deleteBlog = async () => {
        setLoading(true)
        try {
            const blogDocRef = doc(db, 'blogs', details.id)
            await deleteDoc(blogDocRef)
            toast("Blog Deleted Successfully", {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            });
            handleClose() 
            window.location.reload
        } catch (error) {
            console.error('Error deleting blog:', error)
            toast("Error deleting blog", {
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            });
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='flex flex-col bg-[#fff] w-8/12 md:w-[327px] xs:h-[150px] mt-[100px] md:h-[250px] p-8'>
        <div className='flex flex-col text-center gap-3'>
            <p className='text-[#000] font-bold text-3xl'>Are you sure?</p>
            <p className='text-[#000] '>Once you click Delete, the blog can't be retrieve again</p>
        </div>
        <div className='flex justify-between mt-10'>
            <button type="button" onClick={handleClose} className='bg-primary p-3 text-white rounded border-none'>Cancel</button>
            <button 
                type='submit' 
                onClick={() => deleteBlog()} 
                className='bg-RED-_100 p-3 text-white flex items-center justify-center rounded border-none'
            >
                <p className='text-[#fff] text-sm  text-center  font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : 'Delete'}</p>
            </button>
        </div>

    </div>

  )
}

export default DeleteBlog