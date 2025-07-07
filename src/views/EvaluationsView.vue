<script setup>
import {ref} from "vue";
import ListeEvaluations from "@/components/evaluations/ListeEvaluations.vue";
import GrillesEvaluation from "@/components/evaluations/GrillesEvaluation.vue";
import SuiviNotes from "@/components/evaluations/SuiviNotes.vue";

const currentView = ref('evals'); // Vue par défaut

const nav = [
  { name: 'Liste des évaluations', view: 'evals' },
  { name: 'Grilles d\'évaluation', view: 'grilles' },
  { name: 'Suivi des notes', view: 'notes' },
];

const setCurrentView = (view) => {
  currentView.value = view;
};
</script>

<template>
  <main class="flex flex-col gap-6">
    <div class="p-6">
      <h1 class="text-2xl font-bold">Évaluations</h1>
      <p class="text-gray-600">Gérez vos évaluations.</p>
    </div>

    <div class="flex flex-row w-full gap-8 border-b border-gray-200">
      <div
          v-for="item in nav"
          :key="item.name"
          class="flex flex-row items-center gap-2 opacity-60 p-2 hover:border-b-2 hover:border-b-gray-600 border-b-2 border-b-transparent hover:opacity-90 transition-all hover:cursor-pointer"
          :class="{ 'opacity-100 !border-b-red-600 text-red-600': currentView === item.view }"
          @click="setCurrentView(item.view)">
        <span class="font-bold text-sm">{{ item.name }}</span>
      </div>
    </div>

    <div v-if="currentView === 'evals'">
      <ListeEvaluations/>
    </div>
    <div v-else-if="currentView === 'grilles'">
      <GrillesEvaluation/>
    </div>
    <div v-else-if="currentView === 'notes'">
      <SuiviNotes/>
    </div>
  </main>
</template>
