import React, { useRef, useState } from 'react'
import { Formik, Form} from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg'
import { CustomToolbar } from './components/CustomToolbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '../../firebase-config';

import Upload from "../../assets/svg/uploadIcon.svg"  

const Blog = () => {
    const [loading, setLoading] = useState(false)
    const [uploadImageLoading, setUploadImageLoading] = useState(false)
    const [userImage, setUserImage] = useState(null)

    const formValidationSchema = Yup.object().shape({
        category: Yup.string().required("Category is required"),
        topic: Yup.string().required("Topic is required"),
        description: Yup.string().required("Content is required"),
    })

    const fileInputRef = useRef(null); 

    const categoryOptions = [
        "Product Guides",
        "Personal Finance & Money Management",
        "Security & Fraud Prevention",
        "Product Updates & Features",
        "Use cases & Testimonials"
    ] 

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        setUploadImageLoading(true)
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'rztljgso');
            try {
                const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/dizlp3hvp/upload", formData);
                const data = uploadResponse.data;
                setUserImage(data);  // Set the uploaded image as the userImage
                toast("Image Uploaded Successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                });
            } catch (error) {
                toast("Error Uploading Image", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                });
                console.error('Error uploading file:', error);
            } finally {
                setUploadImageLoading(false)
            }
        }
    };
    

    // Updated submitForm function
    const submitForm = async (values, action) => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'blogs'), {
                category: values.category,
                topic: values.topic,
                content: values.description,
                imageUrl: userImage?.secure_url || '',
                createdAt: new Date(),
            });
            
            toast.success('Blog post created successfully!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
            });
            
            // Reset form and state
            action.resetForm();
            setUserImage(null);
        } catch (error) {
            toast.error('Error submitting blog post', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
            });
            console.error('Firestore submission error:', error);
        } finally {
            setLoading(false);
        }
    };



  return (
    <div className="p-4">
        <div className=' w-[500px]'>
            <Formik
                initialValues={{
                    topic: "",
                    description: "",
                    category: ""
                }}
                validationSchema={formValidationSchema}
                onSubmit={(values, action) => {
                    window.scrollTo(0, 0)
                    console.log(values, "often")
                    submitForm(values, action)
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    dirty,
                    isValid,
                    setFieldValue,
                    errors,
                    touched,
                    // setFieldTouched,
                    values,
                }) => (
                <Form onSubmit={handleSubmit} className="flex flex-col">
                    <div className='flex flex-col gap-6 h-[47px]'>
            
                        <div className="flex flex-col">
                            <label htmlFor="Category" className="font-euclid text-sm">Category</label>
                            <select
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                className="rounded-lg border-[#E5E5EA] text-[#3A3A3C] outline-[#34C759] w-full mt-1.5 h-[56px] border-solid  p-2 border"
                            >
                                <option value="" defaultValue>Select Category</option>
                                {
                                    categoryOptions.map((item, index) => (
                                        <option key={index}>{item}</option>
                                    ))
                                }
                            </select>
                            {errors.category && touched.category ? (
                            <div className='text-RED-_100 text-xs'>{errors.category}</div>
                            ) : null}
                        </div>

                        <div className="flex flex-col ">
                            <label htmlFor="Topic" className="font-euclid text-sm">Topic</label>
                            <input
                                name="topic"
                                placeholder="Type topic here..."
                                type="text" 
                                value={values.topic}
                                onChange={handleChange}
                                className="rounded-lg border-[#E5E5EA] font-euclid text-[#3A3A3C] outline-[#34C759] w-full mt-1.5 h-[56px] border-solid  p-2 border"
                            />
                            {errors.topic && touched.topic ? (
                            <div className='text-RED-_100 text-xs'>{errors.topic}</div>
                            ) : null}
                        </div>

                        <div className='flex flex-col gap-[9px]'>
                            <p className='font-medium font-euclid text-[#334155]'>Title Image</p>
                            <div className='flex items-center gap-5'>
                                <div>
                                    {userImage?.secure_url ? 
                                        <div className='flex flex-col gap-1 w-full relative'>
                                            <div className='flex items-center justify-end'>
                                                <MdClose  
                                                className='text-[24px] absolute top-5 right-5 font-hanken text-[#fff]'
                                                onClick={() => setUserImage(null)}
                                                />
                                            </div>
                                            
                                            <img src={userImage?.secure_url} alt="Preview" className=" w-[518px] h-[359px]" />
                                        </div> 
                                        :
                                        <div 
                                            className='p-[9px] w-[518px] rounded-lg bg-[#000929] h-[359px] cursor-pointer flex-col items-center flex justify-center gap-[16px]'
                                            onClick={handleDivClick}
                                        >
                                            <div className='flex flex-col items-center gap-[16px]'>
                                                <img src={Upload} alt='upload' className='w-[56px] h-[56px]' />
                                                <label htmlFor="fileInput" className='cursor-pointer px-[22px] flex justify-center items-center'>
                                                    {uploadImageLoading ? 
                                                        <p className='text-[#FFFFFF] text-base font-euclid'>Please wait...</p>
                                                        :
                                                        <p className='text-[#FFFFFF] text-base font-euclid'> <span className='underline text-[#1EC677] font-euclid text-base'>Choose File</span> to upload </p>
                                                    }
                                                    <input
                                                        type="file"
                                                        id="fileInput"
                                                        accept='image/*'
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    }
                                </div>
                            
                            </div>
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="Content" className="font-euclid text-sm">Content</label>
                            <CustomToolbar />
                            <ReactQuill 
                                theme="snow" 
                                value={values.description} 
                                onChange={(e) => setFieldValue("description", e)}
                                modules={modules}
                                formats={formats}
                                style={{ backgroundColor: "#fff", minHeight: "193px", border: '1px solid #ccc', borderRadius: '4px', padding: '10px'}}
                                className="lg:w-[507px] h-[193px] mt-1.5 outline-none"     
                            />
                            
                            {errors.description && touched.description ? 
                                <div className='text-RED-_100'>{errors.description}</div> 
                                : null
                            }
                        </div>
                    

                        <button 
                            className= "bg-[#1EC677] mt-5 text-[#fff] rounded-lg p-3 cursor-pointer w-full h-[54px] flex justify-center"
                            type="submit"
                        >
                            <p className='text-[#fff] text-sm  text-center  font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : 'Send'}</p>
                        </button>

                    
                    
                    </div>
                    

                </Form>
                )}
            </Formik>
        </div>
    </div>
  )
}

const modules = {
    toolbar: {
      container: "#toolbar",
    }
  };
  
  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'link', 'image', 'video', 'list'
  ];

export default Blog