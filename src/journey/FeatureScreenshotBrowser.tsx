import { useRef, useState, type KeyboardEvent } from 'react'
import { featureChoiceIcons } from './featureChoiceIcons'
import { featureScreenshots } from './featureScreenshots'
import './featureScreenshotBrowser.css'

export function FeatureScreenshotBrowser() {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const dialog = useRef<HTMLDialogElement>(null)
  const feature = featureScreenshots[selected]

  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = featureScreenshots.length - 1
    let next: number
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % (last + 1); break
      case 'ArrowLeft': next = (index + last) % (last + 1); break
      case 'Home': next = 0; break
      case 'End': next = last; break
      default: return
    }
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus({ preventScroll: true })
  }

  const enlarge = () => {
    setZoomed(true)
    dialog.current?.showModal()
  }

  return <div className="eh-feature-browser">
    <div className="eh-feature-browser__tabs" role="tablist" aria-label="Возможности ElevenHouse">
      {featureScreenshots.map((item, index) => <button
        key={item.id}
        ref={(element) => { tabs.current[index] = element }}
        type="button"
        role="tab"
        id={`eh-feature-tab-${item.id}`}
        aria-selected={selected === index}
        aria-controls="eh-feature-panel"
        tabIndex={selected === index ? 0 : -1}
        className="eh-feature-browser__tab"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setSelected(index)
        }}
        onClick={() => setSelected(index)}
        onKeyDown={(event) => navigateTabs(event, index)}
      ><img src={featureChoiceIcons[item.id]} width={21} height={21} alt="" aria-hidden="true" /><span>{item.label}</span></button>)}
    </div>

    <div id="eh-feature-panel" role="tabpanel" aria-labelledby={`eh-feature-tab-${feature.id}`} tabIndex={0} className="eh-feature-browser__panel" key={feature.id}>
      <div className="eh-feature-browser__copy">
        <h3>{feature.title}</h3>
        <p className="eh-feature-browser__description">{feature.description}</p>
        <ol className="eh-feature-browser__steps">{feature.steps.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol>
        {feature.note && <p className="eh-feature-browser__note">{feature.note}</p>}
      </div>
      <figure className="eh-feature-browser__figure">
        <button type="button" className="eh-feature-browser__screen" onClick={enlarge} aria-label={`Увеличить: ${feature.caption}`} aria-haspopup="dialog">
          <img src={feature.image} width={feature.imageWidth} height={feature.imageHeight} alt={feature.caption} loading="lazy" decoding="async" />
          <span className="eh-feature-browser__zoom-icon" aria-hidden="true">↗</span>
        </button>
        <figcaption><span>{feature.caption}</span><button type="button" onClick={enlarge} aria-haspopup="dialog">Увеличить экран <span aria-hidden="true">↗</span></button></figcaption>
      </figure>
    </div>

    <dialog ref={dialog} className="eh-feature-browser__dialog" aria-labelledby="eh-feature-dialog-title" onClose={() => setZoomed(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="eh-feature-browser__dialog-content">
        <div className="eh-feature-browser__dialog-heading"><h3 id="eh-feature-dialog-title">{feature.caption}</h3><button type="button" onClick={() => dialog.current?.close()} autoFocus aria-label="Закрыть скриншот">Закрыть <span aria-hidden="true">×</span></button></div>
        {zoomed && <div className="eh-feature-browser__zoom-scroll"><img src={feature.image} width={feature.imageWidth} height={feature.imageHeight} alt={feature.caption} /></div>}
        <p>На узком экране скриншот можно прокрутить в стороны.</p>
      </div>
    </dialog>
  </div>
}
