import React, { useRef, useState } from 'react'
import { Formik, Form} from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg'
import { CustomToolbar } from './CustomToolbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import Upload from "../../../assets/svg/uploadIcon.svg"  
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateBlog = () => {
    const { state } = useLocation()

    const [loading, setLoading] = useState(false)
    const [uploadImageLoading, setUploadImageLoading] = useState(false)
    const [uploadAuthorImageLoading, setUploadAuthorImageLoading] = useState(false)
    const [userImage, setUserImage] = useState(state?.imageUrl || null)
    const [authorImage, setAuthorImage] = useState(state?.authorImageUrl || null) 

    const formValidationSchema = Yup.object().shape({
        category: Yup.string().required("Category is required"),
        topic: Yup.string().required("Topic is required"),
        author: Yup.string().required("Author's name is required"),
        description: Yup.string().required("Content is required"),
        metaDescription: Yup.string()
                        .required("Meta description is required")
                        .max(160, "Max 160 characters"),
    })

    const navigate = useNavigate()

    const fileInputRef = useRef(null); 
    const authorFileInputRef = useRef(null); 

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

    const handleAuthorDivClick = () => {
        authorFileInputRef.current.click();
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
                setUserImage(data);
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

    const handleAuthorFileChange = async (e) => {
        setUploadAuthorImageLoading(true)
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'rztljgso');
            try {
                const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/dizlp3hvp/upload", formData);
                const data = uploadResponse.data;
                setAuthorImage(data);
                toast("Author Image Uploaded Successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                });
            } catch (error) {
                toast("Error Uploading Author Image", {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                });
                console.error('Error uploading author image:', error);
            } finally {
                setUploadAuthorImageLoading(false)
            }
        }
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const submitForm = async (values, action) => {
        setLoading(true);
        try {
            const blogData = {
                category: values.category,
                topic: values.topic,
                content: values.description,
                metaDescription: values.metaDescription,
                imageUrl: userImage?.secure_url || state?.imageUrl || '',
                authorImageUrl: authorImage?.secure_url || state?.authorImageUrl || '',
                slug: generateSlug(values.topic),
                author: values.author,
                updatedAt: serverTimestamp(),
            };
            
            const docRef = doc(db, 'blogs', state.id);
            await updateDoc(docRef, blogData);
            toast.success('Blog post updated successfully!', {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
            });
            
            navigate("/blog/view")
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
        <div className='w-full'>
            <Formik
                initialValues={{
                    topic: state?.topic || "",
                    description: state?.content || "",
                    category: state?.category || "",
                    metaDescription: state?.metaDescription || "",
                    author: state?.author || ""
                }}
                validationSchema={formValidationSchema}
                enableReinitialize={true}
                onSubmit={(values, action) => {
                    window.scrollTo(0, 0)
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
                    values,
                }) => (
                <Form onSubmit={handleSubmit} className="flex flex-col">
                    <div className='flex flex-col gap-6'>

                        <div className='flex flex-col lg:flex-row gap-6'>
                            <div className='flex flex-col w-full gap-6'>
                                <div className="flex flex-col ">
                                    <label htmlFor="Author" className="font-euclid text-sm">Author</label>
                                    <input
                                        name="author"
                                        placeholder="Type author's name here..."
                                        type="text" 
                                        value={values.author}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#E5E5EA] font-euclid text-[#3A3A3C] outline-[#34C759] w-full mt-1.5 h-[56px] border-solid  p-2 border"
                                    />
                                    {errors.author && touched.author ? (
                                    <div className='text-RED-_100 text-xs'>{errors.author}</div>
                                    ) : null}
                                </div>

                                {/* Author Image Upload Section */}
                                <div className="flex flex-col">
                                    <label className="font-euclid text-sm">Author Image</label>
                                    <div className='flex items-center gap-5 mt-1.5'>
                                        <div className='w-full'>
                                            {authorImage?.secure_url ? 
                                                <div className='flex flex-col gap-1 w-full relative'>
                                                    <div className='flex items-center justify-end'>
                                                        <MdClose  
                                                        className='text-[24px] absolute top-2 right-2 font-hanken text-[#fff] bg-black/50 rounded-full p-0.5 cursor-pointer'
                                                        onClick={() => setAuthorImage(null)}
                                                        />
                                                    </div>
                                                    <img 
                                                        src={authorImage?.secure_url} 
                                                        alt="Author Preview" 
                                                        className="w-full h-32 object-cover rounded-lg" 
                                                    />
                                                </div> 
                                                :
                                                <div 
                                                    className='p-4 rounded-lg bg-[#000929] border border-dashed border-gray-300 cursor-pointer flex items-center justify-center gap-2 h-32'
                                                    onClick={handleAuthorDivClick}
                                                >
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <img src={Upload} alt='upload' className='w-6 h-6' />
                                                        <label htmlFor="authorFileInput" className='cursor-pointer flex justify-center items-center'>
                                                            {uploadAuthorImageLoading ? 
                                                                <p className='text-gray-600 text-sm font-euclid'>Uploading...</p>
                                                                :
                                                                <p className='text-gray-600 text-sm font-euclid'> 
                                                                    <span className='text-[#1EC677] underline font-medium'>Upload Author Image</span>
                                                                </p>
                                                            }
                                                            <input
                                                                type="file"
                                                                id="authorFileInput"
                                                                accept='image/*'
                                                                style={{ display: 'none' }}
                                                                onChange={handleAuthorFileChange}
                                                                ref={authorFileInputRef}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

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

                                <div className="flex flex-col ">
                                    <label htmlFor="metaDescription" className="font-euclid text-sm">Meta Description</label>
                                    <textarea
                                        name="metaDescription"
                                        placeholder="Enter meta description (160 characters max)"
                                        value={values.metaDescription}
                                        onChange={handleChange}
                                        className="rounded-lg border-[#E5E5EA] font-euclid text-[#3A3A3C] outline-[#34C759] w-full mt-1.5 h-24 border-solid p-2 border"
                                    />
                                    {errors.metaDescription && touched.metaDescription && (
                                        <div className='text-RED-_100 text-xs'>{errors.metaDescription}</div>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col gap-[9px]'>
                                <p className='font-medium font-euclid text-[#334155]'>Featured Image</p>
                                <div className='flex items-center gap-5'>
                                    <div>
                                        {userImage?.secure_url ? 
                                            <div className='flex flex-col gap-1 w-full relative'>
                                                <div className='flex items-center justify-end'>
                                                    <MdClose  
                                                    className='text-[24px] absolute top-5 right-5 font-hanken text-[#fff] bg-black/50 rounded-full p-0.5 cursor-pointer'
                                                    onClick={() => setUserImage(null)}
                                                    />
                                                </div>
                                                
                                                <img src={userImage?.secure_url} alt="Preview" className="w-[518px] h-[359px] object-cover" />
                                            </div> 
                                            :
                                            <div 
                                                className='p-[9px] w-[320px] md:w-[518px] rounded-lg bg-[#000929] border border-dashed border-gray-300 cursor-pointer flex-col items-center flex justify-center gap-[16px] h-[359px]'
                                                onClick={handleDivClick}
                                            >
                                                <div className='flex flex-col items-center gap-[16px]'>
                                                    <img src={Upload} alt='upload' className='w-[56px] h-[56px]' />
                                                    <label htmlFor="fileInput" className='cursor-pointer px-[22px] flex justify-center items-center'>
                                                        {uploadImageLoading ? 
                                                            <p className='text-[#FFFFFF] text-base font-euclid'>Please wait...</p>
                                                            :
                                                            <p className='text-[#FFFFFF] text-base font-euclid'> 
                                                                <span className='underline text-[#1EC677] font-medium'>Choose File</span> to upload 
                                                            </p>
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
                                className="w-full h-[100vh] mt-1.5 outline-none"     
                            />
                            
                            {errors.description && touched.description ? 
                                <div className='text-RED-_100'>{errors.description}</div> 
                                : null
                            }
                        </div>
                    

                        <button 
                            className= "bg-[#1EC677] mt-5 text-[#fff] rounded-lg p-3 cursor-pointer w-full h-[54px] flex flex-col items-center justify-center"
                            type="submit"
                        >
                            <p className='text-[#fff] text-sm  text-center  font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : 'Update Blog'}</p>
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

export default UpdateBlog;