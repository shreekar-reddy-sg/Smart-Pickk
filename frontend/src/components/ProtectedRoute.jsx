import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  console.log("ProtectedRoute running");

  if (!isAuthenticated()) {
    console.log("NOT AUTHENTICATED");
    return <Navigate to="/" replace/>;
  }

  console.log("AUTHENTICATED");
  return children;
};

export default ProtectedRoute;