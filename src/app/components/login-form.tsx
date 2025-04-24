"use client";
import Image from "next/image";
const BackgroundImg = "/english_app_background.jpg";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
// import { LuEye, LuEyeClosed } from "react-icons/lu";
import GoogleButton from "./google-button";
import FacebookButton from "./facebook-button";
import { FaGoogle, FaFacebook } from "react-icons/fa";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useApi } from "@/lib/Api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const api = useApi();
  const { setTokenInfo } = useAuth();
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginForm((values) => ({ ...values, [name]: value }));
  };
  const login = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Form submitted:", loginForm);
      const formData = new FormData()
      formData.append("username", loginForm.email)
      formData.append("password", loginForm.password)
      const res = await api.post("/users/login",formData);
      if (res.status == 200) {
        const { access_token, refresh_token } = res.data;
        if (access_token && refresh_token) {
          setTokenInfo({ accessToken:access_token, refreshToken:refresh_token });
        }
        router.push("/my-course");
        // const data = await res.json();

        // setAccessToken(data.access_token);
        // setScopes(data.scopes);
        // setUsername(data.username);
        console.log("res:", res);
      } else {
        console.log("Something went wrong");
        // const err = await res.json();
        // setErrorMessage("Incorrect username or password.");
        toast(errorMessage);
        toast("Incorrect username or password.");
      }
    } catch (err) {
      console.log(err);
      // setErrorMessage(err?.response.data);
      toast("System is error");
      // toast("Incorrect username or password.");
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
        <div className="grid grid-cols-1 sm:grid-cols-12 min-h-screen gap-4">
          {/* */}
          <div className="flex flex-col justify-center items-center content-center sm:col-span-7 ">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/engventure-logo.svg"
                width={138}
                height={38}
                alt="Logo"
              />
              <p className="text-orange-400 font-bold text-5xl">ENGVENTURE</p>
            </div>
            <h1 className="text-black">
              Chào mừng bạn đến với hệ thống học tập tiếng Anh
            </h1>
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-12 m-auto sm:col-span-5 w-full ">
            <div className="page_login__form opacity-90 w-full p-5 mx-4 mt-10 px-6 py-12  bg-white rounded-2xl min-h-96">
              <h2 className="text-black font-bold text-center">Login</h2>
              <form className="space-y-4 md:space-y-6" onSubmit={login}>
                {/*  Email */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">Email</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập email tại đây"
                        value={loginForm.email || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/*  Password */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">
                    Mật khẩu
                  </label>
                  <div className="mt-2">
                    <div className="flex flex-row items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdLockOutline />
                      </div>
                      <input
                        type="password"
                        name="password"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập mật khẩu tại đây"
                        value={loginForm.password || ""}
                        onChange={handleChange}
                      />
                      {/* <div className="left-auto text-base text-gray-500">
                        <LuEyeClosed />
                      </div> */}
                    </div>
                  </div>
                </div>
                {/*  Remember password */}
                <div className="flex flex-row mt-10 justify-between">
                  <div className="flex flex-row">
                    <div className="flex items-center justify-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 text-white font-bold rounded bg-gray-50"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-400 text-base">
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
                    <Link href="/forgot-password"> Quên mật khẩu</Link>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Đăng nhập
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
                  Bạn chưa có tài khoản?{" "}
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
