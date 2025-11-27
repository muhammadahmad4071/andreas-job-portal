import { getHomePageData } from '@/lib/api/home'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeBannerStrip } from '@/components/home/HomeBannerStrip'
import { HomeRegionButtons } from '@/components/home/HomeRegionButtons'
import { HomeTopEmployers } from '@/components/home/HomeTopEmployers'
import { HomeVideoHighlights } from '@/components/home/HomeVideoHighlights'
import { HomeFeaturedJobs } from '@/components/home/HomeFeaturedJobs'
import { HomeSeoText } from '@/components/home/HomeSeoText'

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
