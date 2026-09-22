import { describe, expect, it } from 'vitest'
// @ts-expect-error Vitest runs in Node, while the app tsconfig intentionally omits Node types.
import { readFileSync } from 'node:fs'

import heroNarrativeSource from '../hero/heroNarrative.ts?raw'
import heroComponentSource from '../components/CosmicHero.tsx?raw'
import { onboardingSteps, productScenes } from './ProductProof'
import { pricingPlans } from './pricingData'
const readRaw = (source: Record<string, unknown>) => Object.values(source)[0] as string
const stylesSource = readFileSync(new URL('../styles.css', import.meta.url), 'utf8')
const componentSource = Object.values(
  import.meta.glob('../components/*.tsx', { eager: true, query: '?raw', import: 'default' }),
).join('\n')

const sectionSource = [
  readRaw(import.meta.glob('./OneClientStory.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./ProductProof.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./AiRoutine.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./UnifiedWorkspace.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./PricingSection.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./FaqSection.tsx', { eager: true, query: '?raw', import: 'default' })),
  readRaw(import.meta.glob('./FinalCta.tsx', { eager: true, query: '?raw', import: 'default' })),
].join('\n')

const faqSource = readRaw(import.meta.glob('./FaqSection.tsx', { eager: true, query: '?raw', import: 'default' }))
const clientStorySource = readRaw(
  import.meta.glob('./OneClientStory.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const pricingSectionSource = readRaw(
  import.meta.glob('./PricingSection.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const pricingOrbitSource = readRaw(
  import.meta.glob('./PricingOrbit.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const aiRoutineSource = readRaw(
  import.meta.glob('./AiRoutine.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const workspaceSource = readRaw(
  import.meta.glob('./UnifiedWorkspace.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const practitionerSource = Object.values(import.meta.glob('./PractitionerResults.tsx', {
  eager: true, query: '?raw', import: 'default',
})).join('\n')
const journeySource = readRaw(
  import.meta.glob('../journey/JourneyLanding.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const finalCtaSource = readRaw(
  import.meta.glob('./FinalCta.tsx', { eager: true, query: '?raw', import: 'default' }),
)
const productProofSource = readRaw(
  import.meta.glob('./ProductProof.tsx', { eager: true, query: '?raw', import: 'default' }),
)

describe('marketing brief copy contract', () => {
  it('uses the category-first Hero message and registration CTA', () => {
    expect(heroNarrativeSource).toContain("title: 'Вся практика астролога'")
    expect(heroNarrativeSource).toContain("title: 'в одном кабинете'")
    expect(heroNarrativeSource).toContain("title: 'ElevenHouse'")
    expect(heroComponentSource).toContain('Создать кабинет')
    expect(heroComponentSource).toContain('Бесплатно без банковской карты')
  })

  it('includes the approved desktop and mobile header navigation', () => {
    const headerCopy = [
      'Возможности',
      'Тарифы',
      'Вопросы',
      'Войти',
      'Начать бесплатно',
    ]

    headerCopy.forEach((copy) => expect(componentSource).toContain(copy))
    expect(componentSource).toContain('aria-label="Основная навигация"')
  })

  it('uses the approved benefit-first section headings', () => {
    const headings = [
      'От построения карты до оплаты —<br />один рабочий процесс.',
      'AI берёт рутину на себя.<br />Последнее слово — за вами.',
      'Один кабинет вместо<br />нескольких сервисов.',
      '<h2 id="pricing-title">Начните бесплатно.</h2>',
      '<p className="pricing-section__subtitle">Расширяйте возможности по мере роста.</p>',
      'Есть вопросы? Давайте разберёмся.',
      'Соберите практику<br />в одном кабинете.',
    ]

    headings.forEach((heading) => expect(sectionSource).toContain(heading))
  })

  it('keeps the Hero finale split and uses the approved client-story heading', () => {
    expect(heroComponentSource).toContain('hero-finale__part--start')
    expect(heroComponentSource).toContain('hero-finale__part--end')
    expect(heroComponentSource).toMatch(/больше\s*<br \/>\s*на консультацию/)
    expect(heroComponentSource).not.toContain('Больше времени на консультации')
    expect(clientStorySource).not.toContain('client-story__title-part')
    expect(clientStorySource).not.toContain('client-story__header')
    expect(clientStorySource).toContain('Меньше рутины.')
    expect(clientStorySource).toContain('Больше времени<br />на клиентов.')
  })

  it('shows four setup steps followed by five benefit-led product screens', () => {
    expect(onboardingSteps.map((step) => step.title)).toEqual([
      'Зарегистрировались и заполнили профиль',
      'Добавили услуги и опубликовали личную страницу',
      'Настроили запись, оплату и автоматизацию',
      'Проводите консультации, а система напоминает клиентам и помогает возвращать их',
    ])
    expect(productScenes).toHaveLength(5)
    expect(productScenes.map((scene) => scene.eyebrow)).toEqual([
      'Карта и AI-черновик',
      'Клиенты и история',
      'Услуги и личная страница',
      'Запись и оплаты',
      'Аналитика',
    ])
    expect(sectionSource).toContain('Настройте кабинет за четыре шага')
    expect(sectionSource).not.toContain('04 · Возможности')
    expect(sectionSource).toContain('От построения карты до оплаты —<br />один рабочий процесс.')
    expect(sectionSource).toContain(
      'А ещё внутри: астрокалендарь, воронки, контент и подписки, справочник и дополнительные системы расчётов.',
    )
    expect(sectionSource).not.toContain('02 · Расчёты и профессиональный контекст')
    expect(sectionSource).not.toContain('03 · Запись и консультация')
  })

  it('stages onboarding as a centered Produx-style puzzle before the process chapter', () => {
    const captions = [
      'Профиль и данные практики собраны в одном рабочем пространстве.',
      'Клиент сразу видит формат, стоимость и переходит к записи.',
      'Время, предоплата и напоминания работают без ручной переписки.',
      'После консультации система помогает продолжить контакт и вернуть клиента.',
    ]

    expect(productProofSource).toContain('<OnboardingPuzzle')
    expect(productProofSource).toContain('onboardingPuzzleRef.current?.render(onboardingProgress)')
    expect(productProofSource).toContain('const onboardingProgress = clamp01(progress / 0.42)')
    expect(productProofSource).toContain('const processProgress = clamp01((progress - 0.4) / 0.6)')
    expect(productProofSource).not.toContain('className="product-proof__onboarding"')
    captions.forEach((caption) => expect(productProofSource).toContain(caption))

    expect(stylesSource).toMatch(/@media \(min-width: 901px\)[\s\S]*?\.product-proof\s*\{[\s\S]*?height:\s*1540svh/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__copy[\s\S]*?text-align:\s*center/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__copy h3,[\s\S]*?font-size:\s*clamp\(0\.74rem, 0\.92vw, 0\.94rem\)/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__copy h3 \{[\s\S]*?white-space:\s*nowrap/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__grid[\s\S]*?grid-template-columns:\s*repeat\(7, minmax\(0, 1fr\)\)/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__media[\s\S]*?perspective:\s*1200px/)
    expect(stylesSource).toContain('background-size: 700% 400%')
    expect(stylesSource).toContain('width: calc(100% + 1px)')
    expect(stylesSource).toMatch(/\.onboarding-puzzle__grid > span[\s\S]*?rotateX\(var\(--puzzle-rotate-x\)\)[\s\S]*?rotateY\(var\(--puzzle-rotate-y\)\)/)
    expect(stylesSource).toMatch(/\.onboarding-puzzle__focus-glow[\s\S]*?opacity:\s*var\(--puzzle-lens-opacity\)/)
    expect(stylesSource).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.onboarding-puzzle__desktop[\s\S]*?display:\s*none/)
    expect(stylesSource).toMatch(/\.product-proof\[data-motion="reduced"\][\s\S]*?\.onboarding-puzzle__desktop[\s\S]*?display:\s*none/)
  })

  it('renders the product process as a semantic stack of atmospheric interface cards', () => {
    expect(productProofSource).toContain('data-proof-card')
    expect(productProofSource).toContain('proof-card__media')
    expect(productProofSource).toContain('proof-card__number')
    expect(productProofSource).toContain('proof-card__title')
    expect(productProofSource).toContain('proof-card__footer')
    expect(productProofSource).not.toContain('proof-scene__frame')
    expect(stylesSource).toMatch(
      /\.product-proof \.proof-card \{[\s\S]*?background-color:\s*#070b17;/,
    )
  })

  it('explains the human-reviewed AI handoff as one causal sequence', () => {
    const steps = [
      'Клиент оставил данные',
      'Система построила карту',
      'AI подготовил черновик',
      'Астролог проверил и дополнил',
      'Клиент получил результат',
    ]

    steps.forEach((step) => expect(aiRoutineSource).toContain(step))
    expect(aiRoutineSource).toContain(
      'AI считает и готовит черновик по вашим трактовкам и в вашем тоне. Последнее слово всегда за вами',
    )
  })

  it('compares the usual paid tool stack with one ElevenHouse workspace', () => {
    const externalTools = [
      'Программа расчётов',
      'Таблица или CRM',
      'Taplink или сайт',
      'Бот и рассылки',
      'Онлайн-запись',
      'Платёжный сервис',
    ]

    externalTools.forEach((tool) => expect(workspaceSource).toContain(tool))
    expect(workspaceSource).toContain('≈5 280 ₽ / месяц')
    expect(workspaceSource).toContain('ElevenHouse')
    expect(workspaceSource).not.toContain('unified-workspace__index')
  })

  it('preserves practitioner results after the CRM journey and before pricing', () => {
    expect(practitionerSource.match(/monogram:/g) ?? []).toHaveLength(3)
    expect(practitionerSource).toContain('Марина К.')
    expect(practitionerSource).toContain('Дарья Л.')
    expect(practitionerSource).toContain('Виктор М.')
    expect(practitionerSource).toContain('+33% клиентов')
    expect(practitionerSource).toContain('18 продаж на автопилоте')
    expect(practitionerSource).toContain('+47% к среднему чеку')

    const journeyPosition = journeySource.indexOf('<ProductExperience ')
    const resultsPosition = journeySource.indexOf('<PractitionerResults />')
    const pricingPosition = journeySource.indexOf('<PricingSection />')
    expect(journeyPosition).toBeGreaterThan(-1)
    expect(journeyPosition).toBeLessThan(resultsPosition)
    expect(resultsPosition).toBeLessThan(pricingPosition)
  })

  it('connects four separate tasks to one unified workspace', () => {
    const copy = [
      'Переписки и таблицы', 'Единая история клиента',
      'Запись вручную', 'Онлайн-запись',
      'Ссылки на оплату', 'Оплата выбранной услуги',
      'Разбор с нуля', 'Карта и AI-черновик',
      'С вашей проверкой и трактовками', 'Единый кабинет',
    ]
    copy.forEach((text) => expect(clientStorySource).toContain(text))
    expect(clientStorySource).not.toContain('workflow-compare__source')
    expect(clientStorySource).not.toContain('<WorkflowMetrics')
    expect(clientStorySource).toContain('aria-controls={`eh-workflow-result-${index}`}')
    expect(journeySource.indexOf('<OneClientStory />')).toBeGreaterThan(journeySource.indexOf('<ProductExperience '))
    expect(journeySource.indexOf('<OneClientStory />')).toBeLessThan(journeySource.indexOf('<PricingSection />'))
  })

  it('contains the six FAQ questions from the supplied reference', () => {
    const faqQuestions = [
      "Как начать пользоваться?",
      "Можно работать с текущими клиентами?",
      "Как устроены оплаты?",
      "Что делает AI, а что остаётся за мной?",
      "Можно пользоваться сервисом без AI?",
      "Что произойдёт, если отменить подписку?"
]
    faqQuestions.forEach((question) => expect(faqSource).toContain(question))
    expect(faqSource.match(/"question":/g) ?? []).toHaveLength(6)
  })

  it('keeps the approved tariff economics and confirmed final links', () => {
    expect(pricingPlans.map((plan) => [plan.name, plan.price, plan.commission])).toEqual([
      ['Start', '0 ₽', '8%*'],
      ['Team Pro', '2 490 ₽', '6%*'],
      ['Studio', '4 990 ₽', '5%*'],
    ])
    expect(finalCtaSource).toContain('https://app.elevenhouse.ai/auth?mode=register')
    expect(finalCtaSource).toContain('Без банковской карты')
    expect(finalCtaSource).toContain('mailto:hello@elevenhouse.ai')
    expect(finalCtaSource).toContain('mailto:support@elevenhouse.ai')
    expect(finalCtaSource).toContain('https://t.me/elevenhouse_support')
    expect(finalCtaSource).toContain('href="/privacy"')
    expect(finalCtaSource).toContain('href="/personal-data-processing"')
    expect(finalCtaSource).not.toContain('будут добавлены')
  })

  it('uses a synchronized hold-transition pricing scene', () => {
    expect(pricingSectionSource).toContain('<PricingOrbit')
    expect(pricingSectionSource).not.toContain('pricing-details')
    expect(pricingOrbitSource).toContain('pricing-card-action')
    expect(pricingSectionSource).not.toContain('pricing-section__plans')
    expect(pricingOrbitSource).toContain('<PricingWebGLStage')
    expect(pricingOrbitSource).toContain('pricing-orbit-fallback')
    expect(pricingOrbitSource).toContain('data-motion-phase')
    expect(pricingOrbitSource).not.toContain('pricing-orbit-reflection')
    expect(pricingOrbitSource).not.toContain('pricing-orbit__spectral-edge')
  })

})
