"use client";
import Image from "next/image";
const BackgroundImg = "/english_app_background.jpg";
import {
  MdOutlineEmail,
  MdLockOutline,
  MdOutlinePhoneInTalk,
} from "react-icons/md";

import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { FaEarthAmericas } from "react-icons/fa6";
import { useApi } from "@/lib/Api";
import { GenderOptions, GenderEnum } from "@/lib/constants/gender";
import { NationOptions, NationEnum } from "@/lib/constants/nation";
import { useState } from "react";
import GenderSelect from "../components/GenderSelect";
import NationSelect from "../components/NationSelector";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import {getTranslations} from 'next-intl';

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: GenderEnum;
  nation: NationEnum;
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

export default function Register() {
  const api = useApi();
  const router = useRouter();
  // const t = getTranslations('Register');
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: GenderEnum.MALE,
    nation: NationEnum.VN,
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setRegisterForm((values) => ({ ...values, [name]: value }));
  };

  const handleGenderChange = (value: GenderEnum) => {
    setRegisterForm((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleNationChange = (value: NationEnum) => {
    setRegisterForm((prev) => ({
      ...prev,
      nation: value,
    }));
  };

  const register = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Form submitted:", registerForm);
      const formData = new FormData();
      formData.append("first_name", registerForm.first_name);
      formData.append("last_name", registerForm.last_name);
      formData.append("email", registerForm.email);
      formData.append("password", registerForm.password);
      const res = await api.post("/users/register", formData);

      if (res) {
        console.log("res:", res);
        toast("Register successfully. Please sign in");
        router.push('/')
      } else {
        console.log("Something went wrong");
        // const err = await res.json();
        // setErrorMessage("Incorrect username or password.");
        // toast(errorMessage);
        toast("Something went wrong");
      }
    } catch (err) {
      // console.log(err?.response.data);
      // setErrorMessage(err?.response.data);
      // toast(errorMessage);
      // toast("Incorrect username or password.");
      toast("Something went wrong");
      console.log("err", err);
    }
  };

  return (
    <div className="w-full min-h-screen">
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
              <h2 className="text-black font-bold text-center">Đăng ký</h2>
              <form className="space-y-4 md:space-y-6" onSubmit={register}>
                {/* Tên */}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm text-gray-900 mb-1">
                      First name
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r pr-2 select-none">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập tên tại đây"
                        value={registerForm.first_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm text-gray-900 mb-1">
                      Last name
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <input
                        type="text"
                        name="last_name"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập họ tại đây"
                        value={registerForm.last_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

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
                        onChange={handleChange}
                        value={registerForm.email || ""}
                      />
                    </div>
                  </div>
                </div>

                {/*  Phone */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">Phone</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlinePhoneInTalk />
                      </div>
                      <input
                        type="number"
                        name="phone"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập phone tại đây"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/*  Double Gender and Nation */}
                <div className="gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/*  Giới tính */}
                    <div>
                      <label className="block text-sm text-gray-900">
                        Giới tính
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                          <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                            <RiFileUserFill />
                          </div>
                          <GenderSelect
                            className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                            value={registerForm.gender}
                            onChange={handleGenderChange}
                          />
                        </div>
                      </div>
                    </div>
                    {/*  Nation */}
                    <div>
                      <label className="block text-sm text-gray-900">
                        Quốc gia
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                          <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                            <FaEarthAmericas />
                          </div>
                          {/* <input
                            type="text"
                            className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                            placeholder="Nhập quốc tại đây"
                          /> */}
                          <NationSelect
                            className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                            value={registerForm.nation}
                            onChange={handleNationChange}
                          />
                        </div>
                      </div>
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
                        onChange={handleChange}
                        value={registerForm.password || ""}
                      />
                      {/* <div className="left-auto text-base text-gray-500">
                        <LuEyeClosed />
                      </div> */}
                    </div>
                  </div>
                </div>

                {/*  Confirm Password */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">
                    Nhập lại mật khẩu
                  </label>
                  <div className="mt-2">
                    <div className="flex flex-row items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdLockOutline />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập mật khẩu tại đây"
                        onChange={handleChange}
                        value={registerForm.confirmPassword || ""}
                      />
                      <div className="left-auto text-base text-gray-500">
                        <LuEyeClosed />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verify code */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">
                    Mã xác nhận
                  </label>
                  <div className="mt-2">
                    <div className="flex flex-row items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdLockOutline />
                      </div>
                      <input
                        type="text"
                        name="verificationCode"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập mã xác nhận"
                        onChange={handleChange}
                        value={registerForm.verificationCode || ""}
                      />
                      <div className="left-auto text-base text-gray-500">
                        <LuEyeClosed />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Đăng ký
                </button>
                <div className="items-center flex bg-[#a7abc3] justify-center my-5 w-full relative h-0.5">
                  <span className="font-light inline-flex text-gray-600 bg-white left-0 relative px-2.5 top-0">
                    Hoặc
                  </span>
                </div>
                <div className="group_btn_login_social flex gap-3.5 items-center justify-center">
                  <button className="btn btn_login_social">Google</button>
                  <button className="btn btn_login_social">Facebook</button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Đã có tài khoản?{" "}
                  <a
                    href="/"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
