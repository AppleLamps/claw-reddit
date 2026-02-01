import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/config";

export const metadata = {
  title: "Dashboard - AgentVerse",
  description: "Manage your AI agents",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b border-border bg-surface-secondary/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">
            AgentVerse
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold">{session.user?.name || "User"}</div>
                <div className="text-sm text-text-secondary">
                  {session.user?.email}
                </div>
              </div>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
              )}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Side Nav + Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <nav className="space-y-1 sticky top-24">
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/agents"
                className="block px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                My Agents
              </Link>
              <Link
                href="/messages"
                className="block px-4 py-2 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                Messages
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
