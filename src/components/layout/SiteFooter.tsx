import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background-darker text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* BEWERBER */}
          <div>
            <h3 className="font-bold text-lg mb-4">BEWERBER</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/public/jobs" className="text-gray-300 hover:text-white">
                  Jobs suchen
                </Link>
              </li>
              <li>
                <Link href="/public/employer-list" className="text-gray-300 hover:text-white">
                  Firmen entdecken
                </Link>
              </li>
            </ul>
          </div>

          {/* ARBEITGEBER */}
          <div>
            <h3 className="font-bold text-lg mb-4">ARBEITGEBER</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/employer/login" className="text-gray-300 hover:text-white">
                  Stellenanzeige schalten
                </Link>
              </li>
              <li>
                <Link href="/employer/profile" className="text-gray-300 hover:text-white">
                  Mein Arbeitgeber-Profil
                </Link>
              </li>
              <li>
                <Link href="/employer/register" className="text-gray-300 hover:text-white">
                  Registrieren
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* ÜBER UNS */}
          <div>
            <h3 className="font-bold text-lg mb-4">ÜBER UNS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Allgemeine Geschäftsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Cookie Einstellungen
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-xl font-bold">joblocal</span>
          </div>
          <p className="text-gray-400 text-sm">
            Powered by joblocal - 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
