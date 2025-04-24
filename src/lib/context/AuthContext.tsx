"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useLayoutEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { log } from "console";
interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  scope: string[];
  role: string;
}
interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  // nbf?: number;
  scope: string[] | string;
}
// username: string | null;
interface AuthContextProps {
  tokenInfo: TokenInfo | null;
  setTokenInfo: (info: TokenInfo) => void;
  reset: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenInfo, setTokenInfoState] = useState<TokenInfo | null>(null);

  const setTokenInfo = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    // if (!accessToken) return;
    const decoded = jwtDecode(accessToken);
    console.log("decoded",decoded);
    const { sub, iat, exp, nbf, scope } = jwtDecode(accessToken);
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

    setTokenInfoState(tokenInfo);
  };
  const reset = () => {
    setTokenInfoState(null);
  };
  return (
    <AuthContext.Provider value={{ tokenInfo, setTokenInfo, reset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
