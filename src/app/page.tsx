import { Suspense } from "react";
import { HomeDashboard } from "@/components/home/HomeDashboard";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-full w-full max-w-md px-4 py-10 font-hindi text-sakhi-muted">
          लोड हो रहा है…
        </div>
      }
    >
      <HomeDashboard />
    </Suspense>
  );
}
