<script setup lang="ts">
import { Evaluation } from "@/types/Evaluation";
import {
  XMarkIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  evaluation: Evaluation;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const totalPoints = (grille: { criteres: { points: number }[] }) => {
  return grille.criteres.reduce((sum, critere) => sum + critere.points, 0);
};
</script>

<template>
  <div class="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-400/40">
    <div class="bg-white border border-gray-200 rounded-md z-50 w-2/3 h-fit shadow-md mx-auto p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h2 class="text-lg">Détails de l'évaluation</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
          <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
        </button>
      </div>
      <div class="flex flex-col gap-4" v-if="evaluation">
        <div  class="flex flex-col gap-2">
          <h2 class="text-xl font-bold">{{ evaluation.name }}</h2>
          <div>
          <span v-if="evaluation.date_debut" class="text-gray-500">
            Du {{new Date(evaluation.date_debut).toLocaleDateString("fr-FR", {weekday: "long", year: "numeric", month: "long", day: "numeric",}) }}
          </span>
            <span v-if="evaluation.date_fin" class="text-gray-500">
            au {{ new Date(evaluation.date_fin).toLocaleDateString("fr-FR", {weekday: "long", year: "numeric", month: "long", day: "numeric",}) }}
          </span>
            <div>
              <span class="text-sm text-gray-500">Matière : {{ evaluation.matiereDetails?.name }}</span>
              <span class="text-sm text-gray-500 ml-4">Groupe : {{ evaluation.groupeDetails?.semestre }} - {{ evaluation.groupeDetails?.type }} {{ evaluation.groupeDetails?.name }}</span>
              <span class="text-sm text-gray-500 ml-4">Auteur : {{ evaluation.auteurDetails.prenom }} {{ evaluation.auteurDetails.nom }}
              </span>
            </div>
          </div>
        </div>
        <hr>

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

      <div class="flex flex-col gap-2">
        <div class="font-medium">Grilles d'évaluation</div>
        <div class="flex gap-4">
          <div v-for="grille in evaluation.grilleDetails" class="border border-gray-200 rounded-md p-2 flex flex-col gap-2 w-1/2 hover:border-gray-400 hover:cursor-pointer transition-colors" :key="grille.id">
            <div class="flex justify-between items-center w-full">
              <div>
                {{ grille.name }}
              </div>
              <div :class="grille.type === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'" class="p-2 rounded-md text-xs font-medium">
                {{ grille.type === 2 ? "Étudiant" : "Enseignant" }}
              </div>
            </div>
            <ul class="flex flex-col gap-2">
              <li v-for="critere in grille.criteres" class="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">{{ critere.name }} :</span>
                  <span class="text-gray-500 ml-1">{{ critere.description }}</span>
                </div>
                <span class="font-semibold text-gray-600">{{ critere.points }}<span class="text-gray-400">/</span>{{ totalPoints(grille) }}
      </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
