<script setup>
import {useUserStore} from "@/stores/user.js";
import { useEvalStore } from "@/stores/evaluation.js";
import {onMounted, ref} from "vue";
import { BookOpenIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const userStore = useUserStore();
const user = ref(null);

const evalStore = useEvalStore();
const evaluations = ref([]);

onMounted(async () => {
  user.value = await userStore.user;

  evaluations.value = await evalStore.getEvaluationsEnseignant(user.value.id, true);
  console.log(evaluations.value);
});
</script>

<template>
<div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4">
  <div class="font-bold text-xl">Évaluations en cours</div>
  <div class="flex flex-col gap-3">
    <div v-for="evaluation in evaluations" class="p-1 w-full">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="bg-red-100 p-2 rounded-md">
            <BookOpenIcon class="inline-block size-6 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <div>{{evaluation.name}}</div>
            <div class="text-sm opacity-60"><span>{{evaluation.matiereDetails?.name}}</span> | <span>{{evaluation.groupeDetails.semestre}} - {{evaluation.groupeDetails.type}} {{evaluation.groupeDetails.name}}</span></div>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <div class="text-xs p-1 bg-blue-100 rounded-md text-blue-600 font-bold">

              <span v-if="evaluation.date_fin && evaluation.date_debut" class="flex items-center gap-1">
                <ArrowRightIcon class="inline-block size-3" aria-hidden="true" />
              {{
                  Math.max(
                      0,
                      Math.floor(
                          (new Date(evaluation.date_fin) - new Date()) / (1000 * 60 * 60 * 24)
                      )
                  )
                }} jours
            </span>
            </div>
            <button
              class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer"
              @click="$router.push({ name: 'evaluation', params: { id: evaluation.id } })">
              Détails
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
