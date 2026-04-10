"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs } from "antd";

const linkClass = (active: boolean) =>
  `font-bold ${active ? "text-sky-700" : "text-black hover:text-sky-700"}`;

const tabItems = [
  {
    key: "/orthoptic/refracion/subjective/Divisondistance",
    label: "Division Distance(DV)",
  },
  {
    key: "/orthoptic/refracion/subjective/InterMediatevision",
    label: "Intermediate Vision(IV)",
  },
  {
    key: "/orthoptic/refracion/subjective/Nearvision",
    label: "Near Vision(NV)",
  },
  {
    key: "/orthoptic/refracion/subjective/Interpuppilarydistance",
    label: "Interpuppilary Distance(IPD)",
  },
];

export default function SubjectiveTabs() {
  const pathname = usePathname();

  return (
    <Tabs
      activeKey={pathname}
      items={tabItems.map((item) => ({
        key: item.key,
        label: (
          <Link href={item.key} className={linkClass(pathname === item.key)}>
            {item.label}
          </Link>
        ),
      }))}
    />
  );
}
