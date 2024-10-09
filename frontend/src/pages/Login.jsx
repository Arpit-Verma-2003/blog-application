import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginC';
import { getPermissionsByRole } from '../../Api/Api';
const apiUrl = "http://localhost:3001";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const loginVar = useContext(LoginContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiUrl}/api/login`, formData);
      Swal.fire("Login Successful");
      setSuccess("Login Successful Redirecting To Home Page");
      loginVar.setLogin(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="font-bold text-xl mb-4">Login</h2>
      {success && <p className="text-blue-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="border rounded px-3 py-2 w-full"
            onChange={handleChange}
            required
            value={formData.email}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border rounded px-3 py-2 w-full"
            onChange={handleChange}
            required
            value={formData.password}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
