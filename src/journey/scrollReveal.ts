// Reveal meaningful content groups individually; avoid hiding an entire tall section.
const revealSelector = [
  '.landing-header__brand, .landing-header__nav > a, .landing-header__actions > a',
  '.eh-opening-editorial__copy > p, .eh-opening-editorial__copy > a',
  '.eh-celestial-sphere, .eh-journey__explore',
  '.eh-experience--features .eh-experience__heading > *',
  '.eh-feature-browser__tab',
  '.eh-feature-browser__copy > h3, .eh-feature-browser__description',
  '.eh-feature-browser__steps > li, .eh-feature-browser__note',
  '.eh-feature-browser__figure',
  '.eh-workflow-shift__system-heading, .eh-workflow-shift__result',
  '.pricing-section__heading > *',
  '.eh-pricing-cards__card',
  '.eh-pricing-cards__card > :not(.eh-price-atmosphere):not(ul)',
  '.eh-pricing-cards__card > ul > li, .eh-pricing-cards__terms > p',
  '.faq-section > header, .faq-section__list > details',
  '.eh-finale-editorial .eh-journey__split-title > span',
  '.eh-finale-editorial .eh-journey__finale-action > *',
  '.eh-finale-footer__copyright, .eh-finale-footer__top',
  '.eh-finale-footer nav > *',
].join(',')

export function attachScrollReveal(root: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const items = new Set<HTMLElement>()
  const observer = new IntersectionObserver(entries => {
    // Re-arm only after an item is below the entrance boundary. Scrolling back
    // to the section then reproduces the entrance without hiding content above.
    entries.forEach(entry => {
      if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
        const item = entry.target as HTMLElement
        item.dataset.scrollVisible = 'false'
        item.style.setProperty('--scroll-reveal-delay', '0ms')
      }
    })
    entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((entry, index) => {
        const item = entry.target as HTMLElement
        item.style.setProperty('--scroll-reveal-delay', `${Math.min(index * 90, 360)}ms`)
        item.dataset.scrollVisible = 'true'
      })
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' })
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
