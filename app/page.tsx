import { getHomePageData } from '@/lib/api/home'
import { HomeHero } from '@/components/public/home/HomeHero'
import { HomeBannerStrip } from '@/components/public/home/HomeBannerStrip'
import { HomeRegionButtons } from '@/components/public/home/HomeRegionButtons'
import { HomeTopEmployers } from '@/components/public/home/HomeTopEmployers'
import { HomeVideoHighlights } from '@/components/public/home/HomeVideoHighlights'
import { HomeFeaturedJobs } from '@/components/public/home/HomeFeaturedJobs'
import { HomeSeoText } from '@/components/public/home/HomeSeoText'
export const dynamic = "force-dynamic"
export default async function HomePage() {
  const data = await getHomePageData()

  return (
    <main>
      <HomeHero />
      <HomeBannerStrip/>
      <HomeTopEmployers/>
      <HomeVideoHighlights />
      <HomeFeaturedJobs/>
      <HomeSeoText />
    </main>
  )
}
