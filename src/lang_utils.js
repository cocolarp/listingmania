export function $gettext (x) { return x }

export function getBrowserLanguage () {
  return navigator.language.split('-')[0]
}

export function getCurrentlySupportedLocale () {
  const lang = getBrowserLanguage()
  if (lang === 'fr') return 'fr_FR'
  return 'en_US'
}
