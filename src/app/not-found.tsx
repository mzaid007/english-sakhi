import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "यह पेज नहीं मिला — इंग्लिश सखी",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center bg-[#FAF8F5] px-5 py-16 text-stone-800">
      <p className="font-display text-5xl font-bold text-sakhi-emerald">404</p>
      <h1 className="mt-3 font-hindi text-2xl font-semibold text-stone-800">
        यह पेज नहीं मिला
      </h1>
      <p className="mt-2 font-hindi text-base leading-relaxed text-stone-600">
        यह पता इंग्लिश सखी में नहीं है। होम पर लौटकर अपना मिशन खोलें।
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-touch items-center justify-center rounded-2xl bg-sakhi-emerald px-5 font-hindi text-base font-semibold text-white"
      >
        होम पर जाएँ
      </Link>
    </main>
  );
}
