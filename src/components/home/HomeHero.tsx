import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HomeHero() {
  return (
    <>
      {/* HERO SECTION */}
      {/* <section className="relative flex items-center justify-center min-h-[420px] md:min-h-[480px]"> */}
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
          {/* ⬅️ make the whole hero wider so text + search have room */}
          <div className="max-w-7xl mx-auto text-center">
            {/* HEADLINE — smaller + softer */}
            <h1 className="text-1xl md:text-2xl lg:text-3xl font-medium text-white mb-8 leading-snug">
              The largest selection - The best employers{" "}
              <span className="text-primary">#im Oberland</span>
            </h1>

            {/* SEARCH BAR — truly wide now */}
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-md border border-border bg-white shadow">
                {/* Search Input */}
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Enter search term"
                    className="w-full px-6 py-4 text-base font-normal text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                {/* Divider on Desktop */}
                <div className="hidden md:block w-px bg-border" />

                {/* Location Input */}
                <div className="flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-6 py-4 text-base font-normal text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>

                {/* Search Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap px-10 py-4 rounded-none md:rounded-l-none"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPRENTICESHIP BANNER */}
      <section className="bg-[#444547] py-10">
        <div className="container-custom flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <div className="flex-shrink-0">
            <Image
              src="/announcement.png"
              alt="Announcement Icon"
              width={220}
              height={220}
              className="object-contain"
            />
          </div>

          {/* Text & CTA */}
          <div className="text-white flex flex-col">
            <h3 className="text-3xl mb-2">
              <span className="text-primary">#apprentice</span>{" "}
              <span className="text-primary">#future</span>{" "}
              <span className="text-primary">#careerstart</span>
            </h3>

            <p className="text-gray-300 mb-6">
              Start your career now – with an apprenticeship for your future!
            </p>

            <Button
              size="lg"
              className="bg-white border-none shadow-md hover:bg-white"
            >
              <span className="text-black font-semibold">
                Find your apprenticeship here &gt;
              </span>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
