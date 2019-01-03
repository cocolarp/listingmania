import { $gettext } from 'src/lang_utils'

export const AVAILABLE_DISTANCES = {
  10: '10km',
  50: '50km',
  150: '150km',
  250: '250km',
  500: '500km',
}

export const DURATION_HOURS = 'hours'
export const DURATION_SHORT = 'short'
export const DURATION_MEDIUM = 'medium'
export const DURATION_LONG = 'long'

export const COLOR_SHORT = '#AC73ED'
export const COLOR_MEDIUM = '#3EC89C'
export const COLOR_LONG = '#49AFEB'

export const DURATION_COLOR = {
  [DURATION_HOURS]: COLOR_SHORT,
  [DURATION_SHORT]: COLOR_SHORT,
  [DURATION_MEDIUM]: COLOR_MEDIUM,
  [DURATION_LONG]: COLOR_LONG,
}

export const DURATIONS = [DURATION_SHORT, DURATION_MEDIUM, DURATION_LONG]

export const CURRENCY_CHF = 'CHF'
export const CURRENCY_EUR = 'EUR'
export const CURRENCY_GBP = 'GBP'
export const CURRENCY_SEK = 'SEK'
export const CURRENCY_USD = 'USD'

export const CURRENCY_SYMBOLS = {
  [CURRENCY_CHF]: 'CHF',
  [CURRENCY_EUR]: '€',
  [CURRENCY_GBP]: '£',
  [CURRENCY_SEK]: 'kr',
  [CURRENCY_USD]: '$',
}

export const TAG_LABELS = {
  'beginner_friendly': $gettext('Adapté aux débutants'),
  'pwd_friendly': $gettext('Adapté PMR'),
  'international': $gettext('International'),
  'underage_friendly': $gettext('Mineurs bienvenus'),
}

export const AVAILABLE_CURRENCIES = Object.keys(CURRENCY_SYMBOLS)

/* After a list coming from both the supported Microsoft languages and the most common
 * languages according to Wikipedia, 2018-01-05. Using the ISO 639-1 2-character language codes.
 * http://stevehardie.com/2009/10/list-of-common-languages/
 */
export const LANGUAGE_LABELS = {
  'af': $gettext('Afrikanns'),
  'ar': $gettext('Arabic'),
  'bg': $gettext('Bulgarian'),
  'bn': $gettext('Bengali'),
  'bo': $gettext('Tibetan'),
  'ca': $gettext('Catalan'),
  'cs': $gettext('Czech'),
  'cy': $gettext('Welsh'),
  'da': $gettext('Danish'),
  'de': $gettext('German'),
  'el': $gettext('Greek'),
  'en': $gettext('English'),
  'es': $gettext('Spanish'),
  'et': $gettext('Estonian'),
  'eu': $gettext('Basque'),
  'fa': $gettext('Persian'),
  'fi': $gettext('Finnish'),
  'fj': $gettext('Fiji'),
  'fr': $gettext('French'),
  'ga': $gettext('Irish'),
  'gu': $gettext('Gujarati'),
  'he': $gettext('Hebrew'),
  'hi': $gettext('Hindi'),
  'hr': $gettext('Croatian'),
  'hu': $gettext('Hungarian'),
  'hy': $gettext('Armenian'),
  'id': $gettext('Indonesian'),
  'is': $gettext('Icelandic'),
  'it': $gettext('Italian'),
  'ja': $gettext('Japanese'),
  'jw': $gettext('Javanese'),
  'ka': $gettext('Georgian'),
  'km': $gettext('Cambodian'),
  'ko': $gettext('Korean'),
  'la': $gettext('Latin'),
  'lt': $gettext('Lithuanian'),
  'lv': $gettext('Latvian'),
  'mi': $gettext('Maori'),
  'mk': $gettext('Macedonian'),
  'ml': $gettext('Malayalam'),
  'mn': $gettext('Mongolian'),
  'mr': $gettext('Marathi'),
  'ms': $gettext('Malay'),
  'mt': $gettext('Maltese'),
  'ne': $gettext('Nepali'),
  'nl': $gettext('Dutch'),
  'no': $gettext('Norwegian'),
  'pa': $gettext('Punjabi'),
  'pl': $gettext('Polish'),
  'pt': $gettext('Portuguese'),
  'qu': $gettext('Quechua'),
  'ro': $gettext('Romanian'),
  'ru': $gettext('Russian'),
  'sk': $gettext('Slovak'),
  'sl': $gettext('Slovenian'),
  'sm': $gettext('Samoan'),
  'sq': $gettext('Albanian'),
  'sr': $gettext('Serbian'),
  'sv': $gettext('Swedish '),
  'sw': $gettext('Swahili'),
  'ta': $gettext('Tamil'),
  'te': $gettext('Telugu'),
  'th': $gettext('Thai'),
  'to': $gettext('Tonga'),
  'tr': $gettext('Turkish'),
  'tt': $gettext('Tatar'),
  'uk': $gettext('Ukranian'),
  'ur': $gettext('Urdu'),
  'uz': $gettext('Uzbek'),
  'vi': $gettext('Vietnamese'),
  'xh': $gettext('Xhosa'),
  'zh': $gettext('Chinese (Mandarin)'),
}
