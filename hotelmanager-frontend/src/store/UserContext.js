import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  user: {
    userId: "",
    userName: "",
    fullName: "",
    status: 1,
    role: 0,
    auth: false,
  },
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: "",
    userName: "",
    fullName: "",
    status: 1,
    role: 0,
    auth: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, auth: true });
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const loginContext = (token, userInfo) => {
    console.log("loginContext", token, userInfo);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser({ ...userInfo, auth: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({
      userId: "",
      userName: "",
      fullName: "",
      status: 1,
      role: 0,
      auth: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};
