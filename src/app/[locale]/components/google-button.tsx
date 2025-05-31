"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import { FC } from "react";
import { useApi } from "@/lib/Api";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "react-toastify";
import { useLocale } from "next-intl";
import OAuthService from "@/lib/services/oauth.service";
import { saveTokenCookies } from "@/lib/utils/jwt";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GoogleSignInButton: FC<ButtonProps> = ({ children, ...props }) => {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const { setTokenInfo } = useAuth();
  const oauthService = new OAuthService();
  const locale = useLocale();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      console.log("Google Auth Code Response:", codeResponse);

      try {
        const formData = new FormData();
        formData.append("auth_code", codeResponse.code);
        formData.append("redirect_uri", window.location.origin);

        const response = await api.post("google/login", formData);

        const { data, status } = response;
        if (status === 200) {
          const accessToken = data?.access_token;
          const refreshToken = data?.refresh_token;

          if (accessToken && refreshToken) {
            // Save tokens in context
            setTokenInfo({
              accessToken,
              refreshToken,
            });

            // Optional: save in cookies
            saveTokenCookies(accessToken, refreshToken, false, "");

            router.push(`/${locale}/student`);
            toast.info(
              locale === "vi" ? "Đăng nhập thành công" : "Login successful"
            );
          } else {
            throw new Error("Missing tokens in response");
          }
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (err) {
        console.error("Error during Google login:", err);
        toast.error(
          locale === "vi" ? "Đăng nhập thất bại" : "Login unsuccessful"
        );
      }
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
