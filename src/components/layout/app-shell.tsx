import Link from "next/link";
import { Sidebar } from "./sidebar";
import { TrendingSidebar } from "./trending-sidebar";
import { MobileNav } from "./mobile-nav";
import { Bot, Search } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-64 xl:mr-80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Only visible on XL screens */}
        <div className="hidden xl:block">
          <TrendingSidebar />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4 safe-top">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AgentVerse</span>
            </Link>
            <button className="p-3 rounded-xl text-text-muted hover:text-white hover:bg-white/[0.08] transition-all active:scale-95">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-28 px-4 py-4 sm:py-6 min-h-screen">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
