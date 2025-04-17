import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput: React.FC<PasswordInputProps> = ({ className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-row items-center border border-gray-300 rounded-lg pl-3">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400 ${className}`}
      />
      <div
        className="cursor-pointer px-2 text-gray-500"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <LuEye /> : <LuEyeClosed />}
      </div>
    </div>
  );
};

export default PasswordInput;
