<script setup lang="ts">
import {ref, watch, onMounted} from 'vue';
import {useGrilleEvaluationStore} from '@/stores/grilleEvaluation';
import { useUserStore } from '@/stores/user';
import {BarsArrowDownIcon, BarsArrowUpIcon, DocumentTextIcon, PlusIcon} from "@heroicons/vue/24/outline";

const grilleStore = useGrilleEvaluationStore();
const userStore = useUserStore();

const selectedFilter = ref<'perso' | 'matieres' | 'all'>('perso');
const selectedType = ref<'classique' | 'auto-evaluation' | ''>('');
const selectedAuteur = ref<string>('');
const grilles = ref(grilleStore.grilles);
const enseignants = ref(userStore.enseignants);

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

// Function to apply filters and sorting
function applyFiltersAndSort() {
  // Start with all grilles
  let filteredGrilles = grilleStore.grilles.slice();

  // Apply filter by scope (perso, all)
  if (selectedFilter.value === 'perso' && userStore.user) {
    filteredGrilles = filteredGrilles.filter(grille =>
        grille.auteur === userStore.user.id
    );
  }
  // Note: 'all' doesn't need filtering as it shows all grilles

  // Apply type filter
  if (selectedType.value) {
    filteredGrilles = filteredGrilles.filter(grille =>
        grille.type === selectedType.value
    );
  }

// Apply author filter
  if (selectedAuteur.value !== '') {
    // Convert selectedAuteur.value to a number for comparison
    const selectedAuteurId = parseInt(selectedAuteur.value, 10);

    filteredGrilles = filteredGrilles.filter(grille =>
        grille.auteur === selectedAuteurId
    );
  }

  // Apply sorting if needed
  if (sortKey.value && sortOrder.value) {
    filteredGrilles.sort((a, b) => {
      let res = 0;
      if (sortKey.value === 'name') {
        res = a.name.localeCompare(b.name);
      } else if (sortKey.value === 'date_modification') {
        res = new Date(a.date_modification).getTime() - new Date(b.date_modification).getTime();
      } else if (sortKey.value === 'auteur') {
        // Find the authors in the enseignants array
        const auteurA = enseignants.value.find(e => e.id === a.auteur);
        const auteurB = enseignants.value.find(e => e.id === b.auteur);

        // Compare author names (prenom + nom) - same order as in the dropdown
        if (auteurA && auteurB) {
          const fullNameA = `${auteurA.prenom} ${auteurA.nom}`;
          const fullNameB = `${auteurB.prenom} ${auteurB.nom}`;
          res = fullNameA.localeCompare(fullNameB);
        } else if (auteurA) {
          res = -1; // A has author, B doesn't
        } else if (auteurB) {
          res = 1;  // B has author, A doesn't
        }
      }
      return sortOrder.value === 'asc' ? res : -res;
    });
  }

  grilles.value = filteredGrilles;
}

// Watch for changes in filters and sorting
watch([selectedFilter, selectedType, selectedAuteur, sortKey, sortOrder], () => {
  applyFiltersAndSort();
});

// Initialize grilles when component is mounted
onMounted(() => {
  applyFiltersAndSort();
});
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-full">
      <div class="flex justify-between items-center">
        <div class="font-bold text-xl">Grilles d'évaluation</div>
        <div class="flex gap-2">
          <router-link to="/evaluations/grille/new" class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer flex items-center gap-1">
            <PlusIcon class="inline-block size-4" aria-hidden="true"/>Créer une grille
          </router-link>
        </div>
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
                <option value="auto-evaluation">Auto-evaluation</option>
              </select>
              <select v-if="selectedFilter === 'all'" id="filter" v-model="selectedAuteur" class="border border-gray-300 rounded-md p-1 w-1/2">
                <option value="">Tous auteurs</option>
                <option v-for="enseignant in enseignants" :value="enseignant.id">{{ enseignant.prenom }} {{ enseignant.nom }}</option>
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
          <div>
            <div class="font-medium">{{grille.name}}</div>
            <div class="text-sm text-gray-500">
              Auteur: {{ grille.auteurDetails.prenom }} {{ grille.auteurDetails.nom }}
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ new Date(grille.date_modification).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
