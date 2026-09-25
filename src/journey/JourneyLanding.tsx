import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { CosmicHero } from '../components/CosmicHero'
import { LandingHeader } from '../components/LandingHeader'
import { OneClientStory } from '../sections/OneClientStory'
import { PractitionerResults } from '../sections/PractitionerResults'
import { PricingCardsSection } from '../sections/PricingCardsSection'
import { FaqSection } from '../sections/FaqSection'
import { ProductExperience } from './ProductExperience'
import './finaleHand.css'
import { FinaleFooter } from './FinaleFooter'
import { JourneySceneAdapter } from './JourneySceneAdapter'
import { attachOpeningScrollCompletion } from './openingScrollCompletion'
import { clamp01, sampleJourneyScene, type JourneyLayout } from './journeyMotion'
import { attachScrollReveal } from './scrollReveal'
import './scrollReveal.css'
import './journey.css'
import './visualSystem.css'
import './copyAlignment.css'
import './sectionLayout.css'
import './heroTypeTrial.css'
import './finaleEditorial.css'
import { CelestialSphere } from './CelestialSphere'
import './openingEditorial.css'

// Keep the section available for a later launch without mounting its animations.
const showPractitionerResults = false

const navigationTargets = {
  '#product-proof-title': '#journey-workspace',
  '#ai-routine-title': '#journey-access',
} as const

