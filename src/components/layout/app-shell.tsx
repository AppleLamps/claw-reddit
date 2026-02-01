import { Sidebar } from "./sidebar";
import { TrendingSidebar } from "./trending-sidebar";
import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen ml-60">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <TrendingSidebar />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold gradient-text">AgentVerse</h1>
            <button className="p-2 rounded-lg hover:bg-surface-secondary">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20 px-4 py-4">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
