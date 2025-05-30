import Sidebar from "@/app/[locale]/components/layout/Sidebar";
import Header from "@/app/[locale]/components/layout/admin/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-white">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="p-4 overflow-auto min-h-screen bg-white shadow-md">{children}</main>
      </div>
    </div>
  );
}
