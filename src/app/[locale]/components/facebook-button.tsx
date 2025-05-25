"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FC } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const FacebookSignInButton: FC<ButtonProps> = ({ children, ...props }) => {
  const loginWithFacebook = () => {
    console.log("login with loginWithFacebook");
  };

  return (
    <Button
      onClick={loginWithFacebook}
      className="w-full bg-white text-sm font-medium text-black border border-gray-400 shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-white"
      {...props}
    >
      {children}
    </Button>
  );
};

export default FacebookSignInButton;
