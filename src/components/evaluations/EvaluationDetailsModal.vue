<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import { Evaluation } from "@/types/Evaluation";
import {
  XMarkIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon, PlusIcon, DocumentTextIcon, TrashIcon
} from "@heroicons/vue/24/outline";
import {useGrilleEvaluationStore} from '@/stores/grilleEvaluation';
import { useUserStore } from '@/stores/user';
import { useEvalStore } from '@/stores/evaluation';
import { usePagination } from '@/composables/usePagination';
import PaginationControls from '@/components/common/PaginationControls.vue';

const grilleStore = useGrilleEvaluationStore();
const userStore = useUserStore();
const evalStore = useEvalStore();

const grilles = ref(grilleStore.grilles);

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedGrilles,
  nextPage,
  prevPage
} = usePagination(grilles, 4);

onMounted(
  async () => {
    console.log(grilles.value);
  }
)

const props = defineProps<{
  evaluation: Evaluation;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const showModalGrille = ref(false);

const totalPoints = (grille: { criteres: { points: number }[] }) => {
  return grille.criteres.reduce((sum, critere) => sum + critere.points, 0);
};
</script>

<template>
  <div class="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-400/40">
    <div class="bg-white border border-gray-200 rounded-md z-50 w-2/3 max-h-4/5 overflow-y-auto shadow-md mx-auto p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h2 class="text-lg">Détails de l'évaluation</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
          <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
        </button>
      </div>
      <div class="flex flex-col gap-4" v-if="evaluation">
        <div  class="flex flex-col gap-2 pb-8 border-b border-b-gray-300">
          <h2 class="text-xl font-bold">{{ evaluation.name }}</h2>
          <div>
            <span v-if="evaluation.date_debut">
            Du {{new Date(evaluation.date_debut).toLocaleDateString("fr-FR", {weekday: "long", year: "numeric", month: "long", day: "numeric",}) }}
            </span>
            <span v-if="evaluation.date_fin">
            au {{ new Date(evaluation.date_fin).toLocaleDateString("fr-FR", {weekday: "long", year: "numeric", month: "long", day: "numeric",}) }}
            </span>
            <div class="text-gray-500">
              <span>Matière : {{evaluation.matiereDetails?.name}}</span> | <span>Auteur : {{evaluation.auteurDetails.prenom}} {{evaluation.auteurDetails.nom}}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <div class="w-1/3 flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md">
            <DocumentIcon class="inline-block size-7 p-1 text-gray-400" aria-hidden="true" />
          </div>
          <div class="w-1/3 flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md">
            <div v-if="evaluation.status === 0" class="bg-amber-100 text-amber-600 font-bold rounded-md p-1 px-2 text-xs">
              <div>
                En attente
              </div>
            </div>
            <div v-else-if="evaluation.status === 1" class="bg-blue-100 text-blue-600 font-bold rounded-md p-1 px-2 text-xs">
              <div>
                En cours
              </div>
            </div>
            <div v-else-if="evaluation.status === 2" class="bg-green-100 text-green-600 font-bold rounded-md p-1 px-2 text-xs">
              <div>
                Cloturée
              </div>
            </div>
            <div v-else-if="evaluation.status === 3" class="bg-red-100 text-red-600 font-bold rounded-md p-1 px-2 text-xs">
              <div>
                Annulée
              </div>
            </div>
          </div>
          <div class="w-1/3 flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md">
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
          </div>
        </div>

        <div>
          {{evaluation.description}}
        </div>

        <div class="flex flex-col gap-2">
          <div class="font-medium">Ressources utiles</div>
          <div v-for="ressource in evaluation.ressources">
            <div class="flex items-center justify-start gap-2 bg-gray-50 rounded px-3 py-2 text-sm">
              <ArrowTopRightOnSquareIcon class="inline-block size-7 p-1 text-gray-400" aria-hidden="true" />
              <a :href="ressource.url" target="_blank" class="text-blue-600 hover:underline">{{ ressource.name }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 pt-8 border-t border-t-gray-300">
        <div class="flex justify-between items-center">
          <div class="font-medium">Grilles d'évaluation</div>
          <div @click="showModalGrille = !showModalGrille" class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer flex items-center gap-1 w-fit">
            <PlusIcon class="inline-block size-4" aria-hidden="true"/>Ajouter une grille
          </div>
        </div>
        <div class="flex gap-4">
          <div v-for="(grille, index) in evaluation.grilleDetails" :key="index" class="border border-gray-200 rounded-md p-2 flex flex-col gap-2 w-1/2 hover:border-gray-400 hover:cursor-pointer transition-colors">
            <div class="flex justify-between items-center w-full">
              <div>
                {{ grille.name }}
              </div>
              <div :class="grille.type === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'" class="p-2 rounded-md text-xs font-medium">
                {{ grille.type === 2 ? "Étudiant" : "Enseignant" }}
              </div>
            </div>
            <ul class="flex flex-col gap-2">
              <li v-for="critere in grille.criteres" class="flex items-center gap-4 justify-between bg-gray-50 rounded px-3 py-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">{{ critere.name }} :</span>
                  <span class="text-gray-500 ml-1">{{ critere.description }}</span>
                </div>
                <span class="font-semibold text-gray-600">{{ critere.points }}<span class="text-gray-400">/</span>{{ totalPoints(grille) }}</span>
              </li>
            </ul>

            <button
                type="button"
                class="absolute bottom-0 right-0 text-red-600 hover:text-red-800 transition-colors hover:cursor-pointer z-10"
                @click="evaluation.grilleDetails.splice(index, 1)">
              <TrashIcon class="inline-block size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showModalGrille" class="fixed inset-0 flex items-center justify-center bg-gray-400/40">
    <div class="bg-white border border-gray-200 rounded-md z-50 w-1/2 h-fit shadow-md mx-auto p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h2 class="text-lg">Choisissez la grille à ajouter à votre évaluation</h2>
        <button @click="showModalGrille = false" class="text-gray-500 hover:text-gray-800">
          <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
        </button>
      </div>
      <div>
        <div v-if="grilles.length === 0" class="flex flex-col gap-2 justify-center items-center mb-12">
          <DocumentTextIcon class="w-14 h-14 mx-auto text-gray-400" />
          <div class="flex flex-col items-center">
            <p class="text-sm m-0 p-0">Aucune grille d'évaluation trouvée.</p>
            <p class="text-gray-500 m-0 p-0">Créez votre première grille d'évaluation.</p>
          </div>
          <button>
            <router-link to="" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Créer une grille d'évaluation
            </router-link>
          </button>
        </div>
        <div v-else class="flex flex-col gap-6">
          <button>
            <router-link to="" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Créer une grille d'évaluation
            </router-link>
          </button>
          <div class="flex flex-col gap-2">
            <button v-for="grille in paginatedGrilles" class="border border-gray-200 p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer text-left disabled:bg-gray-100 disabled:hover:cursor-auto" :disabled="evaluation.grilles.some(g => g === grille.id)" @click="evalStore.addGrilleToEvaluation(evaluation.id, grille)" :key="grille.id">
              <div class="flex md:flex-row flex-col justify-between md:items-center">
                <div>
                  <div class="font-medium">{{grille.name}}</div>
                  <div class="text-sm text-gray-500">
                    Auteur: {{ grille.auteurDetails.prenom }} {{ grille.auteurDetails.nom }}
                  </div>
                </div>
              </div>
            </button>
          </div>
          <PaginationControls
              :current-page="currentPage"
              :total-pages="totalPages"
              @prev-page="prevPage"
              @next-page="nextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
