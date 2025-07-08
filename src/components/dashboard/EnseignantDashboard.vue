<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useEvalStore } from "@/stores/evaluation.js";
import { ChartPieIcon, ExclamationTriangleIcon, UsersIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/outline';
import EnseignantVueEnsemble from "@/components/dashboard/EnseignantVueEnsemble.vue";

const userStore = useUserStore();
const user = ref(null);

const evalStore = useEvalStore();
const enseignantEvaluations = ref([]);

const currentView = ref('overview'); // Vue par défaut

const nav = [
  { name: 'Vue d\'ensemble', view: 'overview', icon: ChartPieIcon },
  { name: 'Alertes', view: 'alerts', icon: ExclamationTriangleIcon },
  { name: 'Suivi des étudiants', view: 'students', icon: UsersIcon },
  { name: 'Engagement', view: 'engagement', icon: ArrowTrendingUpIcon }
];

onMounted(async () => {
  user.value = await userStore.user;
  enseignantEvaluations.value = evalStore.evaluationsMatiereEnseignant;
});

const setCurrentView = (view) => {
  currentView.value = view;
};
</script>

<template>
  <div class="flex flex-row w-full gap-8 border-b border-gray-200">
    <div
        v-for="item in nav"
        :key="item.name"
        class="flex flex-row items-center gap-2 opacity-60 p-2 hover:border-b-2 hover:border-b-gray-600 border-b-2 border-b-transparent hover:opacity-90 transition-all hover:cursor-pointer"
        :class="{ 'opacity-100 !border-b-red-600 text-red-600': currentView === item.view }"
        @click="setCurrentView(item.view)">
      <component :is="item.icon" class="inline-block size-6 text-gray-500" aria-hidden="true" />
      <span class="font-bold text-sm">{{ item.name }}</span>
    </div>
  </div>

  <div v-if="currentView === 'overview' && enseignantEvaluations.length > 0">
    <EnseignantVueEnsemble :enseignantEvaluations="enseignantEvaluations" />
  </div>
  <div v-else-if="currentView === 'alerts'">
    <div>Composant Alertes</div>
  </div>
  <div v-else-if="currentView === 'students'">
    <div>Composant Suivi des étudiants</div>
  </div>
  <div v-else-if="currentView === 'engagement'">
    <div>Composant Engagement</div>
  </div>
</template>

<style scoped>
</style>
