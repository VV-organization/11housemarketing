import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { OneClientStory } from './OneClientStory'

describe('workflow transformation', () => {
  it('compares four manual tasks with four visible outcomes without playing a story', () => {
    const html = renderToStaticMarkup(<OneClientStory />)
    expect(html).toContain('Единый кабинет')
    expect(html.match(/aria-controls="eh-workflow-result-/g)).toHaveLength(4)
    expect(html.match(/id="eh-workflow-result-/g)).toHaveLength(4)
    expect(html).toContain('С вашей проверкой и трактовками')
    expect(html).not.toContain('workflow-metrics')
  })
  it('provides a real registration action and complete readable copy before animation', () => {
    const html = renderToStaticMarkup(<OneClientStory />)
    expect(html).toContain('https://app.elevenhouse.ai/auth?mode=register')
    expect(html).toContain('Не ещё один сервис.')
    expect(html).toContain('Переписка, данные и заметки рядом')
  })
})
