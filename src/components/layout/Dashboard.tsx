
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type DashboardProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-6 h-full">
          <div className="animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
