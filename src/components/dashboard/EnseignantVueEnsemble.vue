<script setup lang="ts">
import {ArrowRightIcon, BookOpenIcon, ExclamationTriangleIcon} from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";
import type { Evaluation } from "@/types/Evaluation";

const props = defineProps<{
  evaluations: Evaluation[];
}>();

const router = useRouter();
</script>

<template>
  <div class="flex md:flex-row flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 md:w-2/3">
      <div class="flex justify-between items-center">
        <div class="font-bold text-xl">Évaluations en cours</div>
        <a href="/evaluations" class="underline text-red-600">Voir toutes <ArrowRightIcon class="inline-block size-4" aria-hidden="true" /></a>
      </div>
      <div class="flex flex-col gap-3">
        <div v-for="evaluation in props.evaluations" class="p-1 w-full">
          <div class="flex md:flex-row flex-col justify-between md:items-center">
            <div class="flex items-center gap-2 md:max-w-2/3">
              <div class="bg-red-100 p-2 rounded-md">
                <BookOpenIcon class="inline-block size-6 text-red-400" aria-hidden="true" />
              </div>
              <div>
                <div>{{evaluation.name}}</div>
                <div class="text-sm opacity-60"><span>{{evaluation.matiereDetails?.name}}</span> | <span>{{evaluation.groupeDetails.semestre}} - {{evaluation.groupeDetails.type}} {{evaluation.groupeDetails.name}}</span></div>
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
                    @click="router.push({ name: 'evaluation', params: { id: evaluation.id } })">
                  Détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 md:w-1/3">
      <div class="font-bold text-xl">Activités récentes</div>
      <div class="flex flex-col">
        <div class="p-1 w-full">
          <div class="text-sm"><XCircleIcon class="inline-block size-3 text-green-500" aria-hidden="true"/> Machin a rendu : <span class="font-bold">Développer une application web complète et fonctionnelle</span></div>
          <span class="text-xs opacity-60">Il y a 1 jour</span>
        </div>
        <div class="p-1 w-full">
          <div class="text-sm"><XCircleIcon class="inline-block size-3 text-blue-500" aria-hidden="true"/> Évaluation terminée pour <span class="font-bold">TP Algorithmes</span></div>
          <span class="text-xs opacity-60">Il y a 2 jours</span>
        </div>
        <div class="p-1 w-full">
          <div class="text-sm"><XCircleIcon class="inline-block size-3 text-amber-500" aria-hidden="true"/> Rappel envoyé pour échéance <span class="font-bold">Base de Données</span></div>
          <span class="text-xs opacity-60">Il y a 2 jours</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
