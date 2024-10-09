import React, { useContext, useEffect, useState } from 'react'
import { checkLogin } from '../../Api/Api';
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginC';
import Spinner from '../components/Spinner';
const Profile = () => {
    const loginVar = useContext(LoginContext);
    const [name,setName] = useState("");
    const [userRole,setUserRole] = useState("");
    const [content,setContent] = useState("");
    const [permissions,setPermissions] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
          setLoading(true);
          if (!loginVar.login) {
            setName("Guest");
            setUserRole("Viewer");
            setContent("Hence, You can only View blogs and don't have other permissions");
          } else {
            setPermissions(loginVar.cpermissions);
            setName(loginVar.userName);
            if(loginVar.roleId==1){
                setUserRole("Admin");
                setContent("Hence, You have all the permissions in this website");
            }else if(loginVar.roleId==2){
                setUserRole("Author");
                setContent("Hence, You can Access, Create or Delete your own Blogs");
            }else{
                setUserRole("Viewer");
                setContent("Hence, You can only View blogs and don't have other permissions");
            }
          }
          setLoading(false);
        };
    
        fetchData();
      }, [loginVar]);
      const hasPermission = (permissionName) => permissions.includes(permissionName);
  if (loading) { 
    return <Spinner />;
  }
  if(loginVar === null){
    return <div>Loading...</div>
  }
  if(loginVar.login === false){
    return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>You Are Not Logged In</h2>;
  }
  return (
    <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-b from-gray-100 to-red-100">
        <div className='bg-white shadow-lg rounded-lg p-8 max-w-lg w-full border border-gray-200'>
            <h1 className='text-3xl font-semibold text-red-600 mb-5 border-b pb-4'>Your Profile - </h1>
            <h2 className='text-xl font-medium text-gray-700 mb-4'>Hello, <span className="font-bold text-gray-900">{name}</span> , We Hope You Are Enjoying Using Our Website</h2>
            <h3 className='text-lg text-gray-600 mb-2'>Your current role is: <span className="font-bold text-indigo-500">{userRole}</span></h3>
            <h4 className='text-md text-gray-500 mb-2'>{content}</h4>
            <h3 className='text-lg text-gray-700 mb-2'>You have the following options : </h3>
            {hasPermission('Create Blog')&&(<Link to={'/create'}><button className='bg-green-600 text-white text-lg px-6 py-2 rounded mr-3 my-2'>Add Blog</button> </Link>)}
             {hasPermission('View My Blogs')&&(<Link to={'/myblogs'}><button className='bg-blue-600 text-white text-lg px-6 py-2 rounded p-1 mr-3 my-2'>My Blogs</button> </Link>)}
             {hasPermission('Admin Panel')&&(<Link to={'/adminpanel'}><button className='bg-blue-600 text-white rounded px-6 py-2 mr-3 my-2'>Admin Panel</button> </Link>)}
        </div>
    </div>
  )
}

export default Profile