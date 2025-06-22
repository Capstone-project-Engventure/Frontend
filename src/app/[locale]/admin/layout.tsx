import Sidebar from "@/app/[locale]/components/layout/Sidebar";
import Header from "@/app/[locale]/components/layout/admin/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-white dark:bg-gray-900">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="p-4 overflow-auto min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md">{children}</main>
      </div>
    </div>
  );
}
