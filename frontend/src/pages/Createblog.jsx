import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { checkLogin, fetchCategories, postBlogs, uploadImage } from '../../Api/Api';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginC';
import Spinner from '../components/Spinner'; // Import your spinner component

const Createblog = () => {
    const blankBlog = {
        author: "",
        title: "",
        image: "",
        post: "<p><br></p>",
        category: ""
    }
    
    const details = useContext(LoginContext);
    const [permissions, setPermissions] = useState([]);
    const navigate = useNavigate();
    const [newblog, setNewblog] = useState(blankBlog);
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); // Loader state

    useEffect(() => {
        async function fetchData() {
            setLoading(true); // Start loading
            const fetchedCategories = await fetchCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories.data);
            }
            setLoading(false); // Stop loading
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetch() {
            if (details.login === false) {
                navigate('/login');
            }
            setPermissions(details.cpermissions);
        }
        fetch();
    }, [details, navigate]);

    const handleImage = async (event) => {
        setImage(event.target.files[0]);
    }

    const handleSubmit = async () => {
        if (!image) {
            Swal.fire({ text: "Please Upload An Image", icon: 'warning' });
            return;
        }
        setLoading(true); // Start loading before uploading the image
        let uploadFile = await uploadImage(image);
        setLoading(false); // Stop loading after uploading
        if (uploadFile.path) {
            setNewblog({ ...newblog, image: uploadFile.path });
        } else {
            Swal.fire({ text: "Image Upload Failed", icon: 'warning' });
            return;
        }
        const blogWithAuthor = { ...newblog, author: details.userName, image: uploadFile.path,author_id:details.uid };
        if (!blogWithAuthor.title) {
            Swal.fire({ text: "Please Enter The Title", icon: 'warning' });
            return;
        }
        if (blogWithAuthor.title.length < 5) {
            Swal.fire({ text: "Title must be at least 5 characters long.", icon: 'warning' });
            return;
        }
        if (!blogWithAuthor.category) {
            Swal.fire({ text: "Please Select The Category", icon: 'warning' });
            return;
        }
        if (!blogWithAuthor.post) {
            Swal.fire({ text: "Please Enter Some Content", icon: 'warning' });
            return;
        }
        if (blogWithAuthor.post.length < 25) {
            Swal.fire({ text: "Content must be at least 20 characters long.", icon: 'warning' });
            return;
        }
        
        setLoading(true); // Start loading before posting the blog
        let createdBlog = await postBlogs(blogWithAuthor);
        console.log(createdBlog);
        setLoading(false); // Stop loading after posting
        if (createdBlog.data) {
            setNewblog(blankBlog);
            Swal.fire("New Blog Added Successfully");
            navigate('/');
        }
    }

    const hasPermission = (permissionName) => permissions.includes(permissionName);

    if (loading) {
        return <Spinner />; // Show loader while loading
    }

    if (!hasPermission('Create Blog')) {
        return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>Access Denied</h2>;
    }

    return (
        <div className='flex w-full items-center justify-center'>
            <div className='bg-slate-200 w-[60%] rounded p-5'>
                <h1 className='text-3xl my-3 font-bold mx-5'>Create Blog</h1>
                <div className='flex flex-col'>
                    <label htmlFor="" className='ml-1 text-gray-500'>Title</label>
                    <input type="text" value={newblog.title} onChange={(e) => setNewblog({ ...newblog, title: e.target.value })} className='h-10 border border-gray-300 rounded my-2 p-2' />
                    <label htmlFor="" className='ml-1 text-gray-500'>Category</label>
                    <select name="" value={newblog.category} onChange={(e) => setNewblog({ ...newblog, category: e.target.value })} id="" className='h-10 border border-gray-300 rounded my-2 p-2'>
                        <option value="" default disabled>Select Category</option>
                        {categories.map(x => {
                            return <option key={x.id} value={x.name}>{x.name}</option>
                        })}
                    </select>
                    <label htmlFor="" className='ml-1 text-gray-500'>Image</label>
                    <input type="file" required onChange={(e) => handleImage(e)} className='h-10 border border-gray-300 rounded my-2 p-2' />
                    <label htmlFor="" className='ml-1 text-gray-500 mb-2'>Content</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={newblog.post}
                        className='bg-white rounded mb-2 mt-2 editingarea'
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setNewblog({ ...newblog, post: data });
                        }}
                    />
                    <hr />
                    <button onClick={() => handleSubmit()} className='bg-slate-500 text-white h-8 w-[100px] mt-2 rounded'>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default Createblog;
