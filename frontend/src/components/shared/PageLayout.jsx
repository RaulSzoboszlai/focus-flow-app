import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";
import { useState } from "react";

export default function PageLayout({ title, subtitle, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto p-4 md:p-8">
        <PageHeader
          title={title}
          subtitle={subtitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {children}
      </main>
    </div>
  );
}
