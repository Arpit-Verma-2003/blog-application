import React, { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadImage, getBlogById, fetchCategories,checkLogin, updateBlog } from '../../Api/Api'
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../context/LoginC';
import Spinner from '../components/Spinner';

const Editblog = () => {
    const blankBlog = {
        "author" : "",
        "title" : "",
        "image" : "",
        "post" : "<p><br></p>",
        "category" : ""
    }
    const details = useContext(LoginContext);
    const [permissions,setPermissions] = useState([]);
    const [blogData,setBlogData] = useState(blankBlog);
    const [image, setImage] = useState(null);
    const [authorId,setAuthorId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); 
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            const fetchedCategories = await fetchCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories.data);
            }
            const blog = await getBlogById(id); 
            const blogPrevData = blog.data;
            if (blogPrevData) {
                setBlogData({
                    title: blogPrevData.title,
                    image: blogPrevData.image,
                    post: blogPrevData.post,
                    category: blogPrevData.category,
                });
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);
    useEffect(()=>{
        async function fetch() {
          if(details.login === false){
            navigate('/login');
          }
          setAuthorId(details.uid);
          setPermissions(details.cpermissions);
        }
        fetch();
      },[details,navigate])
    const handleImage = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!blogData.title) {
            Swal.fire({
                text:"Please Enter The Title",
                icon: 'warning'
            });
            return;
        }
        if (blogData.title.length < 5) {
            Swal.fire({ text: "Title must be at least 5 characters long.",
                icon: 'warning'
            });
            return;
        }
        if (!blogData.category) {
            Swal.fire({ text: "Please Select The Category",
                icon: 'warning'
            });
            return;
        }
        if (blogData.post === '<p><br></p>') {
            Swal.fire({ text: "Please Enter Some Content",
                icon: 'warning'
            });
            return;
        }
        if (blogData.post.length < 25) {
            Swal.fire({text:"Content must be at least 20 characters long.",
                icon:'warning'
            });
            return;
        }

        let imagePath = blogData.image;
        if (image) {
            const uploadFile = await uploadImage(image);
            if (uploadFile.path) {
                imagePath = uploadFile.path;
            } else {
                Swal.fire({text:'Image Upload Failed',
                    icon:'error'
                });
                return;
            }
        }

        const updatedBlog = {
            ...blogData,
            image: imagePath
        };
        const result = await updateBlog(id, updatedBlog);
        if (result.success) {
            Swal.fire('Blog Updated Successfully');
            navigate(`/blog/${id}`);
        } else {
            Swal.fire({text:'Failed to Update Blog',
                icon: 'error'
            });
        }
    };
    const hasPermission = (permissionName) => permissions.includes(permissionName);
    if (!hasPermission('Edit Blog')) {
        return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>Access Denied</h2>;
    }
    if (loading) {
        return <Spinner/>;
    }
    return (
    <div className='flex w-full items-center justify-center'>
        <div className='bg-slate-200 w-[60%] rounded p-5'>
            <h1 className='text-3xl my-3 font-bold '>Edit Blog</h1>
            <div className='flex flex-col'>
                <label htmlFor="" className='ml-1 text-gray-500'>Title</label>
                <input type="text" value={blogData.title} onChange={(e)=>setBlogData({...blogData,title:e.target.value})} className='h-10 border border-gray-300 rounded my-2 p-2'/>
                <label htmlFor="" className='ml-1 text-gray-500'>Category</label>
                <select name="" value={blogData.category} onChange={(e)=>setBlogData({...blogData,category:e.target.value})} className='h-10 border border-gray-300 rounded my-2 p-2' id="">
                    <option value="" default disabled>Select Category</option>
                    {categories.map(x=>{
                        return <option key={x.id} value={x.name}>{x.name}</option>
                    })}
                </select>
                <label htmlFor="" className='ml-1 text-gray-500'>Image (Leave Empty For No Change)</label>
                <input type="file" required onChange={(e)=>handleImage(e)} className='h-10 border border-gray-300 rounded my-2 p-2'/>
                <label htmlFor="" className='ml-1 text-gray-500 mb-2'>Content</label>
                <CKEditor
                        editor={ClassicEditor}
                        data={blogData.post}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setBlogData({ ...blogData, post: data });
                        }}
                    />
                <hr />
                <button  onClick={()=>handleSubmit()} className='bg-slate-500 text-white h-8 w-[100px] mt-2 rounded'>Submit</button>
            </div>
        </div>
    </div>
  )
}

export default Editblog
