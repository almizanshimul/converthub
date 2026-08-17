import { ReactNode } from "react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-muted">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div>
          <p className="text-sm font-semibold">Admin</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
