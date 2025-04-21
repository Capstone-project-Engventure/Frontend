"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from "./components/login-form";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/Api";
import { useRouter } from "next/navigation";

export default function Home() {
  const {tokenInfo} = useAuth();
  const router = useRouter()
  // const [isAuthenticated,setIsAuthenticated]= useState(false);
  useEffect(()=>{
    if(tokenInfo && tokenInfo.accessToken){
      // setIsAuthenticated(true);
      router.push("/student/user-profile")
    }
  },[]) 
  return (
    <LoginForm />
  );
}
