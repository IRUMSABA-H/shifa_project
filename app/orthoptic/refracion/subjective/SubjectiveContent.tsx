export default function SubjectiveContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md  bg-white p-4 ">
      {children}
    </section>
  );
}
