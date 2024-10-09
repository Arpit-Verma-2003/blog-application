import React, { useContext, useEffect, useState } from 'react'
import { createRole, getPermissions } from '../../Api/Api'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginC';
import Swal from 'sweetalert2';
const Createrole = () => {
    const [permissions, setPermissions] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const details = useContext(LoginContext);
    const [userpermissions,setUserPermissions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPermissions = async ()=>{
            const permissions_data = await getPermissions();
            setPermissions(permissions_data);
        }
        fetchPermissions();
      }, [])
      useEffect(()=>{
        async function fetch() {
          if(details.login === false){
            navigate('/login');
          }
          setUserPermissions(details.cpermissions);
        }
        fetch();
      },[details,navigate])

      const handlePermissionChange = (permissionId) => {
        if (selectedPermissions.includes(permissionId)) {
          setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
        } else {
          setSelectedPermissions([...selectedPermissions, permissionId]);
        }
      };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const newRole = {
            roleName,
            permissionIds : selectedPermissions
        };
        try {
            await createRole(newRole);
            Swal.fire('Role created successfully!');
            setRoleName('');
            setSelectedPermissions([]);
          } catch (err) {
            console.error('Error creating role:', err);
            Swal.fire({text:err,
              icon: 'warning'
            });
          }
    }
    const hasPermission = (permissionName) => userpermissions.includes(permissionName);
    if (!hasPermission('Add Role')) {
        return <h2 className='text-2xl font-bold text-center text-gray-800 my-5 bg-red-100 rounded-lg shadow-lg py-3 px-6'>Access Denied</h2>;
    }
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Create New Role</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                Role Name:
              </label>
              <input
                id="roleName"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <h4 className="mb-2">Select Permissions:</h4>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      value={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`permission-${permission.id}`}
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {permission.permission_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Role
              </button>
            </div>
          </form>
        </div>
      );
    };
    
    export default Createrole;