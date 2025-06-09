// dashboard/src/utils/roleUtils.js

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export const isCraneOperator = () => {
  const user = getCurrentUser();
  return user?.role === "crane_operator";
};

export const isDriver = () => {
  const user = getCurrentUser();
  return user?.role === "driver";
};

export const hasRole = (roles = []) => {
  const user = getCurrentUser();
  return roles.includes(user?.role);
};