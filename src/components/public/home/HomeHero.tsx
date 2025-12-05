"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeHero() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTerm, setLocationTerm] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim())
    }

    if (locationTerm.trim()) {
      params.set("location", locationTerm.trim())
    }

    const queryString = params.toString()
    const url = queryString ? `/public/jobs?${queryString}` : "/public/jobs"

    router.push(url)
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center min-h-[520px] md:min-h-[600px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('/bavarian-alpine-mountain-lake-landscape-panorama.jpg')`,
          }}
        >
          {/* Slight overlay */}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-1xl md:text-2xl lg:text-3xl font-medium text-white mb-8 leading-snug">
              Die größte Auswahl - Die besten Arbeitgeber{" "}
              <span className="text-primary">#im Oberland</span>
            </h1>

            {/* SEARCH BAR */}
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-md border border-border bg-white shadow h-14">
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    // placeholder="Enter search term"
                    placeholder="Suchbegriff eingeben"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-full w-full px-6 text-base font-normal text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <div className="hidden md:block w-px bg-border" />

                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    // placeholder="Enter location"
                    placeholder="Ort eingeben"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="h-full w-full px-6 text-base font-normal text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                <Button
                  variant="primary"
                  className="whitespace-nowrap px-10 h-full rounded-none md:rounded-l-none"
                  type="button"
                  onClick={handleSearch}
                >
                  {/* Search */}
                  Suchen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPRENTICESHIP BANNER */}
      <section className="bg-[#444547] py-10">
        <div className="container-custom flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <Image
              src="/announcement.png"
              alt="Announcement Icon"
              width={220}
              height={220}
              className="object-contain"
            />
          </div>

          <div className="text-white flex flex-col">
            <h3 className="text-3xl mb-2">
              <span className="text-primary">#azubi</span>{" "}
              <span className="text-primary">#zukunft</span>{" "}
              <span className="text-primary">#karrierestart</span>
            </h3>

            <p className="text-gray-300 mb-6">
              Starte Deine Karriere jetzt – mit einer Ausbildung für Deine Zukunft!
            </p>

            <Link href="/public/jobs?employmentType=Apprenticeship">
              <Button
                size="lg"
                className="bg-white border-none shadow-md hover:bg-white"
              >
                <span className="text-black font-semibold">
                  Finde hier deine Ausbildungsstelle &gt;
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
