import React, { useContext, useEffect, useState } from 'react'
import Blogcard from '../components/Blogcard'
import Swal from 'sweetalert2';
import { deleteBlog, getBlogsByAuthor } from '../../Api/Api';
import {useNavigate } from 'react-router-dom'
import { LoginContext } from '../context/LoginC';
import Spinner from '../components/Spinner';
const Myblogs = () => {
    const navigate = useNavigate();
    const loginVar = useContext(LoginContext);
    const [permissions,setPermissions] = useState([]);
    const [blogs,setBlogs] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const handleDelete = async (blogId) => {
        const confirmDelete = await Swal.fire({
          text:"Are you sure you want to delete this blog?",
          confirmButtonText: 'Yes',
          showCancelButton: true,
          confirmButtonColor: '#d33'
        });
        if (confirmDelete.isConfirmed) {
          const response = await deleteBlog(blogId);
          if (response.valid) {
            setBlogs(blogs.filter(blog => blog.id !== blogId));
            Swal.fire("Blog deleted successfully");
          } else {
            Swal.fire("Failed to delete blog");
          }
        }
    };
    const handleEdit = async(blogId) =>{
      const confirmEdit = await Swal.fire({
        text:"Are you sure you want to edit this blog?",
        confirmButtonText: 'Yes',
        showCancelButton: true
      });
      if(confirmEdit.isConfirmed) navigate(`/editblog/${blogId}`);
    }
    useEffect(()=>{
      async function fetch() {
        if(loginVar.login === false){
          navigate('/login');
        }
        setPermissions(loginVar.cpermissions);
      }
      fetch();
    },[loginVar,navigate])
    useEffect(()=>{
        async function fetchData() {
          setLoading(true);
          const allBlogs = await getBlogsByAuthor(searchQuery,loginVar.uid);
          setLoading(false);
          if(!allBlogs.valid){
            navigate('/login');
          }
          setBlogs(allBlogs.data);
        }
        fetchData();
      },[searchQuery]);
  if(loginVar === null){
        return <Spinner/>
      }
      const hasPermission = (permissionName) => permissions.includes(permissionName);
      if (!hasPermission('View My Blogs')) {
          return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>Access Denied</h2>;
      }
  return (
    <>
      <div className='mb-4'>
            <input
                type='text' placeholder='Search your blogs...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
            />
        </div>
      {loading ? (
        <Spinner />
      ) :(<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {blogs &&  blogs.length > 0 ? ( blogs.map((x,i)=>{
            return <Blogcard key={i} blogData = {x} handleDelete={handleDelete} handleEdit={handleEdit}
            showDelete={true} showEdit={true}/>
          })) :(
            <p>No Blogs Found :(</p>
          )}
      </div>)}
    </>
  )
}

export default Myblogs