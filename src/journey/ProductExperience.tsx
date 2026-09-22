import { AccessFragment } from './AccessFragment'
import { FeatureScreenshotBrowser } from './FeatureScreenshotBrowser'
import './sourceFragments.css'
import './productExperience.css'
import './textBackplates.css'

// Temporarily hide the introduction; keep its implementation available to restore.
const showAccessIntro = false

export function ProductExperience({ reducedMotion, onNavigate }: { reducedMotion: boolean; onNavigate: (target: string) => void }) {
  return <>
    {showAccessIntro && <section className="eh-experience eh-experience--access" id="journey-access" data-chapter="access" aria-labelledby="access-title" tabIndex={-1}>
      <header className="eh-experience__heading"><p className="eh-journey__eyebrow">ЗНАКОМСТВО С ELEVENHOUSE</p><h2 id="access-title">Всё начинается с вас</h2></header>
      <AccessFragment reducedMotion={reducedMotion} onEnter={() => onNavigate('#journey-workspace')} />
    </section>}
    <section className="eh-experience eh-experience--features" id="journey-workspace" data-chapter="workspace" aria-labelledby="features-title" tabIndex={-1}>
      {/* Preserve existing entry links and opening-scroll destination without an empty section. */}
      {!showAccessIntro && <span id="journey-access" tabIndex={-1} style={{ position: 'absolute', top: 0, left: 0 }} />}
      <header className="eh-experience__heading">
        <h2 id="features-title">От записи клиента до консультации — всё под рукой</h2>
        <p>Выберите задачу и посмотрите, как она устроена. Без регистрации.</p>
      </header>
      <FeatureScreenshotBrowser />
    </section>
  </>
}
