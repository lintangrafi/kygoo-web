import en from '@/locales/en.json'
import id from '@/locales/id.json'

const translations = { en, id }

export function useTranslation(locale: string) {
  const messages = translations[locale as keyof typeof translations] || translations.en

  return (key: string): string => {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      value = value[k]
      if (value === undefined) return key
    }

    return value
  }
}
