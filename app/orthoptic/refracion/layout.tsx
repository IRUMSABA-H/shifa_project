"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Col, Row } from "antd";

const linkClass = (active: boolean) =>
  `font-bold ${active ? "text-sky-700" : "text-black hover:text-sky-700"}`;

export default function RefractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="min-h-screen p-7 text-black bg-white">
     <Row gutter={0} className="mb-6 flex items-center w-full">
  {/* Step 1: Objective */}
  <Col span={10}>
    <Link
      href="/orthoptic/refracion"
      className="flex items-center gap-3 no-underline group w-full"
    >
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors
        ${pathname === "/orthoptic/refracion" ? 'bg-blue-500 text-white' : 'border-2 border-gray-300 text-gray-400'}
      `}>
        1
      </div>
      <span  className={`text-normal font-bold ${pathname === "/orthoptic/refracion" ? 'text-black' : 'text-gray-500'}`}>
        Objective
      </span>
      {/* Connecting Line */}
      <div className="flex-grow-3 h-px bg-gray-600 mx-10"></div>
    </Link>
  </Col>

  {/* Step 2: Subjective */}
  <Col span={10}>
    <Link
      href="/orthoptic/refracion/subjective"
      className="flex items-center gap-3 no-underline group w-full"
    >
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors
        ${pathname === "/orthoptic/refracion/subjective" ? 'bg-blue-500 text-gray-300' : 'border-2 border-gray-300 text-gray-400'}
      `}>
        2
      </div>
      <span className={`text-normal font-bold ${pathname === "/orthoptic/refracion/subjective" ? 'text-black' : 'text-gray-500'}`}>
        Subjective
      </span>
    </Link>
  </Col>
</Row>

      {children}
    </section>
  );
}
