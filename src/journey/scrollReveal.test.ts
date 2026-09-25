import { afterEach, expect, it, vi } from 'vitest'
import { attachScrollReveal } from './scrollReveal'

afterEach(() => vi.unstubAllGlobals())

it('waits for intersection, staggers visible elements, and cleans up', () => {
  let notify: (entries: unknown[]) => void = () => {}
  const observe = vi.fn(), disconnect = vi.fn(), stopChanges = vi.fn()
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof notify) { notify = callback }
    observe = observe
    unobserve = vi.fn()
    disconnect = disconnect
  })
  vi.stubGlobal('MutationObserver', class {
    observe = vi.fn()
    disconnect = stopChanges
  })
  vi.stubGlobal('window', { innerHeight: 900 })
  const nodes = Array.from({ length: 3 }, () => ({
    dataset: {} as Record<string, string>,
    style: { setProperty: vi.fn(), removeProperty: vi.fn() },
  }))
  const root = { querySelectorAll: () => nodes, contains: () => true } as unknown as HTMLElement
  const cleanup = attachScrollReveal(root)
  expect(observe).toHaveBeenCalledTimes(3)
  expect(nodes.map(node => node.dataset.scrollVisible)).toEqual(['false', 'false', 'false'])
  notify(nodes.slice(0, 2).map((target, i) => ({ target, isIntersecting: true, boundingClientRect: { top: 500, left: i * 100 } })))
  expect(nodes.map(node => node.dataset.scrollVisible)).toEqual(['true', 'true', 'false'])
  expect(nodes[1].style.setProperty).toHaveBeenCalledWith('--scroll-reveal-delay', '90ms')
  notify([{ target: nodes[0], isIntersecting: false, boundingClientRect: { top: 1000, height: 50 }, rootBounds: { bottom: 760 } }])
  expect(nodes[0].dataset.scrollVisible).toBe('false')
  notify([{ target: nodes[1], isIntersecting: false, boundingClientRect: { top: -200, height: 150 }, rootBounds: { bottom: 760 } }])
  expect(nodes[1].dataset.scrollVisible).toBe('true')
  cleanup()
  expect(disconnect).toHaveBeenCalledOnce()
  expect(stopChanges).toHaveBeenCalledOnce()
  expect(nodes[0].dataset.scrollReveal).toBeUndefined()
})
