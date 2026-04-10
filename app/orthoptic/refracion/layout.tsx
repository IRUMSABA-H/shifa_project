import RefractionStepper from "./RefractionStepper";

export default function RefractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" p-7 text-black bg-white ">
      <RefractionStepper />

      <div >{children}</div>
    </section>
  );
}
