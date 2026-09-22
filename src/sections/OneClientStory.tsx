import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '../journey/SourceIcons'
import monogram from '../assets/brand/eh-monogram-gold.svg'
import wordmark from '../assets/brand/eleven-house-stacked.svg'
import './workflowComparison.css'

// Composition and copy: the user-supplied ElevenHouse design preview, #comparison.
const comparisonRows = [
  { icon: 'chat', manual: 'Переписки и таблицы', friction: 'История клиента по частям', result: 'Единая история клиента', detail: 'Переписка, данные и заметки рядом' },
  { icon: 'calendar', manual: 'Запись вручную', friction: 'Согласования в сообщениях', result: 'Онлайн-запись', detail: 'Встречи сразу в вашем календаре' },
  { icon: 'wallet', manual: 'Ссылки на оплату', friction: 'Отдельно от самой услуги', result: 'Оплата выбранной услуги', detail: 'Продукт, покупка и клиент связаны' },
  { icon: 'content', manual: 'Разбор с нуля', friction: 'Ручная подготовка к встрече', result: 'Карта и AI-черновик', detail: 'С вашей проверкой и трактовками' },
] as const

export function OneClientStory() {
  const stage = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [motion, setMotion] = useState(false)

  useEffect(() => {
    const element = stage.current
    if (!element) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const previewReduced = import.meta.env.DEV && new URLSearchParams(window.location.search).has('reduced-motion')
    const items = Array.from(element.querySelectorAll<HTMLElement>('[data-reveal]'))
    let observer: IntersectionObserver | undefined
    const configure = () => {
      observer?.disconnect()
      const enabled = !media.matches && !previewReduced && 'IntersectionObserver' in window
      setMotion(enabled)
      if (!enabled) {
        items.forEach(item => { item.dataset.revealed = 'true' })
        return
      }
      observer = new IntersectionObserver((entries) => {
        const visible = entries.filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        visible.forEach((entry, index) => {
          const item = entry.target as HTMLElement
          item.style.setProperty('--reveal-delay', `${Math.min(index * 160, 640)}ms`)
          item.dataset.revealed = 'true'
          observer?.unobserve(item)
        })
      }, { threshold: .18, rootMargin: '0px 0px -8% 0px' })
      items.filter(item => item.dataset.revealed !== 'true').forEach(item => observer?.observe(item))
    }
    configure()
    media.addEventListener('change', configure)
    return () => { observer?.disconnect(); media.removeEventListener('change', configure) }
  }, [])

  return <section className="eh-workflow-shift" id="workflow-compare" aria-labelledby="workflow-compare-title" ref={stage} data-animate={motion}>
    <div className="eh-workflow-shift__inner">
      <header className="eh-workflow-shift__intro">
        <div data-reveal><h2 id="workflow-compare-title">Меньше рутины.<br /><span>Больше времени<br />на клиентов.</span></h2></div>
        <p className="eh-workflow-shift__lead" data-reveal>Та же практика.<br /><span>Совсем другой рабочий день.</span></p>
      </header>

      <div className="eh-workflow-shift__stage">
        <div className="eh-workflow-shift__manual">
          <header data-reveal><h3>Ручной режим</h3><p>Каждая задача — в отдельном месте</p></header>
          <div className="eh-workflow-shift__fragments">
            {comparisonRows.map((row, index) => {
              const RowIcon = Icon[row.icon]
              return <button key={row.manual} type="button" className="eh-workflow-shift__fragment" data-reveal aria-pressed={active === index} aria-controls={`eh-workflow-result-${index}`} style={{ '--row': index } as CSSProperties} onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setActive(index) }}>
                <RowIcon size={23} /><span><strong>{row.manual}</strong><small>{row.friction}</small></span><span className="eh-workflow-shift__disconnect" aria-hidden="true">×</span>
              </button>
            })}
          </div>
        </div>

        <div className="eh-workflow-shift__bridge" data-reveal aria-hidden="true">
          <svg viewBox="0 0 160 440" fill="none" preserveAspectRatio="none">
            {[55, 165, 275, 385].map((y, index) => <g key={y} data-active={active === index} style={{ '--row': index } as CSSProperties}>
              <path className="eh-workflow-shift__track" d={`M 0 ${y} C 65 ${y}, 40 220, 80 220 S 115 ${y}, 160 ${y}`} />
              <path className="eh-workflow-shift__signal" pathLength="1" d={`M 0 ${y} C 65 ${y}, 40 220, 80 220 S 115 ${y}, 160 ${y}`} />
            </g>)}
          </svg>
          <span className="eh-workflow-shift__hub"><img src={monogram} alt="" width={34} height={34} /></span>
          <span className="eh-workflow-shift__mobile-arrow">↓</span>
        </div>

        <div className="eh-workflow-shift__system" data-reveal>
          <header className="eh-workflow-shift__system-heading"><img src={wordmark} width={102} height={62} alt="ElevenHouse" /><div><h3>Единый кабинет</h3></div></header>
          <div className="eh-workflow-shift__results">
            {comparisonRows.map((row, index) => <article id={`eh-workflow-result-${index}`} key={row.result} className="eh-workflow-shift__result" data-active={active === index} style={{ '--row': index } as CSSProperties}>
              <span className="eh-workflow-shift__check" aria-hidden="true"><Icon.check size={19} /></span><div><h4>{row.result}</h4><p>{row.detail}</p></div><span className="eh-workflow-shift__result-number" aria-hidden="true">0{index + 1}</span>
            </article>)}
          </div>
        </div>
      </div>

      <footer className="eh-workflow-shift__closing"><p data-reveal>Не ещё один сервис.</p><div data-reveal><a href="https://app.elevenhouse.ai/auth?mode=register">Попробовать бесплатно <Icon.arrowUR size={19} /></a></div></footer>
    </div>
  </section>
}
