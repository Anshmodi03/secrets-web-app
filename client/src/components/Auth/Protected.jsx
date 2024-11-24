import { useContext } from "react";
import { GlobalContext } from "../../context";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const { isLoggedIn } = useContext(GlobalContext);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
}
