import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import { checkLogin, fetchCategories } from "../../Api/Api";
import axios from "axios";
import { LoginContext } from "../context/LoginC";
import Spinner from "../components/Spinner";

const apiUrl = "http://localhost:3001";
const Layout = () => {
  const loginVar = useContext(LoginContext);
  const [checkLoginAccess, setCheckLoginAccess] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (loginVar.login === true) setCheckLoginAccess(true);
      setPermissions(loginVar.cpermissions);
      const fetchedCategories = await fetchCategories();
      if (fetchedCategories) {
        setCategories(fetchedCategories.data);
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate, loginVar]);
  const handleLogout = async () => {
    const confirmLogout = Swal.fire({
      text: "Are you sure you want to logout",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#d33",
    });
    if ((await confirmLogout).isConfirmed) {
      try {
        const response = await axios.post(
          `${apiUrl}/api/logout`,
          {},
          { withCredentials: true }
        );
        if (response.status === 200) {
          Swal.fire("Logout Successful");
          console.log("Logout successful");
          loginVar.setLogin(false);
          setCheckLoginAccess(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  };
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate(`/?category=${categoryName}`);
  };
  const handleResetCategory = () => {
    setSelectedCategory(""); // Reset the selected category
    navigate("/"); // Navigate to the homepage
  };
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);
  return (
    <>
      {/* header */}
      <div className="border-b p-5">
        <div className="container flex pb-5 justify-between">
          <span
            className="font-extrabold text-2xl cursor-pointer"
            onClick={handleResetCategory}
          >
            BlogPost
          </span>
          <div className="flex">
            <ul className="flex">
              {categories.map((x, i) => {
                return (
                  <li
                    key={i}
                    className={`p-2 cursor-pointer ${
                      selectedCategory === x.name
                        ? "bg-blue-500 rounded text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <span onClick={() => handleCategoryClick(x.name)}>
                      {x.name}
                    </span>
                  </li>
                );
              })}
            </ul>
            {!checkLoginAccess && (
              <Link to={"/login"}>
                <button className="bg-blue-600 text-white rounded p-1 mr-3 ml-3">
                  Login
                </button>
              </Link>
            )}
            {checkLoginAccess && (
              <Link to={"/profile"}>
                <img
                  src="/profile-circle-icon-2048x2048-cqe5466q.png"
                  alt="Profile"
                  className="w-[35px] p-1 mr-3"
                />
              </Link>
            )}
            {checkLoginAccess && (
              <Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white rounded p-1"
                >
                  Logout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* body */}
      <div className="flex mx-auto justify-center">
        <div className="my-5 min-h-[500px] w-[1280px]">
          {loading ? <Spinner /> : <Outlet />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
