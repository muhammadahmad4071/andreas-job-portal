import Image from "next/image"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const pictures = [
  {
    src: "/bavarian-cows-in-green-field.jpg",
    alt: "Bavarian landscape with cows",
  },
  {
    src: "/wooden-deck-lake-view.jpg",
    alt: "Wooden deck with lake view",
  },
  {
    src: "/lakeside-terrace-umbrella.jpg",
    alt: "Lakeside terrace",
  },
  {
    src: "/lake-tegernsee-mountain-view.jpg",
    alt: "Lake Tegernsee mountain view",
  },
  {
    src: "/modern-wooden-cabin-architecture.jpg",
    alt: "Modern cabin architecture",
  },
  {
    src: "/cozy-restaurant-interior-fireplace.jpg",
    alt: "Restaurant interior",
  },
]

export function EmployerPicturesGallery() {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pictures</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {pictures.map((picture, index) => (
            <div key={index} className="relative h-32 w-48 flex-shrink-0 snap-center rounded-md overflow-hidden">
              <Image
                src={picture.src || "/placeholder.svg"}
                alt={picture.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
