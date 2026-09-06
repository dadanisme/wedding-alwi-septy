import { InvitationExperience } from "@/components/invitation-experience";

export default function Home() {
  return (
    <>
      {/*
       * Latar damask berulang di area luar (gutter) untuk layar ultrawide (>1440px).
       * Tersembunyi di layar normal/ponsel (<=1440px) agar tidak membebani komposit rendering.
       */}
      <div
        className="fixed inset-0 -z-10 hidden bg-matte min-[1441px]:block"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[url('/patterns/botanical-damask.jpg')] bg-[size:420px_420px] bg-repeat opacity-50 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-matte/50 via-transparent to-matte/50"
          aria-hidden="true"
        />
      </div>

      <InvitationExperience guestName="Bapak/Ibu Budi Santoso" />
    </>
  );
}
