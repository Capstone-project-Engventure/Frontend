import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from "@/app/components/login-form";
import { AuthProvider } from "@/lib/context/AuthContext";
export default function AdminLogin() {
  return (
    <LoginForm />
  );
}
