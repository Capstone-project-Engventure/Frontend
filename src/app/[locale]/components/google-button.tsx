"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FC } from "react";
import { useApi } from "@/lib/Api";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<ButtonProps> = ({ children, ...props }) => {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname()
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      console.log("code: res", codeResponse);
      const formData = new FormData();
      formData.append("auth_code", codeResponse.code);
      formData.append("redirect_uri", window.location.origin);
      api
        .post(
          "google/login",
          formData // { auth_code: codeResponse.code },
          // {
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          // }
        )
        .then((data) => {
          console.log("Success: ", data);
          router.push("/student")
        })
        .catch((err) => {
          console.log("Error by login gg: ", err);
        });
    },
    flow: "auth-code",
  });

  return (
    <Button
      type="button"
      onClick={loginWithGoogle}
      className="w-full bg-white text-sm font-medium text-black border border-gray-400 shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-white"
      {...props}
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
