import { pricingActionLabel, pricingPlans, pricingRegistrationUrl } from './pricingData'
import monogram from '../assets/brand/eh-monogram-gold.svg'
import './pricingCards.css'
import './pricingAtmosphere.css'

// Reference: supplied ElevenHouse preview, price-first cards with the CTA above features.
export function PricingCardsSection() {
  return <section className="pricing-section eh-pricing-cards" id="pricing" aria-labelledby="pricing-title">
    <header className="pricing-section__heading">
      <h2 id="pricing-title">Начните бесплатно.</h2>
      <p className="pricing-section__subtitle">Расширяйте возможности по мере роста.</p>
      <p>Полноценная практика — на Start. AI и ваши автоматизации — в подписке.</p>
    </header>
    <div className="pricing-motion-stage eh-pricing-cards__grid">
      {pricingPlans.map(plan => <article className="eh-pricing-cards__card" data-plan={plan.key} aria-labelledby={`pricing-${plan.key}-title`} key={plan.key}>
        <div className="eh-price-atmosphere" aria-hidden="true">
          <svg viewBox="0 0 420 150" preserveAspectRatio="none">
            <path d="M130 160C235 80 292 153 430 28" />
            <path d="M170 160C270 46 334 129 430 61" />
            <path d="M215 165C281 97 356 148 428 94" />
            <circle cx="339" cy="103" r="2" />
            <circle cx="382" cy="70" r="1" />
          </svg>
        </div>
        <div className="eh-pricing-cards__top"><img src={monogram} width={44} height={44} alt="" />{plan.key === 'pro' && <span>Рекомендуем</span>}</div>
        <header className="eh-pricing-cards__name"><h3 id={`pricing-${plan.key}-title`}>{plan.name}</h3><span>{plan.capacityTitle}</span></header>
        <p className="eh-pricing-cards__audience">{plan.audience}</p>
        <p className="eh-pricing-cards__price"><strong>{plan.price}</strong><span>/ {plan.period}</span></p>
        <p className="eh-pricing-cards__commission">{plan.commissionLabel} — <strong>{plan.commission}</strong></p>
        <a className="eh-pricing-cards__action" href={pricingRegistrationUrl}>{pricingActionLabel(plan)}</a>
        <p className="eh-pricing-cards__includes">{plan.includesLabel}</p>
        <ul>{plan.cardPoints.filter(point => point !== 'Всё из Start' && point !== 'Всё из Team Pro').map(point => <li key={point}>{point}</li>)}</ul>
        <footer><p>{plan.capacityDetail}</p><p>{plan.note}</p></footer>
      </article>)}
    </div>
    <div className="eh-pricing-cards__terms"><p>Клиенты, консультации и платежи — без ограничений по количеству. Без триала: Start доступен постоянно.</p><p>* Макет: комиссии и лимиты AI, хранения и видеосвязи предварительные. Финальные условия нужно подтвердить до публикации.</p></div>
  </section>
}
