<script setup lang="ts">
import {ref} from 'vue';
import { GrilleEvaluation } from "@/types/GrilleEvaluation";
import {
  XMarkIcon,
  DocumentIcon
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  grille: GrilleEvaluation;
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
    <div class="bg-white border border-gray-200 rounded-md z-50 w-2/3 max-h-4/5 overflow-y-auto shadow-md mx-auto p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h2 class="text-lg">Détails de la grille d'évaluation</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
          <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
        </button>
      </div>
      <div class="flex flex-col gap-4" v-if="grille">
        <div class="flex flex-col gap-2 pb-8 border-b border-b-gray-300">
          <div class="flex flex-row items-center justify-between">
            <h2 class="text-xl font-bold">{{ grille.name }}</h2>
            <div :class="grille.type === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'" class="p-2 rounded-md text-sm font-medium">
              {{ grille.type === 2 ? "Auto-évaluation (Étudiant)" : "Évaluation (Enseignant)" }}
            </div>
          </div>
          <div class="flex-col gap-1">
            <div class="text-gray-700 italic">{{ grille.description }}</div>
            <div class="text-gray-500 text-sm">
              <span>Date de création: {{ new Date(grille.date_creation).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"}) }}</span> |
              <span>Dernière modification: {{ new Date(grille.date_modification).toLocaleDateString("fr-FR", {year: "numeric", month: "long", day: "numeric"}) }}</span> |
              <span>Auteur: {{ grille.auteurDetails?.prenom }} {{ grille.auteurDetails?.nom }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <div class="w-1/2 flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md">
          </div>
          <div class="w-1/2 flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md">

          </div>
        </div>

        <div class="flex flex-col gap-2 pt-8 border-t border-t-gray-300">
          <div class="font-medium">Critères d'évaluation</div>
          <div class="w-full">
            <ul class="flex flex-col gap-2">
              <li v-for="critere in grille.criteres" class="flex items-center gap-4 justify-between bg-gray-50 rounded px-3 py-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">{{ critere.name }} :</span>
                  <span class="text-gray-500 ml-1">{{ critere.description }}</span>
                </div>
                <span class="font-semibold text-gray-600">{{ critere.points }}<span class="text-gray-400">/</span>{{ totalPoints(grille) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
