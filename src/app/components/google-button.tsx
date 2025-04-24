"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FC } from "react";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<ButtonProps> = ({ children, ...props }) => {
  const loginWithGoogle = () => console.log("login with google");

  return (
    <Button
      onClick={loginWithGoogle}
      className="w-full bg-white text-sm font-medium text-black border border-gray-400 shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-white"
      {...props}
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
