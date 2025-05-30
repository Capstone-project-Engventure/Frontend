"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import LoginForm from "@/app/[locale]/components/login-form/login-form";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/Api";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/user";
import { useTranslations } from "next-intl";

export default function Home() {
  const router = useRouter();
  // const t = useTranslations("HomePage");
  return (
    <div>
      <LoginForm />
    </div>
  );
}
