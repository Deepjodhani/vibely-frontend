import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import axios from "../api/axios";
import { loginUser, registerUser } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =================================================
     RESTORE AUTH ON PAGE REFRESH
  ================================================= */
  useEffect(() => {
    const restoreAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);

          axios.defaults.headers.common.Authorization =
            `Bearer ${token}`;

          setUser(parsedUser);
        }
      } catch (err) {
        // corrupted storage → reset only auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common.Authorization;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  /* =================================================
     LOGIN
  ================================================= */
  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      axios.defaults.headers.common.Authorization =
        `Bearer ${data.token}`;

      setUser(data.user);
      return true;
    } catch (error) {
      throw (
        error?.response?.data || {
          message: "Login failed"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  /* =================================================
     REGISTER (NO AUTO LOGIN)
  ================================================= */
  const register = async (payload) => {
    setLoading(true);
    try {
      await registerUser(payload);
      return true;
    } catch (error) {
      throw (
        error?.response?.data || {
          message: "Registration failed"
        }
      );
    } finally {
      setLoading(false);
    }
  };

  /* =================================================
     LOGOUT
  ================================================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
  };

  /* =================================================
     UPDATE USER (for profile updates)
  ================================================= */
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  /* =================================================
     MEMOIZED CONTEXT VALUE
  ================================================= */
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateUser
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* =================================================
   CUSTOM HOOK
================================================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }
  return context;
};
