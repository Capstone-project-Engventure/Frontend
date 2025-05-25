import Sidebar from "@/app/[locale]/components/layout/Sidebar";
import Header from "@/app/[locale]/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="p-4 overflow-auto min-h-screen shadow-md bg-white text-black dark:bg-black dark:text-white">{children}</main>
      </div>
    </div>
  );
}
