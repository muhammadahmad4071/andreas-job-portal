import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Flame, Globe, Facebook, Instagram } from "lucide-react"

const fallbackEmployer = {
  name: "Käfer Gut Kaltenbrunn GmbH",
  logo: "/gut-kaltenbrunn-logo.jpg",
  coverImage: "/lake-tegernsee-scenic-landscape.jpg",
  headOffice: {
    street: "Kaltenbrunn 1",
    postcode: "83703",
    city: "Gmund",
    country: "Germany",
  },
  address: {
    street: "Kaltenbrunn 1",
    fullAddress: "83703 Gmund\nGermany",
  },
  industry: "Tourism, hospitality and gastronomy",
  socialLinks: {
    website: "https://gut-kaltenbrunn.de",
    facebook: "https://facebook.com/gutkaltenbrunn",
    instagram: "https://instagram.com/gutkaltenbrunn",
  },
}

type EmployerProfileHeroProps = {
  name?: string
  logoUrl?: string | null
  street?: string | null
  postcode?: string | null
  city?: string | null
  country?: string | null
}

export function EmployerProfileHero({
  name,
  logoUrl,
  street,
  postcode,
  city,
  country,
}: EmployerProfileHeroProps) {
  const employer = fallbackEmployer

  const displayName = name || employer.name
  const displayLogo = logoUrl || employer.logo

  const headStreet = street || employer.headOffice.street
  const headPostcode = postcode || employer.headOffice.postcode
  const headCity = city || employer.headOffice.city
  const headCountry = country || employer.headOffice.country

  const addressStreet = street || employer.address.street
  const addressFull =
    postcode && city && country
      ? `${postcode} ${city}\n${country}`
      : employer.address.fullAddress

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative w-full h-[200px] md:h-[260px] bg-gradient-to-br from-blue-400 to-emerald-400">
        <Image
          src={employer.coverImage || "/placeholder.svg"}
          alt={`${displayName} cover`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlapping Card */}
      <div className="container-custom max-w-6xl mx-auto px-4">
        <Card className="relative -mt-20 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column - Logo & Basic Info */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-lg border-2 border-border overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={displayLogo || "/placeholder.svg"}
                    alt={`${displayName} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="text-center md:text-left space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Employer
                  </p>
                  <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                    {displayName}
                  </h1>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                    <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FDB714]" />
                    <div>
                      <p className="font-medium text-foreground">Head office</p>
                      <p>
                        {headStreet}, {headPostcode} {headCity}, {headCountry}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column - Address & Industry */}
              <div className="space-y-4 text-center md:text-left text-sm">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Address
                  </p>
                  <p>
                    <span className="font-medium">Street: </span>
                    <span className="text-muted-foreground">{addressStreet}</span>
                  </p>
                  <p>
                    <span className="font-medium">Postal code / City: </span>
                    <span className="text-muted-foreground">
                      {headPostcode} {headCity}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Country: </span>
                    <span className="text-muted-foreground">{headCountry}</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Flame className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#FDB714]" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Industry</p>
                    <p className="text-sm text-muted-foreground">
                      {employer.industry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Find Us Links */}
              {/* <div className="text-center md:text-left">
                <h3 className="text-sm font-semibold text-foreground mb-3">Find us:</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-muted"
                    asChild
                  >
                    <a href={employer.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Website</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-muted"
                    asChild
                  >
                    <a href={employer.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-muted"
                    asChild
                  >
                    <a href={employer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  </Button>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
