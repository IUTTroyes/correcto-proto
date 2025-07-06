<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import EtudiantDashboard from "@/components/dashboard/EtudiantDashboard.vue";
import EnseignantDashboard from "@/components/dashboard/EnseignantDashboard.vue";

const userStore = useUserStore();
const user = ref(null);

onMounted(async () => {
  user.value = await userStore.getUser();
});
</script>

<template>
  <main>
    <div class="flex flex-col gap-2">
      <div class="font-bold text-2xl">
        Bienvenue {{ user?.prenom }} {{ user?.nom }} !
      </div>
      <div class="opacity-60">
        Gérez vos évaluations et évaluez vos étudiants.
      </div>
    </div>

    <!--      <EtudiantDashboard v-if="user && user.role === 'etudiant'"/>-->
    <!--      <EnseignantDashboard v-else-if="user && user.role === 'enseignant'"/>-->

  </main>
</template>
