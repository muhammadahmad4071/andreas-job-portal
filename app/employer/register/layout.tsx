import Image from "next/image"

export default function EmployerRegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Custom minimal header */}
      <header className="h-20 flex items-center justify-center border-b border-border bg-white">
        <Image
          src="/logo.png"
          alt="Oberland Jobs logo"
          width={160}
          height={50}
          priority
        />
      </header>

      {/* The registration screen content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
