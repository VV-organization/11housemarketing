import './legalDialog.css'

export function FinaleFooter() {
  return <footer className="eh-journey__footer eh-finale-footer">
    <span className="eh-finale-footer__copyright">Рабочее пространство астролога.<br />От первой записи до следующей встречи.<br />© {new Date().getFullYear()} ElevenHouse</span>
    <nav className="eh-finale-footer__contacts" aria-label="Контакты ElevenHouse">
      <a href="mailto:hello@elevenhouse.ai">hello@elevenhouse.ai</a>
      <a href="https://t.me/elevenhouse_support" target="_blank" rel="noopener noreferrer">Поддержка в Telegram</a>
    </nav>
    <a className="eh-finale-footer__top" href="#top">К началу ↑</a>
    <nav className="eh-finale-footer__documents" aria-label="Юридические документы">
      <a href="https://elevenhouse.ai/privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
      <a href="https://elevenhouse.ai/personal-data-processing" target="_blank" rel="noopener noreferrer">Обработка персональных данных</a>
      <span>Реквизиты</span>
    </nav>
  </footer>
}
