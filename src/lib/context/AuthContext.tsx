"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  scope?: string[];
  role?: string;
}
interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  // nbf?: number;
  scope: string[] | string;
}

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
};


// username: string | null;
interface AuthContextProps {
  tokenInfo: TokenInfo | null;
  setTokenInfo: (info: TokenInfo) => void;
  reset: () => void;
  user:User|null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenInfo, setTokenInfoState] = useState<TokenInfo | null>(null);
  const [user, setUser] = useState<User|null>(null)
  const setTokenInfo = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    // if (!accessToken) return;
    const decoded = jwtDecode(accessToken);
    // const { sub, iat, exp, nbf, scope } = jwtDecode(accessToken);
    // console.log("decoded: ", decoded);
    
    const scopes = Array.isArray(decoded.scope)
      ? decoded.scope
      : decoded.scope?.split(" ") || [];
      console.log("scopes",scopes);
    let role = "user";
    if (scopes.includes("admin")) {
      role = "admin";
    }
    const tokenInfo: TokenInfo = {
      accessToken,
      refreshToken,
      scope: scopes,
      role: role,
    };

    console.log("token info:", tokenInfo);
    
    // const cookieOptions = "path=/; secure; samesite=lax; max-age=2592000";
    // document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
    // document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  

    setTokenInfoState(tokenInfo);

  };
  const reset = () => {
    setTokenInfoState(null);
    setUser(null);
  
    // Remove cookies by setting empty value and expired date
    // document.cookie = "accessToken=; path=/;";
    // document.cookie = "refreshToken=; path=/;";

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // useLayoutEffect(() => {
  //   const fetchMe = async () => {
  //     try {
  //       const res = await axios.get(`${baseURL}/users/me`, {
  //         withCredentials: true,
  //       });
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log("User not authenticated");
  //       reset();
  //     }
  //   };
  //   fetchMe();
  // }, []);
  

  return (
    <AuthContext.Provider value={{ tokenInfo, setTokenInfo, reset , user}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
