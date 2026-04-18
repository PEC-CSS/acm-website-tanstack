import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer } from "$components/footer";
import { Navbar } from "$components/navbar";

export const Route = createFileRoute("/(app)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div className="sm:mt-16 bg-gray-100">
        <main className="min-h-128 p-2 max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
