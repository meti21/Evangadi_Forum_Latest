import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../../Utility/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize with token from localStorage immediately
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("authToken");
    return {
      token: token || null,
      user: null,
    };
  });

  const isAuthenticated = !!auth.token;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      // Get token directly from localStorage instead of state
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/api/users/check"); 

        if (res.data) {
          setAuth({
            token,
            user: res.data
          });
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        setAuth({ token: null, user: null });
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Prevent browser back button from going beyond home page when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const handlePopState = (e) => {
        // If user is on home page and tries to go back, prevent it
        if (window.location.pathname === '/home') {
          window.history.pushState(null, null, window.location.href);
        }
      };

      // Push a new state to prevent going back
      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      const token = res.data.token;

      if (!token) throw new Error("No token received");

      localStorage.setItem("authToken", token);

      const userRes = await axiosInstance.get("/api/users/check");
      const user = userRes.data;

      localStorage.setItem("userid", user.userid); 
      localStorage.setItem("username", user.username);

      setAuth({ token, user});
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (username, firstname, lastname, email, password) => {
    try {
      await axiosInstance.post("/api/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      return await login(email, password);
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userid");
    localStorage.removeItem("username");

    setAuth({ token: null, user: null });
  };

  const updateUser = (updatedUserData) => {
    setAuth(prev => ({
      ...prev,
      user: { ...prev.user, ...updatedUserData }
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};