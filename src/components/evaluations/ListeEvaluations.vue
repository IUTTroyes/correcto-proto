<script setup lang="ts">
import { useEvalStore } from '@/stores/evaluation';
import { ref, onMounted, computed, watch } from 'vue';
import type { Evaluation } from "@/types/Evaluation";
import EvaluationDetailsModal from "@/components/evaluations/EvaluationDetailsModal.vue";
import { DocumentTextIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { ArrowRightIcon } from "@heroicons/vue/24/outline/index.js";

const evalStore = useEvalStore();

const allEvaluations = ref<Evaluation[]>([]);
const mesEvaluations = ref<Evaluation[]>([]);
const mesMatieresEvaluations = ref<Evaluation[]>([]);
const selectedFilter = ref<'perso' | 'matieres' | 'all'>('perso'); // Typage des filtres
const selectedEvaluation = ref<Evaluation | null>(null);
const isModalOpen = ref(false);

onMounted(async () => {
  try {
    if (evalStore.evaluationsEnseignant) {
      mesEvaluations.value = evalStore.evaluationsEnseignant;
    } else {
      console.warn('Aucune donnée trouvée pour evaluationsEnseignant');
    }

    if (evalStore.evaluationsMatiereEnseignant) {
      mesMatieresEvaluations.value = evalStore.evaluationsMatiereEnseignant;
    } else {
      console.warn('Aucune donnée trouvée pour evaluationsMatiereEnseignant');
    }

    if (evalStore.evaluations) {
      allEvaluations.value = evalStore.evaluations;
    } else {
      console.warn('Aucune donnée trouvée pour evaluations');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des évaluations :', error);
  }
});

const evaluations = computed(() => {
  if (selectedFilter.value === 'perso') {
    return mesEvaluations.value;
  } else if (selectedFilter.value === 'matieres') {
    return mesMatieresEvaluations.value;
  } else if (selectedFilter.value === 'all') {
    return allEvaluations.value;
  }
  return [];
});

const openModal = (evaluation: Evaluation) => {
  selectedEvaluation.value = evaluation;
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedEvaluation.value = null;
  isModalOpen.value = false;
};

watch(isModalOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : '';
});
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
              <div v-if="evaluation.joursRestants > 0 && evaluation.status === 1" class="text-xs p-1 bg-blue-100 rounded-md text-blue-600 font-bold">
                <span v-if="evaluation.date_fin && evaluation.date_debut" class="flex items-center gap-1">
                  <ArrowRightIcon class="inline-block size-3" aria-hidden="true" />
                  {{ evaluation.joursRestants }} jours
                </span>
              </div>
              <div v-else-if="evaluation.joursRestants < 0 && evaluation.status === 1" class="text-xs p-1 bg-amber-100 rounded-md text-amber-600 font-bold">
                <span class="flex items-center gap-1">
                  <ExclamationTriangleIcon class="inline-block size-3" aria-hidden="true" />
                  En retard de {{ evaluation.joursRestants }} jours
                </span>
              </div>
              <button
                  class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer"
                  @click="openModal(evaluation)">
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <EvaluationDetailsModal v-if="isModalOpen" :evaluation="selectedEvaluation" @close="closeModal"/>

</template>
