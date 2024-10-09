import { createContext, useEffect, useState } from "react";
import { checkLogin, getPermissionsByRole } from "../../Api/Api";
export const LoginContext = createContext(null);
export const LoginProvider = (props) => {
  const [login, setLogin] = useState(null);
  const [cpermissions, setCPermissions] = useState([]);
  const [uid, setUid] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [userName, setUserName] = useState("");
  const fetchLoginData = async () => {
    try {
      const response = await checkLogin();
      if (response?.loggedIn) {
        setLogin(true);
        const permissionsRole = await getPermissionsByRole(response.user.role_id);
        console.log("done changes");
        setCPermissions(permissionsRole.permissions);
        setUid(response.user?.id || null);
        setRoleId(response.user?.role_id || null);
        setUserName(response.user?.username || "");
      } else {
        setLogin(false);
        console.log("done negative changes");
        setCPermissions([]);
        setUid(null);
        setRoleId(null);
        setUserName("");
      }
    } catch (error) {
      console.error("Error fetching login data:", error);
      setLogin(false);
    }
  };
  useEffect(() => {
    fetchLoginData();
  }, [login]);
  return (
    <LoginContext.Provider
      value={{
        login,
        setLogin,
        cpermissions,
        setCPermissions,
        uid,
        setUid,
        roleId,
        setRoleId,
        userName,
        setUserName,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};
