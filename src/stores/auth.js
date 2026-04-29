import { ref } from 'vue'
import { defineStore } from 'pinia'
import url from '@/functions/baseUrl'
import { useRouter } from 'vue-router'

const baseUrl = url()

export const useAuthStore = defineStore('auth', () => {

  const router = useRouter()

  let status = ref('loggedOut')

  async function loginAttemp(username, password) {
    status.value = 'loggingIn'
    await fetch(baseUrl + 'auth/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json;charset=UTF-8'},
            body: JSON.stringify({ username: username, password: password}) 
          })
          .then((response) => {
            return new Promise((resolve) => response.json()
              .then((data) => resolve({
                ok: response.ok,
                data: data
              })))
          })
          .then(({ data, ok }) => {
            if (!ok) {
              failedAttemp()
              return 'error'
            }
            setUserToken(data.data.user, data.data.token, 'dashboard')
            return 'success'
          })
          .catch(error => {
            failedAttemp()
            return 'error'
          })
  }

  async function check(redirect = true) {
    if(!token()) {
      logout(redirect)
      return false
    }
    await fetch(baseUrl + 'auth/checkauth', {
      method: 'GET',
      headers: {'Content-type': 'application/json;charset=UTF-8', 'Authorization': 'Bearer ' + token()}
    })
    .then((response) => {
      return new Promise((resolve) => response.json()
        .then((data) => resolve({
          ok: response.ok,
          data
        })))
    })
    .then(({ data, ok }) => {
      if (!ok || !data.ok) {
        logout(redirect)
        return false
      }
      status.value = 'loggedIn'
      return true
    })
    .catch(error => {
      logout(redirect)
      return false
    })
  }

  function logout(redirect = true) {
    status.value = 'loggedOut'
    redirect ? router.push({name: 'login'}) :
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    console.log('logout')
  }

  function failedAttemp() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    status.value = 'failed'
  }

  function setUserToken(user, token, redirect = 'dashboard') {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
    status.value = 'loggedIn'
    router.push({name: redirect})
  }

  function token () {
    if (localStorage.getItem('token') === null) {
      status.value = 'loggedOut'
      return null
    }
    return JSON.parse(localStorage.getItem('token'))
  }

  function user () {
    if (localStorage.getItem('user') === null) {
      status.value = 'loggedOut'
      return null
    }
    return JSON.parse(localStorage.getItem('user'))
  }

  return { status, user, token, loginAttemp, check, logout, setUserToken }
})