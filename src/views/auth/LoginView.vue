<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = await userStore.login(username.value, password.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Identifiants incorrects'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-5 border border-gray-200 rounded-lg shadow-md">
      <h1 class="text-center mb-5 text-2xl font-bold">Connexion</h1>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="username" class="font-medium">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Entrez votre nom d'utilisateur"
            required
            class="p-2 border border-gray-200 rounded text-base"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="password" class="font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Entrez votre mot de passe"
            required
            class="p-2 border border-gray-200 rounded text-base"
          />
        </div>

        <div v-if="error" class="p-2 bg-red-100 text-red-800 rounded text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="mt-2 py-3 bg-indigo-600 text-white rounded text-base font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
    </div>
</template>

<style scoped>
</style>
