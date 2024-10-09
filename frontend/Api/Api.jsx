import axios from "axios";
const apiUrl = "http://localhost:3001" + "/api";
axios.defaults.withCredentials = true;
export const getBlogs = (cat = 'all', page = 1, limit = 9,searchQuery = '') => {
  return axios
    .get(apiUrl + `/blogs/${cat}?page=${page}&limit=${limit}&search=${searchQuery}`)
    .then(result => result.data)
    .catch(err => err);
};

const handleLogin = async () => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token); // Store token in local storage
    // Redirect or update state as necessary
  } else {
    // Handle login error
    const errorData = await response.json(); // Retrieve the error message
    alert(errorData.message || 'Login failed');
  }
};

export const checkLogin = () => {
  return axios
    .get(apiUrl + "/checklogin")
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
};

export const getUsers = async () => {
  const response = await axios.get(apiUrl+'/users');
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get(apiUrl+'/roles');
  return response.data;
};

export const addCategory = async (categoryName) => {
  try {
    const response = await axios.post(apiUrl + '/categories', { name: categoryName });
    return response.data;
  } catch (error) {
    console.error('Error adding category', error);
    return { success: false };
  }
};

export const updateUserRole = async (userId, newRoleId) => {
  await axios.put(`${apiUrl}/users/${userId}`, { newRoleId });
};

export const deleteSelectedUser = async(userId)=>{
  await axios.delete(`${apiUrl}/users/${userId}`);
}

export const deleteCategory = async (categoryName) =>{
  try {
    const result = await axios.delete(`${apiUrl}/categories/${categoryName}`);
    return result.data;
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const fetchCategories = async()=>{
  try {
    const response = await axios.get(apiUrl+'/categories');
  return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const createRole = async (newRole) => {
  try {
    const response = await axios.post(apiUrl+ '/roles', newRole);
    return response.data;
  } catch (err) {
    console.error('Error creating role:', err);
    throw err; 
  }
};

export const getPermissions = async ()=>{
  try {
    return await axios.get(apiUrl+'/permissions')
    .then(result=>{
      return result.data;
    })
  } catch (err) {
    console.error('Error fetching permissions:', err);
  }
}

export const getPermissionsByRole = async (roleId) => {
  try {
    const result = await axios.post(`${apiUrl}/permissions`, { roleId });
    return result.data;
  } catch (err) {
    console.error('Error fetching permissions:', err);
    throw err; 
  }
};

export const checkAdmin = () =>{
  return axios.get(apiUrl+"/checkAdmin")
  .then(result=>{
    return result.data;
  })
  .catch(err=>{
    return err;
  })
}

export const handleCommentSubmit = async (blogId, userId, content) => {
  try {
    const response = await axios.post(apiUrl+'/comments', {
      blog_id: blogId,
      user_id: userId,
      content: content
    });
    return response;
  } catch (error) {
    console.error("Error submitting comment:", error);
    throw error;
  }
};

export const getUserId = async()=>{
  try {
    const response = await axios.get(apiUrl+'/userId')
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteComment = async (commentId, userId,roleId) => {
  try {
    const response = await axios.delete(`${apiUrl}/comments/${commentId}`, {
      data: { user_id: userId,
        comment_id:commentId,
        role_id:roleId
       }
    });
    return response;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const getCommentsByBlogId = async(blogId)=>{
  try {
    const response = await axios.get(apiUrl+`/comments/${blogId}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteBlog = async (blogId) => {
  try {
    const response = await axios.delete(`${apiUrl}/blogs/${blogId}`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting blog', error);
    return { valid: false };
  }
};

export const getBlogsByAuthor = (search = '',uid) => {
  return axios
    .get(apiUrl + `/author/blogs?search=${search}&uid=${uid}`)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
};

export const postBlogs = (data) => {
  return axios
    .post(apiUrl + "/blogs", data)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateBlog = (id,data) =>{
  return axios
  .put(`${apiUrl}/blogs/${id}`,data)
  .then((result)=>{
    return result.data;
  })
  .catch((err)=>{
    return err;
  })
}

export const getBlogById = (id) => {
  return axios
    .get(apiUrl + "/blogsbyid/"+id)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
};

export const uploadImage = (file)=>{
  const formdata = new FormData();
  formdata.append('file',file);
  const config = {
    headers:{
      'content-type':'multipart/form-data'
    }
  }
  return axios
    .post(apiUrl + "/blogsimage", formdata,config)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return err;
    }); 
}
