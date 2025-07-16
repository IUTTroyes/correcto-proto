<script setup lang="ts">
import {Evaluation} from "@/types/Evaluation";
import {XMarkIcon} from "@heroicons/vue/24/outline";

const props = defineProps<{
  evaluation: Evaluation;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-400/40">
    <div class="bg-white border border-gray-200 rounded-md z-50 w-2/3 h-fit max-h-1/2 shadow-md mx-auto p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h2 class="text-lg">Détails de l'évaluation</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
          <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
        </button>
      </div>
      <div>
        <h2 class="text-xl font-bold">{{evaluation.name}}</h2>
        <div>
          <span v-if="evaluation.date_debut" class="text-gray-500">Du {{ new Date(evaluation.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          <span v-if="evaluation.date_fin" class="text-gray-500"> au {{ new Date(evaluation.date_fin).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="font-medium text-lg">Grilles d'évaluation</div>
        <div class="flex items-center gap-4">
          <div v-for="grille in evaluation.grilleDetails" class="border border-gray-200 rounded-md p-2 flex flex-col gap-2 w-1/2">
            <div class="flex justify-between items-center w-full">
              <div>
                {{grille.name}}
              </div>
              <div :class="grille.type === 1 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'" class="p-2 rounded-md text-xs font-medium">{{ grille.type === 2 ? 'Étudiant' : 'Enseignant' }}</div>
            </div>
            <div>
              <div v-for="critere in grille.criteres" class="text-sm text-gray-600">
                <span class="font-medium">{{ critere.name }}:</span> {{ critere.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
