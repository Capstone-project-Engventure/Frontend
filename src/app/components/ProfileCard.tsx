"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useState } from "react";
import clsx from "clsx";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { useApi } from "@/lib/Api";
import GenderSelect from "@/app/components/GenderSelect";
import { GenderEnum } from "@/lib/constants/gender";
interface ProfileFormData {
  name: string;
  email: string;
  dateOfBirth: Date;
  phone: string;
  gender: string;
  level: string;
  nation: string;
  address: string;
  password?: string;
}

export default function ProfileCard() {
  const api = useApi();
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: "",
    email: "",
    dateOfBirth: new Date(),
    phone: "",
    gender: "male",
    level: "",
    nation:"",
    address: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setProfileForm((values) => ({ ...values, [name]: value }));
  };

  const handleGenderChange = (value: GenderEnum) => {
    setProfileForm((prev) => ({
        ...prev,
        gender: value,
      }));
    };
  

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
            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-12 gap-2">
                {/*  Name */}
                <div className="col-span-6 gap-2">
                  <label className="block text-sm text-gray-900">Tên học viên</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="text"
                        name="name"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập tên tại đây"
                        value={profileForm.name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
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
              </div>
              {/* Birth & Phone */}
              <div className="grid grid-cols-12 gap-2">
                {/*  Birth */}
                <div className="col-span-6 gap-2">
                  <label className="block text-sm text-gray-900">Ngày sinh</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập tên tại đây"
                        value={profileForm.dateOfBirth || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/*  Phone */}
                <div className="col-span-6 gap-2">
                  <label className="block text-sm text-gray-900">Phone</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập phone tại đây"
                        value={profileForm.phone || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                {/*  Gender */}
                <div className="col-span-6 gap-2">
                  <label className="block text-sm text-gray-900">Giới tính</label>
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
                      {/* <input
                        type="date"
                        name="dateOfBirth"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập tên tại đây"
                        value={profileForm.dateOfBirth || ""}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </div>
                </div>
                {/*  Nation */}
                <div className="col-span-6 gap-2">
                  <label className="block text-sm text-gray-900">Quốc gia</label>
                  <div className="mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg pl-3">
                      <div className="shrink-0 text-base text-gray-500 items-center gap-1 border-r-1 pr-1 select-none">
                        <MdOutlineEmail />
                      </div>
                      <input
                        type="text"
                        name="nation"
                        className="block grow py-1.5 pl-1 pr-3 w-full text-base text-gray-900 placeholder:text-gray-400"
                        placeholder="Nhập phone tại đây"
                        value={profileForm.nation || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*  Level */}
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
                      value={profileForm.email || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
               {/*  Address */}
               <div className="gap-2">
                <label className="block text-sm text-gray-900">Địa chỉ cụ thể</label>
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
            </form>
          </TabPanel>
          <TabPanel>Content 2</TabPanel>
          <TabPanel>Content 3</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
