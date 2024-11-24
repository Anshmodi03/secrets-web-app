import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Logout() {
  const { handleLogout } = useContext(GlobalContext);
  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <Navigate to="/login" />;
}
