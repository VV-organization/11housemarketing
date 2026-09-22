export type PricingPlan = {
  key: 'start' | 'pro' | 'studio'
  name: string
  price: string
  period: string
  audience: string
  commissionLabel: string
  note: string
  commission: string
  capacityTitle: string
  capacityDetail: string
  includesLabel: string
  limits: string[]
  features: string[]
  cardPoints: string[]
}

// Pricing copy from the user-approved design preview.
export const pricingPlans: PricingPlan[] = [
  {
    "key": "start",
    "name": "Start",
    "price": "0 ₽",
    "period": "навсегда",
    "audience": "Всё, чтобы вести практику без подписки.",
    "commission": "8%*",
    "commissionLabel": "Комиссия на выплату",
    "capacityTitle": "Для начала",
    "capacityDetail": "1 специалист · 1 ГБ*",
    "includesLabel": "Полноценная практика",
    "note": "С брендом ElevenHouse. Без AI.",
    "cardPoints": [
      "Все карты и расчёты, свои трактовки и PDF-отчёты",
      "Клиенты, переписка, календарь и запись",
      "Личная страница, услуги и платные материалы",
      "Приём оплат картой и СБП, аналитика",
      "Видеосвязь без записи",
      "Готовые напоминания и сбор данных рождения"
    ],
    "features": [
      "Все карты и расчёты, свои трактовки и PDF-отчёты",
      "Клиенты, переписка, календарь и запись",
      "Личная страница, услуги и платные материалы",
      "Приём оплат картой и СБП, аналитика",
      "Видеосвязь без записи",
      "Готовые напоминания и сбор данных рождения"
    ],
    "limits": [
      "1 специалист · 1 ГБ*",
      "С брендом ElevenHouse. Без AI."
    ]
  },
  {
    "key": "pro",
    "name": "Team Pro",
    "price": "2 490 ₽",
    "period": "в месяц",
    "audience": "Меньше ручной работы. Больше возможностей.",
    "commission": "6%*",
    "commissionLabel": "Комиссия",
    "capacityTitle": "AI + автоматизация",
    "capacityDetail": "До 5 специалистов · 10 ГБ*",
    "includesLabel": "Всё из Start и больше",
    "note": "AI для полноценной работы астролога*.",
    "cardPoints": [
      "Всё из Start",
      "AI для разборов, подготовки встреч, ответов и контента",
      "Свои сценарии и автоматизации",
      "Контент-план и публикации по расписанию",
      "Запись встреч, группы и вебинары",
      "Своё оформление личной страницы"
    ],
    "features": [
      "Всё из Start",
      "AI для разборов, подготовки встреч, ответов и контента",
      "Свои сценарии и автоматизации",
      "Контент-план и публикации по расписанию",
      "Запись встреч, группы и вебинары",
      "Своё оформление личной страницы"
    ],
    "limits": [
      "До 5 специалистов · 10 ГБ*",
      "AI для полноценной работы астролога*."
    ]
  },
  {
    "key": "studio",
    "name": "Studio",
    "price": "4 990 ₽",
    "period": "в месяц",
    "audience": "Для команды и активной работы с AI.",
    "commission": "5%*",
    "commissionLabel": "Комиссия",
    "capacityTitle": "Для команды",
    "capacityDetail": "До 10 специалистов · 100 ГБ*",
    "includesLabel": "Всё из Team Pro и больше",
    "note": "Лимиты общие на команду.",
    "cardPoints": [
      "Всё из Team Pro",
      "Значительно больше AI с теми же функциями и качеством",
      "Интеграции через API",
      "Приоритетная поддержка",
      "Личный менеджер"
    ],
    "features": [
      "Всё из Team Pro",
      "Значительно больше AI с теми же функциями и качеством",
      "Интеграции через API",
      "Приоритетная поддержка",
      "Личный менеджер"
    ],
    "limits": [
      "До 10 специалистов · 100 ГБ*",
      "Лимиты общие на команду."
    ]
  }
]

export const pricingActionLabel = (_plan: PricingPlan) => 'Начать бесплатно'
export const pricingRegistrationUrl = 'https://app.elevenhouse.ai/auth?mode=register'
