import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabaseClient";

type User = {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
  name?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
  }>;

  completeMfaLogin: (user: User, token: string) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// ================= PROVIDER =================
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // ================= LOAD USER =================
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.log(error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = async (
    email: string,
    password: string
  ) => {
    try {
      // 🔥 DATABASE LOGIN
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .match({
          email: email,
          password: password,
        })
        .single();

      if (error || !data) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const loggedInUser: User = {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
      };

      const fakeToken = "supabase-demo-token";

      // SAVE STATE
      setUser(loggedInUser);
      setToken(fakeToken);

      // SAVE STORAGE
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem("token", fakeToken);

      return {
        success: true,
        user: loggedInUser,
        token: fakeToken,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "Server error",
      };
    }
  };

  // ================= COMPLETE LOGIN =================
  const completeMfaLogin = (
    user: User,
    token: string
  ) => {
    setUser(user);
    setToken(token);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem("token", token);
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        completeMfaLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};