export function JourneyLanding() {
  const rootRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const finaleRef = useRef<HTMLElement>(null)
  const scrollAdapter = useMemo(() => new JourneySceneAdapter(), [])
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion')))
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return
    return attachScrollReveal(rootRef.current)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    return attachOpeningScrollCompletion(window, document, () => {
      const access = rootRef.current?.querySelector('#journey-access')
      const headerHeight = rootRef.current?.querySelector('.landing-header')?.getBoundingClientRect().height ?? 96
      return access ? access.getBoundingClientRect().top + window.scrollY - headerHeight - 12 : Infinity
    })
  }, [reducedMotion])


  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches
      || (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion')))
    media.addEventListener('change', update)
    const frame = window.requestAnimationFrame(() => setReady(true))
    return () => { media.removeEventListener('change', update); window.cancelAnimationFrame(frame) }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    const intro = introRef.current
    const finale = finaleRef.current
    if (!root || !intro || !finale) return
    const openingStage = intro.querySelector<HTMLElement>('.eh-journey__opening-stage')
    const finaleStage = finale.querySelector<HTMLElement>('.eh-journey__finale-stage')
    let frame = 0
    let measureFrame = 0
    let layout: JourneyLayout = { viewport: window.innerHeight, chapterStarts: [], finaleTop: Infinity }
    const pageTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY
    const measure = () => {
      measureFrame = 0
      layout = {
        viewport: window.innerHeight,
        chapterStarts: Array.from(root.querySelectorAll('[data-chapter]')).map(pageTop),
        finaleTop: pageTop(finale),
      }
      scrollAdapter.restore(sampleJourneyScene(window.scrollY, layout))
      update()
    }
    const update = () => {
      const y = window.scrollY
      const headerHeight = root.querySelector('.landing-header')?.getBoundingClientRect().height ?? 96
      const atFinale = y + headerHeight >= layout.finaleTop - 1
      root.dataset.finale = String(atFinale)
      root.style.setProperty('--finale-header-clearance', `${headerHeight}px`)
      root.dataset.reading = y > intro.offsetHeight * 0.6 && !atFinale ? 'true' : 'false'
      scrollAdapter.setTarget(sampleJourneyScene(y, layout))
      const introProgress = clamp01(y / Math.max(1, intro.offsetHeight - window.innerHeight))
      intro.style.setProperty('--opening-opacity', String(1 - clamp01((introProgress - 0.6) / 0.4)))
      if (openingStage) openingStage.inert = !reducedMotion && introProgress >= 0.99
      // Reading sections must never be translated, clipped or skipped on the way to the finale.
      if (finaleStage) finaleStage.inert = !reducedMotion && layout.finaleTop - y >= window.innerHeight
    }
    const advance = (frameTime: number) => {
      if (document.visibilityState !== 'hidden' && !reducedMotion) scrollAdapter.advance(frameTime)
      frame = window.requestAnimationFrame(advance)
    }
    const scheduleMeasure = () => {
      if (!measureFrame) measureFrame = window.requestAnimationFrame(measure)
    }
    const restore = () => {
      scrollAdapter.restore(sampleJourneyScene(window.scrollY, layout))
      update()
    }
    const resize = new ResizeObserver(scheduleMeasure)
    resize.observe(root)
    root.querySelectorAll('[data-chapter], .eh-journey__commercial').forEach((element) => resize.observe(element))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', scheduleMeasure, { passive: true })
    window.addEventListener('pageshow', restore)
    document.addEventListener('visibilitychange', restore)
    measure()
    if (!reducedMotion) frame = window.requestAnimationFrame(advance)
    return () => {
      resize.disconnect()
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(measureFrame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('pageshow', restore)
      document.removeEventListener('visibilitychange', restore)
    }
  }, [reducedMotion, scrollAdapter])

  const openSection = (target: string) => {
    const anchor = document.querySelector<HTMLElement>(target)
    const destination = anchor?.closest<HTMLElement>('section') ?? anchor
    if (destination) {
      const headerHeight = rootRef.current?.querySelector('.landing-header')?.getBoundingClientRect().height ?? 96
      const inset = target === '#top' ? 0 : headerHeight + 12
      // Section bounds are stable; reveal-animated headings are not navigation targets.
      window.scrollTo({ top: Math.max(0, destination.getBoundingClientRect().top + window.scrollY - inset), behavior: reducedMotion ? 'instant' : 'smooth' })
    }
    if (destination) {
      destination.tabIndex = -1
      destination.focus({ preventScroll: true })
    }
  }
  const navigate = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault()
    openSection(target)
  }

  return (
    <div className="eh-journey" ref={rootRef} data-motion={reducedMotion ? 'reduced' : 'full'} data-ready={ready}>
      <CosmicHero key={reducedMotion ? 'reduced' : 'full'} backgroundOnly handoffPhase="tunnel" onEnterStory={() => {}} scrollAdapter={scrollAdapter} runwayStyle={{}} />
      <LandingHeader onNavigate={navigate} destinations={navigationTargets} />
      <a className="eh-journey__skip" href="#journey-access">Перейти к знакомству с приложением</a>
      <main className="eh-journey__story">
        <section id="top" tabIndex={-1} className="eh-journey__opening eh-hero-type-trial eh-opening-editorial" ref={introRef} aria-labelledby="journey-title">
          <div className="eh-journey__opening-stage">
            <div className="eh-opening-editorial__copy">
            <h1 id="journey-title" className="eh-journey__split-title">
              <span className="eh-journey__split-start"><span><span className="eh-optical-letter eh-optical-letter--head"><span className="eh-optical-letter__base">В</span><span className="eh-optical-letter__echo" aria-hidden="true">В</span></span>ся практик<span className="eh-optical-letter eh-optical-letter--bend"><span className="eh-optical-letter__base">а</span><span className="eh-optical-letter__echo" aria-hidden="true">а</span></span><br />астролога</span></span>
              <span className="eh-journey__split-end"><span>в одном приложени<span className="eh-optical-letter eh-optical-letter--tail"><span className="eh-optical-letter__base">и</span><span className="eh-optical-letter__echo" aria-hidden="true">и</span></span></span></span>
            </h1>
            <p className="eh-journey__opening-description">Карты, клиенты, запись, оплаты и AI-помощник — чтобы меньше заниматься рутиной и больше консультировать.</p>
            <a className="eh-journey__start" href="https://app.elevenhouse.ai/auth?mode=register">Начать бесплатно</a>
            <p className="eh-opening-free-note">Бесплатный тариф без ограничения по времени</p>
            </div>
            <CelestialSphere />
            <a className="eh-journey__explore" href="#journey-access" aria-label="Посмотреть возможности ElevenHouse"><span className="eh-journey__explore-label">Посмотреть возможности</span><span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <ProductExperience reducedMotion={reducedMotion} onNavigate={openSection} />
        <div id="journey-commercial" tabIndex={-1} className="landing-sections eh-journey__commercial" data-entered="true" data-motion={reducedMotion ? 'reduced' : 'full'}>
          <OneClientStory />
          {showPractitionerResults && <PractitionerResults />}
          <PricingCardsSection />
          <FaqSection />
        </div>
        <section className="eh-journey__finale eh-finale-hand-trial eh-finale-type-trial eh-finale-editorial" id="journey-finale" tabIndex={-1} ref={finaleRef} aria-labelledby="journey-finale-title">
          <div className="eh-journey__finale-stage">
            <div className="eh-finale-hand-copy">
            <h2 id="journey-finale-title" className="eh-journey__split-title">
              <span className="eh-journey__split-start"><span><span className="eh-optical-letter eh-optical-letter--head"><span className="eh-optical-letter__base">М</span><span className="eh-optical-letter__echo" aria-hidden="true">М</span></span>еньше времен<span className="eh-optical-letter eh-optical-letter--bend"><span className="eh-optical-letter__base">и</span><span className="eh-optical-letter__echo" aria-hidden="true">и</span></span><br />на рутину</span></span>
              <span className="eh-journey__split-end"><span>больше<br />на консультаци<span className="eh-optical-letter eh-optical-letter--tail"><span className="eh-optical-letter__base">и</span><span className="eh-optical-letter__echo" aria-hidden="true">и</span></span></span></span>
            </h2>
            <div className="eh-journey__finale-action">
              <a className="eh-journey__start" href="https://app.elevenhouse.ai/auth?mode=register">Начать бесплатно</a>
            <p className="eh-finale-editorial__subtitle">Ведите практику в одном кабинете с помощью Eleven House</p>
            </div>
            </div>
            <FinaleFooter />
          </div>
        </section>
      </main>
    </div>
  )
}
