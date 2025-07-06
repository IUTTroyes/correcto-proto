<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import EtudiantDashboard from "@/components/dashboard/EtudiantDashboard.vue";
import EnseignantDashboard from "@/components/dashboard/EnseignantDashboard.vue";

const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
  user.value = await userStore.user;
  console.log(user.value);
});
</script>

<template>
  <main class="flex flex-col gap-6">
    <div class="p-6">
      <div class="font-bold text-2xl">
        Bienvenue {{ user?.prenom }} {{ user?.nom }} !
      </div>
      <div class="opacity-60">
        Gérez vos évaluations et notez vos étudiants.
      </div>
    </div>

    <EtudiantDashboard v-if="user && user.role === 'etudiant'"/>
    <EnseignantDashboard v-else-if="user && user.role === 'enseignant'"/>

  </main>
</template>
