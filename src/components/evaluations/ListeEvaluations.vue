<script setup>
import { useEvalStore } from '@/stores/evaluation'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from "vue-router";

import { DocumentTextIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import {ArrowRightIcon, BookOpenIcon} from "@heroicons/vue/24/outline/index.js";

const evalStore = useEvalStore()

const allEvaluations = ref([])
const mesEvaluations = ref([])
const mesMatieresEvaluations = ref([])
const selectedFilter = ref('perso') // Valeur par défaut du filtre

onMounted(async () => {
  try {
    // Vérifiez si les données existent avant de les assigner
    if (evalStore.evaluationsEnseignant) {
      mesEvaluations.value = evalStore.evaluationsEnseignant
    } else {
      console.warn('Aucune donnée trouvée pour evaluationsEnseignant')
    }

    if (evalStore.evaluationsMatiereEnseignant) {
      mesMatieresEvaluations.value = evalStore.evaluationsMatiereEnseignant
    } else {
      console.warn('Aucune donnée trouvée pour evaluationsMatiereEnseignant')
    }

    if (evalStore.evaluations) {
      allEvaluations.value = evalStore.evaluations
    } else {
      console.warn('Aucune donnée trouvée pour evaluations')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des évaluations :', error)
  }
})

// Propriété calculée pour filtrer les évaluations
const evaluations = computed(() => {
  if (selectedFilter.value === 'perso') {
    return mesEvaluations.value
  } else if (selectedFilter.value === 'matieres') {
    return mesMatieresEvaluations.value
  } else if (selectedFilter.value === 'all') {
    return allEvaluations.value
  }
  return []
})

// Fonction pour calculer les jours restants ou de retard
const calcJoursRestants = (dateFin) => {
  const today = new Date();
  const endDate = new Date(dateFin);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays; // Retourne un nombre négatif si la date de fin est dépassée
};
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-full">
      <div class="flex justify-between items-center">
        <div class="font-bold text-xl">Liste des évaluations</div>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <label for="filter" class="text-sm font-medium">Filtrer par :</label>
        <select id="filter" v-model="selectedFilter" class="border border-gray-300 rounded-md p-2">
          <option value="perso">Mes évaluations</option>
          <option value="matieres">Mes matières</option>
          <option value="all">Toutes les évaluations</option>
        </select>
      </div>

      <div v-if="evaluations.length === 0" class="flex flex-col gap-2 mt-4 justify-center items-center mb-12">
        <DocumentTextIcon class="w-14 h-14 mx-auto text-gray-400" />
        <div class="flex flex-col items-center">
          <p class="text-sm m-0 p-0">Aucune évaluation trouvée.</p>
          <p class="text-gray-500 m-0 p-0">Créez votre première évaluation.</p>
        </div>
        <button>
          <router-link to="/evaluation/new" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Créer une évaluation
          </router-link>
        </button>
      </div>
      <div v-else v-for="evaluation in evaluations" class="p-1 w-full border-b border-gray-200 last:border-b-0 pb-4">
        <div class="flex md:flex-row flex-col justify-between md:items-center">
          <div class="flex items-center gap-2 md:max-w-2/3">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-4">
                <div>{{evaluation.name}}</div>
                <div v-if="evaluation.status === 0" class="bg-amber-100 text-amber-600 font-bold rounded-xl p-1 px-2 text-xs">
                  <div>
                    En attente
                  </div>
                </div>
                <div v-else-if="evaluation.status === 1" class="bg-blue-100 text-blue-600 font-bold rounded-xl p-1 px-2 text-xs">
                  <div>
                    En cours
                  </div>
                </div>
                <div v-else-if="evaluation.status === 2" class="bg-green-100 text-green-600 font-bold rounded-xl p-1 px-2 text-xs">
                  <div>
                    Cloturée
                  </div>
                </div>
                <div v-else-if="evaluation.status === 3" class="bg-red-100 text-red-600 font-bold rounded-xl p-1 px-2 text-xs">
                  <div>
                    Annulée
                  </div>
                </div>
              </div>
              <div>
                <div class="text-sm opacity-60">
                  <span>{{evaluation.matiereDetails?.name}}</span> | <span>{{evaluation.groupeDetails?.semestre}} - {{evaluation.groupeDetails?.type}} {{evaluation.groupeDetails?.name}}</span>
                </div>
                <div>
                <span v-if="evaluation.date_debut" class="text-xs text-gray-500">
                  Début : {{ new Date(evaluation.date_debut).toLocaleDateString() }}
                </span>
                  <span v-if="evaluation.date_fin" class="text-xs text-gray-500">
                  | Fin : {{ new Date(evaluation.date_fin).toLocaleDateString() }}
                </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="flex md:justify-start justify-between items-center gap-2">
              <div v-if="calcJoursRestants(evaluation.date_fin) > 0 && evaluation.status === 1" class="text-xs p-1 bg-blue-100 rounded-md text-blue-600 font-bold">
                <span v-if="evaluation.date_fin && evaluation.date_debut" class="flex items-center gap-1">
                  <ArrowRightIcon class="inline-block size-3" aria-hidden="true" />
                  {{ calcJoursRestants(evaluation.date_fin) }} jours
                </span>
              </div>
              <div v-else-if="calcJoursRestants(evaluation.date_fin) < 0 && evaluation.status === 1" class="text-xs p-1 bg-amber-100 rounded-md text-amber-600 font-bold">
                <span class="flex items-center gap-1">
                  <ExclamationTriangleIcon class="inline-block size-3" aria-hidden="true" />
                  En retard de {{ Math.abs(calcJoursRestants(evaluation.date_fin)) }} jours
                </span>
              </div>
              <button
                  class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer"
                  @click="router.push({ name: 'evaluation', params: { id: evaluation.id } })">
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
