"use client";
// import styles from ".LoginForm.module.css"
import styles from "./login.module.css";

import Image from "next/image";
const BackgroundImg = "/english_app_background.jpg";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import GoogleButton from "../google-button";
import FacebookButton from "../facebook-button";
import { FaGoogle, FaFacebook } from "react-icons/fa";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "@/lib/Api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { OrbitProgress } from "react-loading-indicators";
import { useGoogleLogin } from "@react-oauth/google";
import OAuthService from "@/lib/services/oauth.service";
import Cookies from "js-cookie";
import { useLocale } from 'next-intl';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const api = useApi();
  const oauthService = new OAuthService;
  const { setTokenInfo } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = Cookies.get("email");
    if (savedEmail) {
      setLoginForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginForm((values) => ({ ...values, [name]: value }));
  };

  const login = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData();
      formData.append("username", loginForm.email);
      formData.append("password", loginForm.password);

      const res = await oauthService.login(
        loginForm.email,
        loginForm.password,
        rememberMe
      );
      await setTokenInfo({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      });
      
      const userData = await oauthService.getUserInfo();
      
      if (userData) {
        if (
          userData &&
          Array.isArray(userData.roles) &&
          userData.roles.some((role:any) => role.name == "Super Administrator")
        ) {
          router.push(`/${locale}/admin/home`);
        } else {
          router.push(`/${locale}/student/dashboard`);
        }

        toast(locale === 'vi' ? 'Đăng nhập thành công' : 'Login successful');
      }
    } catch (err) {
      console.log(err);
      // setErrorMessage(err?.response.data);
      toast("Hệ thống xảy ra vấn đề");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="@container w-full min-h-screen m-0 p-0">
      <div
        style={{
          backgroundImage: `url('${BackgroundImg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen gap-4">
          {/* */}
          <div className="flex flex-col justify-center items-center content-center md:col-span-7 ">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/engventure-logo.svg"
                width={138}
                height={38}
                alt="Logo"
              />
              <h1 className="text-orange-400 font-bold text-4xl">ENGVENTURE</h1>
            </div>
            <h1 className="text-black">
              Chào mừng bạn đến với hệ thống học tập tiếng Anh
            </h1>
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-12 m-auto md:col-span-5 w-full ">
            <div className="page_login__form opacity-90 w-full p-5 mx-4 mt-10 px-6 py-12 bg-white rounded-2xl min-h-96 md:max-w-2/3">
              <h2 className="text-black font-bold text-center">Login</h2>
              <form className="space-y-4 md:space-y-6" onSubmit={login}>
                {/*  Email */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <MdOutlineEmail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className={styles.inputField}
                      placeholder="Nhập email tại đây"
                      value={loginForm.email || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/*  Password */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <MdLockOutline />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="block grow py-1.5 pl-1 pr-3 w-full text-base text-black placeholder:text-gray-400"
                      placeholder="Nhập mật khẩu tại đây"
                      value={loginForm.password || ""}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                      className={styles.passwordToggleBtn}
                    >
                      {showPassword ? <LuEyeClosed /> : <LuEye />}
                    </button>
                  </div>
                </div>
                {/*  Remember password */}
                <div className="flex flex-row mt-10 justify-between">
                  <div className="flex flex-row items-center">
                    <div className="flex items-center justify-center h-5 bg-white">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border border-gray-300 text-white font-bold rounded-sm bg-gray-50 dark:bg-white"
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label className="text-bold text-black text-base">
                        Ghi nhớ mật khẩu
                      </label>
                    </div>
                  </div>
                  <div>
                    {/* <a
                      href="/forgot-password"
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      Quên mật khẩu
                    </a> */}
                    <Link className="text-amber-400" href="/forgot-password">
                      {" "}
                      Quên mật khẩu
                    </Link>
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex flex-row justify-center ">
                      <span>Đang xử lý</span>
                      <OrbitProgress
                        style={{
                          width: "6px",
                          height: "6px",
                          fontSize: "6px",
                          position: "relative",
                          marginLeft: "3px",
                        }}
                        variant="spokes"
                        color="#32cd32"
                        size="small"
                        text=""
                        textColor=""
                      />
                    </div>
                  ) : (
                    <p>Đăng nhập</p>
                  )}
                </button>
                <div className="items-center flex bg-[#a7abc3] justify-center my-5 w-full relative h-0.5">
                  <span className="font-light inline-flex text-gray-600 bg-white left-0 relative px-2.5 top-0">
                    Hoặc
                  </span>
                </div>
                <div className="group_btn_login_social flex flex-row gap-2 items-center justify-center">
                  <GoogleButton>
                    <FaGoogle className="mr-1 text-red-500" /> {"Google"}{" "}
                  </GoogleButton>
                  <FacebookButton>
                    <FaFacebook className="mr-1 text-blue-600" /> {"Facebook"}{" "}
                  </FacebookButton>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Bạn chưa có tài khoản?
                  {/* <a
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a> */}
                  <Link
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Đăng ký
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
