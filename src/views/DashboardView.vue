<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import EtudiantDashboard from "@/components/dashboard/EtudiantDashboard.vue";
import EnseignantDashboard from "@/components/dashboard/EnseignantDashboard.vue";

const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
  user.value = await userStore.user;
  if (!user.value) {
    // Redirection si l'utilisateur n'est pas connecté
    userStore.checkAuth();
  }
});
</script>

<template>
  <main class="flex flex-col gap-6">
    <div class="p-6">
      <h1 class="text-2xl font-bold">Bienvenue {{ user?.prenom }} {{ user?.nom }} !</h1>
      <p class="text-gray-600">Gérez vos évaluations et notez vos étudiants.</p>
    </div>

    <EtudiantDashboard v-if="user && user.role === 'etudiant'"/>
    <EnseignantDashboard v-else-if="user && user.role === 'enseignant'"/>

  </main>
</template>
