"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from "./components/login-form";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/Api";
import { useRouter } from "next/navigation";

export default function Home() {
  const {tokenInfo} = useAuth();
  const router = useRouter();
  useEffect(()=>{
    console.log("tokenInfo: ", tokenInfo);
    
    if(tokenInfo?.accessToken){
      router.push("/student/user-profile")
    }
  },[tokenInfo,]) 
  return (
    <LoginForm />
  );
}
