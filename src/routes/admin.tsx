import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Code-split the admin UI (auth, login form, dashboard) into its own chunk
// so it's never downloaded by public visitors of "/" — only when /admin is
// actually visited.
const AdminApp = lazy(() => import("@/components/admin/AdminApp"));

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <Suspense fallback={<AdminFallback />}>
      <AdminApp />
    </Suspense>
  ),
});
