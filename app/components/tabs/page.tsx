"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tabs() {
  const pathname = usePathname();

  return (
    <section className=" bg-white  shadow-sm w-full border border-gray-200   mt-4 rounded-md">
      {/* Container for Tabs and Search */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 flex-wrap">
        
        {/* Left Side: Tabs */}
        <div className="flex gap-8 flex-wrap">
          <Link
            href="/patient/shifa"
            className={`${
              pathname === "/patient/shifa"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-600"
            } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}
          >
            Shifa Patients
          </Link>

          <Link
            href="/patient/nonshifa"
            className={`${
              pathname === "/patient/nonshifa"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-600"
            } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}
          >
            Non-Shifa Patients
          </Link>

          <Link
          href="/permissionlist"
          className={`${
              pathname === "/permissionlist"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-600"
            } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}
         
          >
            Permission List
          </Link> <Link
          href="/orthoptic"
          className={`${
              pathname === "/orthoptic"
                ? "border-b-2 border-sky-600 text-sky-600"
                : "text-gray-600"
            } pb-1 font-medium hover:text-sky-600 transition-all duration-200`}
         
          >
            Orthoptic Asessment Form
          </Link>
        
        </div>
        </div>
    </section>
  );
}
