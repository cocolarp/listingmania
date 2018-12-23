import {
  createLocalVue,
  shallowMount as baseShallowMount,
} from '@vue/test-utils'

import Vuex from 'vuex'
import GetTextPlugin from 'vue-gettext'

import translations from 'dist/translations.json'

export const getTextPluginConfig = {
  availableLanguages: {
    en_US: 'English',
    fr_FR: 'French',
  },
  defaultLanguage: 'fr_FR',
  languageVmMixin: {
    computed: {
      currentLocale: () => 'fr_FR',
      currentLanguage: () => 'fr-fr',
    },
  },
  translations: translations,
  silent: true,
}

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(GetTextPlugin, getTextPluginConfig)

export function shallowMount (component, options) {
  return baseShallowMount(component, {
    localVue,
    ...options,
  })
}

export function trimHtml (str) {
  return str.replace(/>\s+</g, '><').trim()
}
