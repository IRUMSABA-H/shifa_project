"use client";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "../components/header";
import Tabs from "../components/tabs/page";


export default function OrthopticLayout({ children }: { children: React.ReactNode }) {
 const pathname= usePathname();

  const menuItems = [
    {
      key: "/orthoptic/assesment",
      label:
       <Link href="/orthoptic/assesment" 
        className={`${
        pathname==="/orthoptic/assesment"?
        `text-sky-800`
        :`text-gray-600 hover:text-sky-600 transition-all duration-200 `
        
        } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}>Patient History</Link>,
    },
    {
      key: "/orthoptic/viusalassest",
      label: <Link href="/orthoptic/viusalassest" className={`${
        pathname==="/orthoptic/viusalassest"?
        `text-sky-800`:
        `text-gray-600 hover:text-sky-600 transition-all duration-200`
      } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}>Visual Acuity</Link>,
    },
    {
      key: "/orthoptic/refracion",
      label: <Link href="/orthoptic/refracion" className={`${
        pathname==="/orthoptic/refracion"?
        `text-sky-800`:
        `text-gray-600 hover:text-sky-600 transition-all duration-200`
      } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}>Refraction</Link>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5 pt-18">
      <Header/>
      <Tabs/>
      {/* Main Tabs */}

      <div className="mt-1 bg-white shadow-sm rounded-md overflow-hidden">
        <Menu 
          mode="horizontal" 
          selectedKeys={[pathname]} 
          items={menuItems} 
          
        />
        
        {/* Is 'children' ki wajah se niche content badlega */}
        <div >
          {children}
        </div>
      </div>
    </div>
  );
}