// Explicit scope keeps the approved Hero and its motion untouched.
const revealSelector = [
  '.eh-experience--features .eh-experience__heading > *',
  '.eh-feature-browser__tab',
  '.eh-feature-browser__copy',
  '.eh-feature-browser__figure',
  '.pricing-section__heading > *',
  '.pricing-motion-stage',
  '.faq-section > header',
  '.faq-section__list > details',
].join(',')

export function attachScrollReveal(root: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const items = new Set<HTMLElement>()
  const observer = new IntersectionObserver(entries => {
    // Re-arm only after an item is below the entrance boundary. Scrolling back
    // to the section then reproduces the entrance without hiding content above.
    entries.forEach(entry => {
      if (!entry.isIntersecting && entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight) - entry.boundingClientRect.height * .1) {
        const item = entry.target as HTMLElement
        item.dataset.scrollVisible = 'false'
        item.style.setProperty('--scroll-reveal-delay', '0ms')
      }
    })
    entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((entry, index) => {
        const item = entry.target as HTMLElement
        item.style.setProperty('--scroll-reveal-delay', `${Math.min(index * 140, 1960)}ms`)
        item.dataset.scrollVisible = 'true'
      })
  }, { threshold: .08, rootMargin: '0px 0px -16% 0px' })
  const refresh = () => {
    items.forEach(item => {
      if (!root.contains(item)) { observer.unobserve(item); items.delete(item) }
    })
    root.querySelectorAll<HTMLElement>(revealSelector).forEach(item => {
      if (items.has(item)) return
      items.add(item)
      item.dataset.scrollReveal = 'true'
      item.dataset.scrollVisible = 'false'
      observer.observe(item)
    })
  }
  refresh()
  // A tab selection mounts a fresh description and screenshot.
  const changes = new MutationObserver(refresh)
  changes.observe(root, { childList: true, subtree: true })
  return () => {
    observer.disconnect()
    changes.disconnect()
    items.forEach(item => {
      delete item.dataset.scrollReveal
      delete item.dataset.scrollVisible
      item.style.removeProperty('--scroll-reveal-delay')
    })
  }
}
