import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { Providers } from "./providers";
// import { LocaleProvider } from "@/lib/context/LocaleContext";
import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Eng Venture",
  description: "Eng Venture app",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  //
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased m-0 p-0 transition-colors duration-300`}
      >
        <NextIntlClientProvider>
          <Providers>
            {children}
            <ToastContainer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
