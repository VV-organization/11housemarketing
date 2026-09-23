import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ProductExperience } from './ProductExperience'

const render = () => renderToStaticMarkup(<ProductExperience reducedMotion onNavigate={() => {}} />)

describe('feature screenshot navigation', () => {
  it('shows nine accessible tabs with the calendar selected immediately', () => {
    const html = render().split('id="journey-workspace"')[1]
    expect(html.match(/role="tab"/g)).toHaveLength(9)
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1)
    expect(html).toMatch(/role="tab"[^>]*aria-selected="true"[^>]*>[\s\S]*?Календарь/)
    expect(html).toContain('role="tabpanel"')
  })
  it('shows useful content and a real screenshot before any interaction', () => {
    const html = render().split('id="journey-workspace"')[1]
    expect(html).toContain('Встреча начинается с удобной записи')
    expect(html).toContain('Настройте доступное время')
    expect(html).toContain('eh-p01-calendar.webp')
    expect(html).toContain('Увеличить экран')
    expect(html).not.toContain('Все возможности')
    expect(html).not.toContain('eh-walkthrough')
  })
})
