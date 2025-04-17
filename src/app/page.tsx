import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from "./components/login-form";
import { AuthProvider } from "@/lib/context/AuthContext";
export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />
    //     <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
    //       <li className="mb-2 tracking-[-.01em]">
    //         Get started by editing{" "}
    //         <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
    //           src/app/page.tsx
    //         </code>
    //         .
    //       </li>
    //       <li className="tracking-[-.01em]">
    //         Save and see your changes instantly.
    //       </li>
    //     </ol>

    //     <div className="flex gap-4 items-center flex-col sm:flex-row">
    //       <a
    //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={20}
    //           height={20}
    //         />
    //         Deploy now
    //       </a>
    //       <a
    //         className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Read our docs
    //       </a>
    //     </div>
    //   </main>
    //   <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/file.svg"
    //         alt="File icon"
    //         width={16}
    //         height={16}
    //       />
    //       Learn
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/window.svg"
    //         alt="Window icon"
    //         width={16}
    //         height={16}
    //       />
    //       Examples
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/globe.svg"
    //         alt="Globe icon"
    //         width={16}
    //         height={16}
    //       />
    //       Go to nextjs.org →
    //     </a>
    //   </footer>
    // </div>
    // <div className="w-full min-h-screen">
    //   <div
    //     style={{
    //       backgroundImage: `url('${BackgroundImg.src}')`,
    //       backgroundSize: "cover",
    //       backgroundPosition: "center",
    //       backgroundRepeat: "no-repeat",
    //       width: "100%",
    //       height: "100%",
    //     }}
    //   >
    //     <div className="grid grid-cols-1 sm:grid-cols-12 min-h-screen gap-4">
    //       {/* */}
    //       <div className="flex flex-col justify-center items-center content-center sm:col-span-7 ">
    //         <div className="flex flex-row gap-2 items-center">
    //           <Image
    //             src="/engventure-logo.svg"
    //             width={138}
    //             height={38}
    //             alt="Logo"
    //           />
    //           <p className="text-orange-400 font-bold text-5xl">ENGVENTURE</p>
    //         </div>
    //         <h1 className="text-black">
    //           Chào mừng bạn đến với hệ thống học tập tiếng Anh
    //         </h1>
    //       </div>

    //       <div className="flex flex-col justify-center items-center px-6 py-12 m-auto sm:col-span-5 w-full ">
    //         <div className="page_login__form opacity-90 w-full p-5 mx-4 mt-10 px-6 py-12  bg-white rounded-2xl min-h-96">
    //           <h2 className="text-black font-bold text-center">Login</h2>
    //           <form className="space-y-4 md:space-y-6">
    //             {/*  Email */}
    //             <div className="gap-2">
    //               <label className="block text-sm text-gray-900">Email</label>
    //               <div className="mt-2">
    //                 <div className="flex items-center border border-gray-300 rounded-lg pl-3">
    //                   <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
    //                     <MdOutlineEmail />
    //                   </div>
    //                   <input
    //                     type="email"
    //                     className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
    //                     placeholder="Nhập email tại đây"
    //                   />
    //                 </div>
    //               </div>
    //             </div>
    //             {/*  Password */}
    //             <div className="gap-2">
    //               <label className="block text-sm text-gray-900">
    //                 Mật khẩu
    //               </label>
    //               <div className="mt-2">
    //                 <div className="flex flex-row items-center border border-gray-300 rounded-lg pl-3">
    //                   <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
    //                     <MdLockOutline />
    //                   </div>
    //                   <input
    //                     type="password"
    //                     className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
    //                     placeholder="Nhập mật khẩu tại đây"
    //                   />
    //                   <div className="left-auto text-base text-gray-500">
    //                     <LuEyeClosed />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             {/*  Remember password */}
    //             <div className="flex flex-row mt-10 justify-between">
    //               <div className="flex flex-row">
    //                 <div className="flex items-center justify-center h-5">
    //                   <input
    //                     id="remember"
    //                     type="checkbox"
    //                     className="w-4 h-4 border border-gray-300 text-white font-bold rounded bg-gray-50"
    //                   />
    //                 </div>
    //                 <div className="ml-3 text-sm">
    //                   <label className="text-gray-400 text-base">
    //                     Remember me
    //                   </label>
    //                 </div>
    //               </div>
    //               <div>
    //                 <a
    //                   href="/forgot-password"
    //                   className="text-sm font-medium text-primary-600 hover:underline"
    //                 >
    //                   Quên mật khẩu
    //                 </a>
    //               </div>
    //             </div>
    //             <button
    //               type="submit"
    //               className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    //             >
    //               Sign in
    //             </button>
    //             <div className="items-center flex bg-[#a7abc3] justify-center my-5 w-full relative h-0.5">
    //               <span className="font-light inline-flex text-gray-600 bg-white left-0 relative px-2.5 top-0">Hoặc</span>
    //             </div>
    //             <div className="group_btn_login_social flex flex-row gap-2 items-center justify-center">
    //               <GoogleButton><FaGoogle className="mr-1 text-red-500" /> {"Google"} </GoogleButton>
    //               <FacebookButton><FaFacebook className="mr-1 text-blue-600" /> {"Facebook"} </FacebookButton>
    //             </div>
    //             <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
    //               Don’t have an account yet?{" "}
    //               <a
    //                 href="/register"
    //                 className="font-medium text-primary-600 hover:underline dark:text-primary-500"
    //               >
    //                 Sign up
    //               </a>
    //             </p>

    //           </form>
    //         </div>
    //       </div>

    //       {/* <div className="">03</div> */}
    //     </div>
    //   </div>
    // </div>
    <LoginForm />
  );
}
