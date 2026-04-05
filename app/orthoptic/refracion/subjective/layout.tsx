"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs } from "antd";

const linkClass = (active: boolean) =>
  `font-bold ${active ? "text-sky-700" : "text-black hover:text-sky-700"}`;

export default function SubjectiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="min-h-screen  text-black bg-white">
        <Tabs>
          <Tabs.TabPane
            tab={
              <Link href="/orthoptic/refracion/subjective" className={linkClass(pathname === "/orthoptic/refracion/subjective")}>
                Division Distance(DV)
              </Link>
            }
            key="/orthoptic/refracion/subjective"
          />
          <Tabs.TabPane
            tab={
              <Link href="/orthoptic/refracion/subjective/InterMediatevision" className={linkClass(pathname === "/orthoptic/refracion/subjective/InterMediatevision")}>
                Intermediate Vision(IV)
              </Link>
            }
            key="//orthoptic/refracion/subjective/InterMediatevision"
          />
        </Tabs>
        {children}
 
    </section>
  );
}
