import React,{useContext, useEffect,useState} from 'react'
import { checkLogin, deleteComment, getBlogById, getCommentsByBlogId, getUserId, handleCommentSubmit } from '../../Api/Api';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import dateFormat from "dateformat";
import Swal from 'sweetalert2';
import { LoginContext } from '../context/LoginC';
import Spinner from '../components/Spinner';
const Blog = () => {
  const {id} = useParams();
  const [blog,setBlog] = useState(null);
  const [comments,setComments] = useState([]);
  const [newComment,setNewComment] = useState("");
  const [userId,setUserId] = useState(null);
  const details = useContext(LoginContext);
  const [permissions,setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://localhost:3001/";
  useEffect(()=>{
    window.scrollTo(0, 0);
    async function fetchData() {
      const allBlogs = await getBlogById(id);
      setLoading(false);
      setBlog(allBlogs.data);
      const commentsData = await getCommentsByBlogId(id);
      setComments(commentsData.data);
      setUserId(details.uid);
    }
    fetchData();
  },[]);
  useEffect(()=>{
    if(!details.login){
      console.log("You are not logined");
    }
    else{
      setPermissions(details.cpermissions);
    } 
  },[details])

  const handleCommentSubmitFunction = async ()=>{
    if(newComment.trim()===""){
      Swal.fire({
        text : "You can't add an empty comment",
        icon: 'warning'
    });
      return;
    }
    await handleCommentSubmit(id,userId, newComment);
    Swal.fire("Comment Added Successfully");
    setNewComment(''); 
    const commentsData = await getCommentsByBlogId(id);
    setComments(commentsData.data);
  }

  const handleCommentDelete = async (commentId) => {
    const confirmedDelete = Swal.fire({
      text : "Are you sure you want to delete this comment?",
      showCancelButton : true,
      confirmButtonText : "Yes",
      confirmButtonColor: '#d33',
      icon: 'warning'
  });
    if ((await confirmedDelete).isConfirmed) {
      try {
        await deleteComment(commentId, userId,details.roleId);
        Swal.fire("Comment Deleted Successfully");
        const commentsData = await getCommentsByBlogId(id);
        setComments(commentsData.data);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }else return;
  };
  const hasPermission = (permissionName) => permissions.includes(permissionName);
  return (
    <div className='flex justify-center items-center'>
        {loading ? (
          <Spinner />
        ) :(blog && <div className='flex flex-col w-[70%] overflow-hidden '>
            <h1 className='mt-1 text-3xl font-extrabold'>{blog.title}</h1>
            <div className='flex my-4 items-center font-semibold'>
                <small>{dateFormat(blog.createdon,"dddd, mmmm dS, yyyy, h:MM TT")} |&nbsp;</small>
                <small>Author : {blog.author}</small>
            </div>
              <img className='rounded-lg object-scale-down max-w-full max-h-full w-[800px] h-[500px]' src={apiUrl+blog.image} alt="photo_lorem" />
            
            <div className='justify-start mt-5 w-full'>
                <div className='prose w-full max-w-none'>
                {parse(blog.post)}
              </div>
            </div>
            <div className='comments-section mt-10 p-5 border-t-2 border-gray-300 bg-gray-100 rounded-lg shadow-lg'>
              <h2 className='text-2xl font-bold mb-4 text-gray-700'>Comments - </h2>
              {hasPermission('Add Comment')&&(<textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className='w-full p-3 mb-3 border border-gray-300 rounded-lg shadow-md'
              />)}
              {hasPermission('Add Comment')&&(<button onClick={handleCommentSubmitFunction} className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 mb-3'>Add Comment</button>)}
              {comments.length > 0 ? (
              <ul className='space-y-4'>
                {comments.map((comment, i) => (
                  <li key={i} className='p-4 bg-white border border-gray-300 rounded-lg'>
                    <p className='text-sm text-gray-600'>
                      <strong className='text-gray-800'>{comment.user.username}</strong>: {comment.content}
                    </p>
                    <p className='text-xs text-gray-500 mt-2'>{new Date(comment.created_at).toLocaleString()}</p>
                    {(userId == comment.user_id || hasPermission('Delete Any Comment')) && (
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className='mt-2 text-red-500 hover:text-red-700'
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-600'>No comments yet. </p>
            )}
            </div>
        </div>)}
    </div>
  )
}

export default Blog