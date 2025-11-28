// components/home/HomeSeoText.tsx

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type SeoResponse = {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

async function fetchSeoText(): Promise<string | null> {
  if (!API_BASE_URL) return null

  try {
    const res = await fetch(`${API_BASE_URL}/seos/key/main-text`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // 🔥 important: disable caching so updates show immediately
      cache: "no-store",
      // or alternatively:
      // next: { revalidate: 0 },
    })

    if (!res.ok) return null

    const data = (await res.json()) as SeoResponse
    return data?.value ?? null
  } catch (err) {
    console.error("SEO text fetch error:", err)
    return null
  }
}

export async function HomeSeoText() {
  const seoText = await fetchSeoText()

  // If no text returned → render nothing for now
  if (!seoText) return null

  const paragraphs = seoText.split(/\r?\n\r?\n/).filter(Boolean)

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-4xl">
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-gray-700 leading-relaxed mb-4 last:mb-0"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
