"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail, MdPhone } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { SiLevelsdotfyi } from "react-icons/si";
import { useApi } from "@/lib/Api";
import GenderSelect from "@/app/[locale]/components/GenderSelect";
import { GenderEnum } from "@/lib/constants/gender";
import { toast } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  dateOfBirth: Date;
  phone: string;
  gender: GenderEnum;
  level: string;
  address: string;
  password?: string;
}

export default function ProfileCard() {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: "",
    dateOfBirth: new Date(),
    phone: "",
    gender: GenderEnum.MALE,
    level: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("users/user_info");
        const data = res.data;

        setProfileForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth)
            : new Date(),
          phone: data.phone || "",
          gender: data.gender || "male",
          level: data.level || "",
          address: data.address || "",
        });
      } catch (err) {
        console.log("something went wrong", err);
        toast("Hệ thống xảy ra vấn đề");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setProfileForm((values) => ({
      ...values,
      [name]: name === "dateOfBirth" ? new Date(value) : value,
    }));
  };

  const handleGenderChange = (value: GenderEnum) => {
    setProfileForm((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      // setIsLoading(true);
      const payload = {
        ...profileForm,
        dateOfBirth: profileForm.dateOfBirth.toISOString().split("T")[0],
      };
      const res = await api.put("users/update-profile", payload);
      const data = res.data;
      setProfileForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
        phone: data.phone || "",
        gender: data.gender || "male",
        level: data.level || "",
        address: data.address || "",
      });
      toast("Cập nhật thành công");
    } catch (err) {
      console.log("something went wrong", err);
    } finally {
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full justify-center items-center">
        <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
        <span>Đang tải dữ liệu</span>
      </div>
    );
  } else {
    return (
      <div>
        <TabGroup>
          <TabList>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 py-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Thông tin cá nhân
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 p-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Thay đổi mật khẩu
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ hover, selected }) => (
                <button
                  className={
                    "px-4 p-3 text-amber-500 " +
                    clsx(
                      hover && " border-b-4 border-gray-200 text-black",
                      selected && " border-b-4 border-gray-400 text-black"
                    )
                  }
                >
                  Liên kết tài khoản
                </button>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form
                className="space-y-4 md:space-y-6 mt-4 md:w-2/3"
                onSubmit={handleSaveProfile}
              >
                {/* Full Name */}

                <div className="grid md:grid-cols-12 gap-2 grid-cols-1">
                  {/*  First Name */}
                  <div className="col-span-6 gap-2">
                    <label className="block text-sm text-gray-900">Họ</label>
                    <div className="mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                        <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                          <FaUser />
                        </div>
                        <input
                          type="text"
                          name="name"
                          className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                          placeholder="Nhập họ tại đây"
                          value={profileForm.first_name || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/*  Last name */}
                  <div className="col-span-6 gap-2">
                    <label className="block text-sm text-gray-900">Tên</label>
                    <div className="mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                        <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                          <FaUser />
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                          placeholder="Nhập tên tại đây"
                          value={profileForm.last_name || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-12 gap-2 grid-cols-1">
                  {/*  Email */}
                  <div className="col-span-6 gap-2">
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
                          value={profileForm.email || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/*  Phone */}
                  <div className="col-span-6 gap-2">
                    <label className="block text-sm text-gray-900">Điện thoại</label>
                    <div className="mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                        <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                          <MdPhone />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                          placeholder="Nhập điện thoại tại đây"
                          value={profileForm.phone || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gender & Dob */}
                <div className="grid md:grid-cols-12 gap-2 grid-cols-1">
                  {/*  Gender */}
                  <div className="col-span-6 gap-2">
                    <label className="block text-sm text-gray-900">
                      Giới tính
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                        <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                          <MdOutlineEmail />
                        </div>

                        <GenderSelect
                          className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                          value={profileForm.gender}
                          onChange={handleGenderChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/*  Date of brith */}
                  <div className="col-span-6 gap-2">
                    <label className="block text-sm text-gray-900">
                      Ngày sinh
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                        <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                          <LiaBirthdayCakeSolid />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                          placeholder="Nhập ngày sinh tại đây"
                          value={
                            profileForm.dateOfBirth
                              ? profileForm.dateOfBirth
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/*  Level */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">Cấp độ</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <SiLevelsdotfyi />
                      </div>
                      <input
                        type="text"
                        name="level"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập cấp độ tại đây"
                        value={profileForm.level || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/*  Address */}
                <div className="gap-2">
                  <label className="block text-sm text-gray-900">
                    Địa chỉ cụ thể
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="text"
                        name="address"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập địa chỉ tại đây"
                        value={profileForm.address || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <button
                    type="submit"
                    className="px-2 py-3 bg-gray-400 text-white rounded-md"
                  >
                    Lưu thông tin
                  </button>
                  <button
                    type="button"
                    className="px-2 py-3 bg-white text-gray-400 border border-gray-400 rounded-md ml-3"
                  >
                    Yêu cầu xóa tài khoản
                  </button>
                </div>
              </form>
            </TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    );
  }
}
