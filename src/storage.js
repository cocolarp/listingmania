/* global localStorage */

export function saveToken (token) {
  localStorage.setItem('token', token)
}

export function getStoredToken () {
  return localStorage.getItem('token')
}

export function saveCurrency (currency) {
  localStorage.setItem('currency', currency)
}

export function getCurrency () {
  return localStorage.getItem('currency')
}

export function setRemember () {
  localStorage.setItem('remember', 1)
}

export function shouldRemember () {
  return localStorage.getItem('remember')
}

export function clearUserData () {
  localStorage.removeItem('token')
  localStorage.removeItem('remember')
}
