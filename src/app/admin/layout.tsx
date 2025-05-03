import Sidebar from "@/app/components/layout/admin/Sidebar";
import Header from "@/app/components/layout/admin/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 overflow-auto min-h-screen bg-white shadow-md">{children}</main>
      </div>
    </div>
  );
}
