import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'

// The front page ships in the entry chunk; everything else loads on navigation.
const Atlas = lazy(() => import('@/pages/Atlas').then((m) => ({ default: m.Atlas })))
const CountryDetail = lazy(() =>
  import('@/pages/CountryDetail').then((m) => ({ default: m.CountryDetail })),
)
const Methodology = lazy(() =>
  import('@/pages/Methodology').then((m) => ({ default: m.Methodology })),
)
const RefineriesIndex = lazy(() =>
  import('@/pages/Refineries').then((m) => ({ default: m.RefineriesIndex })),
)
const RefineryDetail = lazy(() =>
  import('@/pages/Refineries').then((m) => ({ default: m.RefineryDetail })),
)
const RegionsIndex = lazy(() =>
  import('@/pages/Regions').then((m) => ({ default: m.RegionsIndex })),
)
const RegionDetail = lazy(() =>
  import('@/pages/Regions').then((m) => ({ default: m.RegionDetail })),
)

/** Every navigation starts at the top of the new page, not the old scroll offset. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const reduced = useReducedMotion()

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <SiteHeader />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 0.65, 0.3, 1] }}
          >
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/atlas" element={<Atlas />} />
                <Route path="/regions" element={<RegionsIndex />} />
                <Route path="/regions/:code" element={<RegionDetail />} />
                <Route path="/refineries" element={<RefineriesIndex />} />
                <Route path="/refineries/:slug" element={<RefineryDetail />} />
                <Route path="/countries/:slug" element={<CountryDetail />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  )
}
