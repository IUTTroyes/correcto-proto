<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const mail = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!mail.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = await userStore.login(mail.value, password.value)
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
        <label for="mail" class="font-medium">Adresse mail</label>
        <input
            type="text"
            id="mail"
            v-model="mail"
            placeholder="Entrez votre adresse mail"
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

  <div class="max-w-md mx-auto mt-10 p-5 border border-blue-200 rounded-lg bg-blue-50">
    <div class="text-blue-500 flex flex-col gap-1">
      <div class="font-bold text-md">
        Données de test :
      </div>
      <div class="text-sm">
        <div>
          <span class="font-bold">Enseignant :</span> enseignant@example.com
          <span class="font-bold">/</span> password
        </div>
      </div>
      <div class="text-sm">
        <div>
          <span class="font-bold">Etudiant :</span> etudiant@example.com
          <span class="font-bold">/</span> password
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
