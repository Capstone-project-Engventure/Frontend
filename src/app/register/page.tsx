import Image from "next/image";
// import BackgroundImg from "../../../public/english_app_background.jpg";
const BackgroundImg = "/english_app_background.jpg";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function Register() {
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
              <form className="space-y-4 md:space-y-6">
                {/* Tên */}

                <div className="gap-2">
                  <label className="block text-sm text-gray-900">Tên</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="text"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập tên tại đây"
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
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập email tại đây"
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
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập mật khẩu tại đây"
                      />
                      <div className="left-auto text-base text-gray-500">
                        <LuEyeClosed />
                      </div>
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
                        Remember me
                      </label>
                    </div>
                  </div>
                  <div>
                    <a
                      href="/forgot-password"
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      Quên mật khẩu
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
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
                  Don’t have an account yet?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>

          {/* <div className="">03</div> */}
        </div>
      </div>
    </div>
  );
}
