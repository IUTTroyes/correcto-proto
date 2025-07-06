import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  async function getUser() {
    try {
      // Get the user data from the JSON file
      const response = await fetch('/User.json')
      if (!response.ok) {
        console.error('Failed to fetch user data', response.statusText)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  async function login(mail, password) {
    try {
      // For this prototype, we'll use a hardcoded password
      const hardcodedPassword = 'password'

      // Get user data from JSON file
      const userData = await getUser()

      // Check if mail matches and password is correct
      if (userData && userData.mail === mail && password === hardcodedPassword) {
        // Set the user data in the store
        user.value = userData

        // Store authentication state in localStorage for persistence
        localStorage.setItem('isAuthenticated', 'true')

        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('isAuthenticated')
  }

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  // Check if user was previously authenticated
  function checkAuth() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'

    if (isAuth && !user.value) {
      // If authenticated but no user data, fetch it
      getUser().then(userData => {
        if (userData) {
          user.value = userData
        } else {
          // If user data can't be fetched, clear authentication
          localStorage.removeItem('isAuthenticated')
        }
      })
    }

    return isAuth
  }

  return {
    user,
    isAuthenticated,
    getUser,
    login,
    logout,
    setUser,
    clearUser,
    checkAuth
  }
})
