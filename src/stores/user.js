import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  async function getUsers() {
    try {
      // Get the users data from the JSON file
      const response = await fetch('/User.json')
      if (!response.ok) {
        console.error('Failed to fetch users data', response.statusText)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching users data:', error)
      return null
    }
  }

  async function login(mail, password) {
    try {
      // Get users data from JSON file
      const users = await getUsers()

      // Find the user with matching email and password
      const foundUser = users.find(userData =>
        userData.mail === mail && userData.password === password
      )

      if (foundUser) {
        // Set the user data in the store
        user.value = foundUser

        // Store authentication state in localStorage for persistence
        localStorage.setItem('isAuthenticated', 'true')
        // Store user email for later identification
        localStorage.setItem('userEmail', mail)

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
    localStorage.removeItem('userEmail')
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
    const userEmail = localStorage.getItem('userEmail')

    if (isAuth && !user.value && userEmail) {
      // If authenticated but no user data, fetch it
      getUsers().then(users => {
        if (users) {
          // Find the user with the stored email
          const foundUser = users.find(userData => userData.mail === userEmail)
          if (foundUser) {
            user.value = foundUser
          } else {
            // If user can't be found, clear authentication
            localStorage.removeItem('isAuthenticated')
            localStorage.removeItem('userEmail')
          }
        } else {
          // If users data can't be fetched, clear authentication
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('userEmail')
        }
      })
    }

    return isAuth
  }

  return {
    user,
    isAuthenticated,
    getUsers,
    login,
    logout,
    setUser,
    clearUser,
    checkAuth
  }
})
