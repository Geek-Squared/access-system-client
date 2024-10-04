import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Auth Context Interface
const AuthContext = createContext<{
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  setToken: () => {},
  logout: () => {},
});

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check token in localStorage on initialization
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Set token function to store token in localStorage and update auth state
  const setToken = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Logout function to remove token from localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
