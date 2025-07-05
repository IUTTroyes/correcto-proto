import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    try {
      // Fetch the user data from the JSON file
      const response = await fetch('/User.json')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const userData = await response.json()
      return userData
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  async function login(username, password) {
    try {
      // For this prototype, we'll use a hardcoded password
      const hardcodedPassword = 'password'

      // Fetch user data from JSON file
      const userData = await fetchUser()

      // Check if username matches and password is correct
      if (userData && userData.username === username && password === hardcodedPassword) {
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
      fetchUser().then(userData => {
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
    fetchUser,
    login,
    logout,
    setUser,
    clearUser,
    checkAuth
  }
})
