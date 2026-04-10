"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Col, Row } from "antd";

export default function RefractionStepper() {
  const pathname = usePathname();
  const isObjective = pathname === "/orthoptic/refracion/Objective";
  const isSubjective = pathname.includes("/orthoptic/refracion/subjective");

  return (
    <Row gutter={0} align="middle" className="mb-5 inline-flex w-fit">
      <Col>
        <Link
          href="/orthoptic/refracion/Objective"
          className="flex items-center gap-3 no-underline"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full font-bold transition-all ${
              isObjective
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-400 shadow-md"
            }`}
          >
            1
          </div>
          <span
            className={`text-normal font-bold ${
              isObjective ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Objective
          </span>
        </Link>
      </Col>

      <Col className="px-1">
        <div
          className={`h-[2px] w-25 transition-colors duration-300 ${
            isSubjective ? "bg-blue-500" : "bg-gray-400"
          }`}
        ></div>
      </Col>

      <Col>
        <Link
          href="/orthoptic/refracion/subjective/Divisondistance"
          className="flex items-center gap-3 no-underline"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full font-bold transition-all ${
              isSubjective
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-400 shadow-md"
            }`}
          >
            2
          </div>
          <span
            className={`text-normal font-bold ${
              isSubjective ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Subjective
          </span>
        </Link>
      </Col>
    </Row>
  );
}
