import type { FeatureId } from './SourceFragments'

export type FeatureScreenshot = {
  id: FeatureId
  label: string
  title: string
  description: string
  steps: readonly [string, string, string]
  image: string
  imageWidth: number
  imageHeight: number
  caption: string
  note?: string
}

// Copy and screenshots supplied by the user via the design preview.
// Tariff notes follow the same reference as pricingPlans.
const screenshot = (name: string) => `${import.meta.env.BASE_URL}assets/feature-screenshots/${name}.webp`
export const featureScreenshots: readonly FeatureScreenshot[] = [
  {
    id: 'calendar', label: 'Календарь',
    title: 'Встреча начинается с удобной записи',
    description: 'Видите свою неделю, данные клиента и детали консультации в одном календаре.',
    steps: ['Настройте доступное время', 'Получите запись в календаре', 'Откройте встречу и начните консультацию'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-calendar-retina.png`, caption: 'Экран календаря ElevenHouse', imageWidth: 4536, imageHeight: 2580,
    note: 'Календарь и онлайн-запись входят в бесплатный тариф.',
  },
  {
    id: 'client', label: 'Клиенты',
    title: 'Контекст клиента всегда под рукой',
    description: 'Данные, заметки и история работы находятся в одном кабинете, а не в нескольких переписках.',
    steps: ['Добавьте клиента', 'Сохраните данные и заметки', 'Вернитесь к ним перед следующей встречей'],
    image: screenshot('eh-p02-clients'), caption: 'Раздел клиентов ElevenHouse', imageWidth: 1800, imageHeight: 1024,
    note: 'Работа с клиентами доступна на Start. На скриншоте — исходный экран без выбранного клиента.',
  },
  {
    id: 'reading', label: 'Расчёты',
    title: 'Не переключайтесь между расчётами',
    description: 'Западная и ведическая астрология, нумерология, матрица судьбы и Human Design — в одном рабочем пространстве.',
    steps: ['Выберите систему расчёта', 'Введите данные клиента', 'Изучите результат и подготовьте разбор'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-numerology-retina.png`, caption: 'Пример расчёта: нумерология', imageWidth: 4536, imageHeight: 2580,
    note: 'Все расчёты, свои трактовки и PDF-отчёты доступны на Start.',
  },
  {
    id: 'products', label: 'Услуги',
    title: 'Ваши знания становятся услугой',
    description: 'Соберите предложения для клиентов: консультации, пакеты, подписки и платные материалы.',
    steps: ['Создайте услугу', 'Укажите формат и стоимость', 'Разместите на личной странице'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-products-retina.png`, caption: 'Каталог продуктов ElevenHouse', imageWidth: 4536, imageHeight: 2580,
    note: 'Конструктор услуг и личная страница входят в Start.',
  },
  {
    id: 'session', label: 'Консультации',
    title: 'От записи сразу к встрече',
    description: 'Откройте подтверждённую запись, посмотрите детали и перейдите к видеоконсультации.',
    steps: ['Выберите встречу в календаре', 'Проверьте данные и формат', 'Перейдите в сессию'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-session-live.png`, caption: 'Комната ожидания видеоконсультации ElevenHouse', imageWidth: 1600, imageHeight: 1000,
    note: 'Видеосвязь без записи — на Start. Запись встреч, группы и вебинары — на платных тарифах.',
  },
  {
    id: 'followup', label: 'Сопровождение',
    title: 'Не теряйте связь между встречами',
    description: 'Астродневник помогает продолжать работу с клиентом и сохранять контекст сопровождения.',
    steps: ['Откройте дневник клиента', 'Посмотрите записи и сообщения', 'Продолжите сопровождение'],
    image: screenshot('eh-p09-journal'), caption: 'Астродневник ElevenHouse', imageWidth: 1800, imageHeight: 1024,
    note: 'Дневник доступен на Start. Свои автоматические цепочки сопровождения — в Team Pro.',
  },
  {
    id: 'automation', label: 'AI и автоматизация',
    title: 'Поручите рутину системе',
    description: 'AI помогает с черновиками разборов и ответов. Воронки связывают повторяющиеся действия в ваш сценарий.',
    steps: ['Определите последовательность действий', 'Настройте нужные условия', 'Проверяйте AI-черновики перед использованием'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-funnel-retina.png`, caption: 'Конструктор воронки: пример настройки', imageWidth: 4536, imageHeight: 2580,
    note: 'AI и свои сценарии доступны в Team Pro и Studio. На экране — настройка воронки, не результат AI.',
  },
  {
    id: 'content', label: 'Контент',
    title: 'Материалы тоже работают на вашу практику',
    description: 'Храните и предлагайте клиентам платные материалы. В подписке добавляются контент-план и публикации по расписанию.',
    steps: ['Подготовьте материал', 'Добавьте его как продукт', 'Предложите клиентам на личной странице'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-course-retina.png`, caption: 'Конструктор мини-курса: материалы и доступы', imageWidth: 3234, imageHeight: 2799,
    note: 'На экране — настройка курса и превью для клиента.',
  },
  {
    id: 'practice', label: 'Практика',
    title: 'Понимайте, что происходит в практике',
    description: 'Следите за продажами и оплатами, не собирая каждый раз отдельную таблицу.',
    steps: ['Откройте финансовый раздел', 'Проверьте операции и баланс', 'Посмотрите результаты работы'],
    image: `${import.meta.env.BASE_URL}assets/feature-screenshots/eh-finance-retina.png`, caption: 'Финансовый раздел ElevenHouse', imageWidth: 4536, imageHeight: 2580,
    note: 'Аналитика и история продаж доступны на Start. На скриншоте — кабинет без операций.',
  },
]
