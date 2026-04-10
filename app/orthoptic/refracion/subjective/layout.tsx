import SubjectiveTabs from "./SubjectiveTabs";
import SubjectiveContent from "./SubjectiveContent";
import SubjectiveSummaryTable from "./SubjectiveSummaryTable";
import { SubjectiveProvider } from "./subjective-context";

export default function SubjectiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen  text-black bg-white">
      <SubjectiveProvider>
        <SubjectiveTabs />
        <div className="flex flex-col gap-1">
          <SubjectiveContent>{children}</SubjectiveContent>
          <SubjectiveSummaryTable />
        </div>
      </SubjectiveProvider>
    </section>
  );
}
