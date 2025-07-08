<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGrilleEvaluationStore } from '@/stores/grilleEvaluation';
import {BarsArrowUpIcon, BarsArrowDownIcon, DocumentTextIcon, PlusIcon} from "@heroicons/vue/24/outline";

const grilleStore = useGrilleEvaluationStore();

const selectedFilter = ref<'perso' | 'matieres' | 'all'>('perso');
const selectedType = ref<'classique' | 'auto' | ''>('');
const selectedAuteur = ref<'1' | '2' | ''>('');
const grilles = ref(grilleStore.grilles);

const sortKey = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc' | null>(null);

function toggleSort(key: string) {
  if (sortKey.value !== key) {
    sortKey.value = key;
    sortOrder.value = 'asc';
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else if (sortOrder.value === 'desc') {
    sortKey.value = null;
    sortOrder.value = null;
  } else {
    sortOrder.value = 'asc';
  }
}

watch([sortKey, sortOrder], () => {
  if (!sortKey.value || !sortOrder.value) {
    grilles.value = grilleStore.grilles.slice();
    return;
  }
  const sorted = [...grilles.value].sort((a, b) => {
    let res = 0;
    if (sortKey.value === 'name') {
      res = a.name.localeCompare(b.name);
    } else if (sortKey.value === 'date_modification') {
      res = new Date(a.date_modification).getTime() - new Date(b.date_modification).getTime();
    }
    return sortOrder.value === 'asc' ? res : -res;
  });
  grilles.value = sorted;
});
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-full">
      <div class="flex justify-between items-center">
        <div class="font-bold text-xl">Grilles d'évaluation</div>
        <button class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer flex items-center gap-1"><PlusIcon class="inline-block size-4" aria-hidden="true"/>Créer une grille</button>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <label for="filter" class="text-sm font-medium">Filtrer par :</label>
        <select id="filter" v-model="selectedFilter" class="border border-gray-300 rounded-md p-2">
          <option value="perso">Mes grilles</option>
          <option value="all">Toutes les grilles</option>
        </select>

        <div class="flex gap-6 w-full">
          <div class="w-1/2">
            <div class="text-sm font-medium">
              Filtres additionnels :
            </div>
            <div class="flex gap-2">
              <select id="filter" class="border border-gray-300 rounded-md p-1 w-1/2" v-model="selectedType">
                <option value="">Tous types</option>
                <option value="classique">Classique</option>
                <option value="auto">Auto-evaluation</option>
              </select>
              <select id="filter" v-model="selectedAuteur" class="border border-gray-300 rounded-md p-1 w-1/2">
                <option value="">Tous auteurs</option>
                <option value="1">user1</option>
                <option value="2">user2</option>
              </select>
            </div>
          </div>
          <div class="w-1/2">
            <div class="text-sm font-medium">Trier par :</div>
            <div class="flex items-center gap-2 text-sm">
              <button @click="toggleSort('name')" class="flex items-center gap-1 hover:underline hover:cursor-pointer text-red-500">
                <BarsArrowUpIcon class="inline-block size-3" aria-hidden="true" v-if="sortKey === 'name' && sortOrder === 'asc'"/>
                <BarsArrowDownIcon class="inline-block size-3" aria-hidden="true" v-if="sortKey === 'name' && sortOrder === 'desc'"/>
                Nom
              </button>
              <span class="text-gray-400">|</span>
              <button @click="toggleSort('date_modification')" class="flex items-center gap-1 hover:underline hover:cursor-pointer text-red-500">
                <BarsArrowUpIcon class="inline-block size-3" aria-hidden="true" v-if="sortKey === 'date_modification' && sortOrder === 'asc'"/>
                <BarsArrowDownIcon class="inline-block size-3" aria-hidden="true" v-if="sortKey === 'date_modification' && sortOrder === 'desc'"/>
                Date de création
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="grilles.length === 0" class="flex flex-col gap-2 mt-4 justify-center items-center mb-12">
        <DocumentTextIcon class="w-14 h-14 mx-auto text-gray-400" />
        <div class="flex flex-col items-center">
          <p class="text-sm m-0 p-0">Aucune grille d'évaluation trouvée.</p>
          <p class="text-gray-500 m-0 p-0">Créez votre première grille d'évaluation.</p>
        </div>
        <button>
          <router-link to="/evaluation/new" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Créer une grille d'évaluation
          </router-link>
        </button>
      </div>

      <div v-else v-for="grille in grilles" class="p-1 w-full border-b border-gray-200 last:border-b-0 pb-4">
        <div class="flex md:flex-row flex-col justify-between md:items-center">
          {{grille.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
