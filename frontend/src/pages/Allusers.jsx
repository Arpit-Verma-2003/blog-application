import React, { useContext, useEffect, useState } from 'react';
import { getUsers, updateUserRole, getRoles, deleteSelectedUser } from '../../Api/Api';
import { LoginContext } from '../context/LoginC';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Spinner from '../components/Spinner';
const Allusers = () => {
        const [users, setUsers] = useState([]);
        const [roles, setRoles] = useState([]);
        const [selectedRoles, setSelectedRoles] = useState({});
        const [loading,setLoading] = useState(true);
        const details = useContext(LoginContext);
        const [permissions,setPermissions] = useState([]);
        const navigate = useNavigate();
        useEffect(() => {
          const fetchData = async () => {
            setLoading(true);
            const usersData = await getUsers();
            const rolesData = await getRoles();
            console.log(usersData);
            setUsers(usersData);
            setRoles(rolesData);
            setLoading(false);
          };
      
          fetchData();
        }, []);
        useEffect(()=>{
          async function fetch() {
            if(details.login === false){
              navigate('/login');
            }
            setPermissions(details.cpermissions);
          }
          fetch();
        },[details,navigate])
      
        const handleRoleChange = (userId, newRoleId) => {
          setSelectedRoles({ ...selectedRoles, [userId]: newRoleId });
        };
      
        const handleUpdateRole = async (userId) => {
          const newRoleId = selectedRoles[userId];
          try {
            await updateUserRole(userId, newRoleId);
            const usersData = await getUsers();
            setUsers(usersData);
            Swal.fire('Role updated successfully!');
          } catch (err) {
            console.error('Error updating role:', err);
            Swal.fire({text:'Failed to update role',
              icon :'warning'
            });
          }
        };
        const handleDeleteUser = async(userId) =>{
          const confirmDelete = Swal.fire({text:"Are you sure you want to delete this user?",
            icon: 'warning',
            showCancelButton : true,
            confirmButtonText : "Yes",
            confirmButtonColor : '#d33'
          })
          if((await confirmDelete).isConfirmed){
            try {
              await deleteSelectedUser(userId);
              const usersData = await getUsers();
              setUsers(usersData);
              Swal.fire('User Deleted Successfully');
            } catch (error) {
              console.log('Error Deleting The User:',error);
            }
          }else{
            return;
          }
          
        }
        const hasPermission = (permissionName) => permissions.includes(permissionName);
    if (!hasPermission('All Users')) {
      return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>Access Denied</h2>;
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          {loading ? ( // Show loading spinner
            <Spinner />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Role</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.role.role_name}</td>
                    <td className="px-6 py-4">
                      <select
                        value={selectedRoles[user.id] || user.role_id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      >
                        {roles.map((role,i) => (
                          <option key={i}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdateRole(user.id)}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700"
                      >
                        Update Role
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700"
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )
}

export default Allusers