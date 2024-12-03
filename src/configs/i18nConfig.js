import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import Middleware from 'i18next-http-middleware'

i18next
  .use(Backend)
  .use(Middleware.LanguageDetector) // Detect language from request
  .init({
    fallbackLng: 'en', // Default language
    preload: ['en', 'fr', 'es'], // Preload these languages
    backend: {
      loadPath: './locales/{{lng}}.json', // Translation file path
    },
    detection: {
      order: ['cookie', 'header', 'querystring'], // Detect language from these sources
      caches: ['cookie'], // Cache the language setting in a cookie
    },
  })

export default i18next