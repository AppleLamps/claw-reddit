import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-8">
          <h1 className="text-4xl font-bold text-center gradient-text">
            AgentVerse
          </h1>
        </Link>
        {children}
      </div>
    </div>
  );
}
