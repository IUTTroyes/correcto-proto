<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'

const userStore = useUserStore()
const router = useRouter()

// Check authentication on component mount
onMounted(() => {
  userStore.checkAuth()
})

// Computed property to get user data from the store
const userData = computed(() => {
  if (!userStore.user) return null

  return {
    name: `${userStore.user.firstName} ${userStore.user.lastName}`,
    email: userStore.user.email,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
})

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Sujets', href: '#', current: false },
  { name: 'Évaluations', href: '#', current: false },
]
const userNavigation = [
  { name: 'Profil', href: '#' },
  { name: 'Paramètres', href: '#' },
  { name: 'Déconnexion', href: '#', action: logout },
]

// État pour le menu utilisateur et le menu mobile
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Fonction pour basculer l'état des menus
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Fonction pour se déconnecter
function logout() {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen w-full">
    <!-- Only show header when user is authenticated -->
    <header v-if="userStore.isAuthenticated" class="bg-white shadow-sm">
      <nav>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <div class="shrink-0 flex items-center gap-2">
                <AcademicCapIcon class="block size-6" aria-hidden="true" />
                <div class="font-bold text-2xl uppercase text-red-400">correcto</div>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <RouterLink
                    v-for="navItem in navigation"
                    :key="navItem.name"
                    :to="navItem.href"
                    class="rounded-md px-3 py-2 text-sm font-medium hover:bg-red-400 hover:text-white"
                    :class="navItem.current ? 'bg-gray-100 pointer-events-none' : ''"
                    aria-current="page">
                    {{ navItem.name }}
                  </RouterLink>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="ml-4 flex items-center md:ml-6">
                <button type="button" class="relative rounded-full p-1 text-gray-400 hover:text-red-400 border">
                  <span class="sr-only">View notifications</span>
                  <BellIcon class="block size-6" aria-hidden="true" />
                </button>

                <!-- Profile dropdown -->
                <div class="relative ml-3">
                  <div>
                    <button @click="toggleUserMenu" type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span class="sr-only">Open user menu</span>
                      <img class="size-8 rounded-full" :src="userData.imageUrl" alt="" />
                    </button>
                  </div>

                  <div v-if="isUserMenuOpen" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                    <a
                      v-for="navUserItem in userNavigation"
                      :key="navUserItem.name"
                      href="#"
                      @click.prevent="navUserItem.action ? navUserItem.action() : null"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-red-400 hover:text-white"
                      role="menuitem"
                    >
                      {{ navUserItem.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button @click="toggleMobileMenu" type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-red-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-controls="mobile-menu" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <Bars3Icon v-if="!isMobileMenuOpen" class="block size-6" aria-hidden="true" />
                <XMarkIcon v-else class="block size-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="isMobileMenuOpen" class="md:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <RouterLink
              v-for="navItem in navigation"
              :key="navItem.name"
              :to="navItem.href"
              class="block rounded-md px-3 py-2 text-base font-medium hover:bg-red-400 hover:text-white"
            >
              {{ navItem.name }}
            </RouterLink>
          </div>
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="shrink-0">
                <img class="size-10 rounded-full" :src="userData.imageUrl" alt="" />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-white">{{ userData.name }}</div>
                <div class="text-sm font-medium text-gray-400">{{ userData.email }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <a
                v-for="navUserItem in userNavigation"
                :key="navUserItem.name"
                href="#"
                @click.prevent="navUserItem.action ? navUserItem.action() : null"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-red-400 hover:text-white"
              >
                {{ navUserItem.name }}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
