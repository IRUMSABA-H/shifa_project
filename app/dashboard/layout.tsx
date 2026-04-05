import Header from "../components/header";
import Tabs from "../components/tabs/page";

// Shifa Patients, Permission List Tabs

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      {/* SECTION 1: Top Header (Hamesha Fixed) */}
      <Header />

      {/* SECTION 2: Sub-Navbar/Tabs (Ye bhi hamesha rahega) */}
      <Tabs  />

      {/* SECTION 3: Main Page Content (Sirf ye badlega) */}
      <main className="p-4 md:p-6">
        <div className="bg-white rounded-md shadow-sm min-h-[80vh]">
          {children}
        </div>
      </main>
    </div>
  );
}