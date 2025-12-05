import Link from "next/link"

export function WelcomeBanner() {
  return (
    <div className="bg-sky-500 rounded-lg p-8 text-white relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Willkommen in unserem neuen System!</h1>
        <p className="text-sky-50 leading-relaxed">
          Wir freuen uns, Ihnen unsere aktualisierte Plattform vorzustellen, und hoffen, dass sie Ihre Arbeit erleichtert.
        </p>
      </div>
      
      {/* Decorative illustration placeholder */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
          <circle cx="30" cy="50" r="20" fill="white" />
          <circle cx="70" cy="50" r="20" fill="white" />
          <path d="M30 40 L40 20 L50 40" stroke="white" strokeWidth="2" />
          <path d="M60 40 L70 20 L80 40" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
