import React, { useState, useEffect } from 'react';
import DeleteBlog from './component/DeleteBlog';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { CgSpinner } from 'react-icons/cg';
import { db } from '../../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

import ModalPop from '../../components/modalPop';
import { MdDeleteForever } from 'react-icons/md';

const ViewBlog = () => {
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [blogsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1);
    const [openBlog, setOpenBlog] = useState(false)
    const [details, setDetails] = useState([])
    const [openDetails, setOpenDetails] = useState(false)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const fetchBlog = async () => {
        setLoading(true);
        try {
            const blogsCollection = collection(db, 'blogs');
            let q = query(blogsCollection);
            
            // Add date filtering if dates are selected
            if (startDate && endDate) {
                q = query(
                    blogsCollection,
                    where('created_on', '>=', new Date(startDate)),
                    where('created_on', '<=', new Date(endDate))
                );
            }

            const querySnapshot = await getDocs(q);
            const blogsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setBlogs(blogsData);
            setFilteredBlogs(blogsData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, []);

    useEffect(() => {
        // Filter blogs based on date range
        const filtered = blogs.filter(blog => {
            const blogDate = new Date(blog.created_on);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if (start && end) return blogDate >= start && blogDate <= end;
            if (start) return blogDate >= start;
            if (end) return blogDate <= end;
            return true;
        });
        
        setFilteredBlogs(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [startDate, endDate, blogs]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredBlogs.length / blogsPerPage));
    }, [filteredBlogs, blogsPerPage]);

    // Get current blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

  return (
    <div className='mt-[0px] w-full'>
        <div className='flex flex-col lg:flex-row items-center gap-[10px]'>

            <div className='w-full lg:w-[336px] rounded-lg h-[200px] border border-[#E0E2E7] flex flex-col p-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-euclid text-sm text-[#817F9B]'>Total Blogs Post</p>
                    <div className='w-[44px] h-[44px] invisible rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        {/* <img src={Activity} alt='Activity' className='w-5 h-5' /> */}
                    </div>
                </div>
                <div className='flex items-center mt-3'>
                    <p className='font-euclid text-[#1C1C1C] text-[30px] font-semibold'>
                        {currentBlogs.length || 0}
                    </p>
                </div>
            </div>

        </div>

        <div className='w-full mt-10'>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col lg:flex-row gap-5 lg:gap-0 items-center justify-between px-5'>
                    <p className='font-euclid text-[18px] font-medium text-[#1C1C1E]'>All Blogs</p>

                    {/* <div className='flex flex-col gap-1'>
                        <p className='font-euclid text-sm font-medium text-[#1C1C1E]'>Start Date</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full lg:w-[150px] h-[40px] border border-[#EBEDF0] outline-[#1EC677] rounded-lg p-2"
                        />
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                        <p className='font-euclid text-sm font-medium text-[#1C1C1E]'>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full lg:w-[150px] h-[40px] border border-[#EBEDF0] outline-[#1EC677] rounded-lg p-2"
                        />
                    </div> */}
                   
                </div>

            </div>

            <div className='mt-5 p-5 overflow-x-auto w-full'>
                <table>
                    <thead>
                        <tr className='w-full border rounded-t-xl border-[#F0F1F3]'>
                        <th className='w-[400px] h-[18px] text-sm text-left font-euclid text-[#333843] p-4 font-medium'>
                            ID
                        </th>
                        <th className='w-[400px] h-[18px] text-left text-sm font-euclid text-[#333843] p-4 font-medium'>
                            <div className='flex items-center gap-1'>
                            <p className='text-sm text-[#333843] font-euclid'>Date Created</p>
                                <IoIosArrowDown className="text-[#667085] text-base" />
                            </div>
                        </th>
                        <th className='w-[400px] h-[18px] text-left font-euclid text-[#333843] p-4 font-medium'>
                            <p className='text-sm text-[#333843] font-euclid'>Author</p>
                        </th>
                        <th className='w-[400px] h-[18px] text-left font-euclid text-[#333843] p-4 font-medium'>
                            <p className='text-sm text-[#333843] font-euclid'>Topic</p>
                        </th>
                        {/* <th className='w-[400px] h-[18px] text-left font-euclid text-[#333843] p-4 font-medium'>
                            <p className='text-sm text-[#333843] font-euclid'>Content</p>
                        </th> */}
                        <th className='w-[400px] h-[18px] text-left font-euclid text-[#333843] p-4 font-medium'>
                            <p className='text-sm text-[#333843] font-euclid'>ImageUrl</p>
                        </th>
                        <th className='w-[169px] h-[18px] text-left text-sm font-euclid text-[#333843] p-4 font-medium'>
                            Action
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                        <tr className='h-[300px] bg-white border-t border-grey-100'>
                            <td colSpan="4" className="relative">
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <CgSpinner className='animate-spin text-[#1EC677] text-[200px]' />
                            </div>
                            </td>
                        </tr>
                        ) : currentBlogs?.length > 0 ? (
                            currentBlogs?.map((item) => (
                            <tr key={item.id} className='w-full mt-[18px] border border-[#F0F1F3]'>
                                <td className='w-[400px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <p className='font-euclid text-[#333843] font-medium text-sm'>{`#${item?.id.slice(0, 8)}`}</p>
                                </td>
                                <td className='w-[200px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <p className='font-euclid text-[#333843] font-medium text-sm'>{item.createdAt?.toDate().toDateString()}</p>
                                </td>
                                <td className='w-[400px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <p className='font-euclid text-[#333843] font-medium text-sm'>{item?.author || "N/A"}</p>
                                </td>
                                <td className='w-[400px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <p className='font-euclid text-[#333843] font-medium text-sm'>{item?.topic || "N/A"}</p>
                                </td>
                                {/* <td className='w-[300px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: item?.content }} 
                                        className='font-euclid text-[#333843] font-medium text-sm'
                                    />
                                        {/* <p className='font-euclid text-[#333843] font-medium text-sm'>{item?.content || "N/A"}</p> 
                                </td> */}
                                <td className='w-[400px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <img src={item?.imageUrl} alt="post_image" className='' />
                                </td>
                                <td className='w-[300px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium'>
                                    <div className='flex items-center gap-[10px]'>
                                        <MdDeleteForever className="text-[17px] text-[#667085] cursor-pointer" onClick={() => { setDetails(item), setOpenBlog(true); }} />
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                        <tr className='h-[300px] bg-white border-t border-grey-100'>
                            <td colSpan="4" className="relative">
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='flex flex-col gap-2 items-center'>
                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Blog Available</p>
                                </div>
                            </div>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>

            </div>
    
            <div className='w-full flex items-center justify-between p-5'>
                <div className='bg-[#FAFAFE] w-[136px] h-[40px] flex items-center justify-center'>
                    <p className='font-euclid text-[#667085] text-base'>Page {currentPage} of {totalPages}</p>
                </div>

                <div>
                    <div className='flex h-[34px] justify-center  w-full gap-2 items-center'>

                        <div 
                            onClick={handlePrevPage} 
                            className={`bg-[#FAFAFE] transition-all duration-500 ease-in-out  flex justify-center items-center cursor-pointer w-8 h-full  ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                        >
                            <IoIosArrowBack className='text-[#667085] hover:text-[#fff]'/>
                        </div>

                        {[...Array(totalPages)].map((_, index) => (
                            <div 
                               key={index} 
                               onClick={() => setCurrentPage(index + 1)} 
                               className={`transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full ${
                                   currentPage === index + 1 
                                   ? 'bg-[#1EC677] text-white'  // Active page styling
                                   : 'bg-[#FAFAFE] hover:bg-[#FAFAFE]'  // Inactive page styling
                               }`}
                               >
                                {index + 1}
                            </div>
                        ))}


                        <div 
                            onClick={handleNextPage} 
                            className={`transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full  bg-[#FAFAFE] ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                        >
                            <IoIosArrowForward className='text-[#667085] hover:text-[#fff]'/>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <ModalPop isOpen={openBlog}>
            <DeleteBlog
                handleClose={() => setOpenBlog(false)}
                details={details}
            />
        </ModalPop>       

    </div>
  )
}

export default ViewBlog