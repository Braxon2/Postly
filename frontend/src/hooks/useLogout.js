import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
export const useLogout = () => {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return { logout };
};
