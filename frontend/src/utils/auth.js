export const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return false;
  }

  return true;
};